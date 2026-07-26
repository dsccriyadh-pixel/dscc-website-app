<?php
// DSCC public chat log — POST /api/chatlog upserts a Sara conversation by session id.
// Read by the admin dashboard's conversations page.

require_once __DIR__ . '/_store.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Abuse guard: when a browser sends Origin/Referer, it must match our host.
$reqHost = strtolower($_SERVER['HTTP_HOST'] ?? '');
foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $h) {
    if (!empty($_SERVER[$h])) {
        $host = strtolower((string) parse_url($_SERVER[$h], PHP_URL_HOST));
        if ($host !== '' && $reqHost !== '' && $host !== $reqHost && $host !== 'www.' . $reqHost && 'www.' . $host !== $reqHost) {
            http_response_code(204);
            exit;
        }
        break;
    }
}

$raw = file_get_contents('php://input');
if (strlen($raw) > 200000) { // 200 KB payload ceiling
    http_response_code(204);
    exit;
}
$body = json_decode($raw, true);
if (!is_array($body)) $body = [];

$sid = isset($body['sessionId']) && is_string($body['sessionId']) ? substr(trim($body['sessionId']), 0, 60) : '';
$sid = preg_replace('/[^a-z0-9_\-]/i', '', $sid);
if ($sid === '' || $sid === null) {
    http_response_code(204);
    exit;
}
$lang = isset($body['lang']) && is_string($body['lang']) ? substr(preg_replace('/[^a-z\-]/i', '', $body['lang']), 0, 10) : '';
$src = isset($body['src']) && is_string($body['src']) ? substr(trim($body['src']), 0, 60) : 'direct';
$src = preg_replace('/[^a-z0-9_.\-]/i', '', $src);
if ($src === '' || $src === null) $src = 'direct';
$page = isset($body['page']) && is_string($body['page']) ? substr(trim($body['page']), 0, 200) : '';
if ($page === '' || $page[0] !== '/') $page = '/';
$name = isset($body['name']) && is_string($body['name']) ? substr(trim($body['name']), 0, 100) : '';
$phone = isset($body['phone']) && is_string($body['phone']) ? substr(preg_replace('/[^0-9+\s\-()]/', '', trim($body['phone'])), 0, 30) : '';

$messages = [];
if (isset($body['messages']) && is_array($body['messages'])) {
    foreach (array_slice($body['messages'], -60) as $m) {
        if (!is_array($m)) continue;
        $role = $m['role'] ?? '';
        $content = $m['content'] ?? '';
        if (($role === 'user' || $role === 'assistant') && is_string($content) && trim($content) !== '') {
            $messages[] = ['role' => $role, 'content' => substr($content, 0, 2000)];
        }
    }
}
if (count($messages) === 0) {
    http_response_code(204);
    exit;
}

$now = gmdate('c');
$file = dscc_data_dir() . '/chats.json';
try {
    dscc_file_mutate($file, ['sessions' => []], function (&$data) use ($sid, $lang, $src, $page, $messages, $now, $name, $phone) {
        if (!isset($data['sessions']) || !is_array($data['sessions'])) $data['sessions'] = [];
        $existing = $data['sessions'][$sid] ?? null;
        $data['sessions'][$sid] = [
            'id' => $sid,
            'startedAt' => is_array($existing) && isset($existing['startedAt']) ? $existing['startedAt'] : $now,
            'updatedAt' => $now,
            'lang' => $lang !== '' ? $lang : (is_array($existing) ? ($existing['lang'] ?? '') : ''),
            'src' => is_array($existing) && isset($existing['src']) ? $existing['src'] : $src,
            'page' => is_array($existing) && isset($existing['page']) ? $existing['page'] : $page,
            'name' => $name !== '' ? $name : (is_array($existing) ? (string) ($existing['name'] ?? '') : ''),
            'phone' => $phone !== '' ? $phone : (is_array($existing) ? (string) ($existing['phone'] ?? '') : ''),
            'messages' => $messages,
        ];
        if (count($data['sessions']) > 300) {
            uasort($data['sessions'], function ($a, $b) {
                return strcmp($a['updatedAt'] ?? '', $b['updatedAt'] ?? '');
            });
            $data['sessions'] = array_slice($data['sessions'], -300, null, true);
        }
    });
} catch (Throwable $e) {
    // Never fail the client because of logging.
}

http_response_code(204);
exit;
