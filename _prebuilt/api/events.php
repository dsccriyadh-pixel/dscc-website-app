<?php
// DSCC public action-event beacon — POST /api/event records one site action
// (whatsapp_click, phone_click, email_click, chat_open, download_click...).
// Stores recent event log + per-day type aggregates. No personal data.

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
$body = json_decode($raw, true);
if (!is_array($body)) $body = [];

$type = isset($body['type']) && is_string($body['type']) ? substr(trim($body['type']), 0, 40) : '';
$type = preg_replace('/[^a-z0-9_\-]/i', '', $type);
if ($type === '' || $type === null) {
    http_response_code(204);
    exit;
}
$label = isset($body['label']) && is_string($body['label']) ? substr(trim($body['label']), 0, 200) : '';
$label = preg_replace('/[^\w .:\/?&=%#+\-]/u', '', $label);
$path = isset($body['path']) && is_string($body['path']) ? substr(trim($body['path']), 0, 200) : '';
if ($path === '' || $path[0] !== '/') $path = '/';
$src = isset($body['src']) && is_string($body['src']) ? substr(trim($body['src']), 0, 60) : 'direct';
$src = preg_replace('/[^a-z0-9_.\-]/i', '', $src);
if ($src === '' || $src === null) $src = 'direct';
$eventId = isset($body['event_id']) && is_string($body['event_id']) ? preg_replace('/[^A-Za-z0-9_-]/', '', $body['event_id']) : '';
$eventId = substr((string) $eventId, 0, 128);

try {
    $tz = new DateTimeZone('Asia/Riyadh');
    $day = (new DateTime('now', $tz))->format('Y-m-d');
} catch (Throwable $e) {
    $day = gmdate('Y-m-d');
}

$file = dscc_data_dir() . '/events.json';
try {
    dscc_file_mutate($file, ['recent' => [], 'days' => []], function (&$data) use ($day, $type, $label, $path, $src, $eventId) {
        if (!isset($data['recent']) || !is_array($data['recent'])) $data['recent'] = [];
        if (!isset($data['days']) || !is_array($data['days'])) $data['days'] = [];
        if ($eventId !== '') foreach ($data['recent'] as $existing) if (($existing['id'] ?? '') === $eventId) return;
        // Hard daily ceiling so spam cannot bloat the file.
        $dayTotal = 0;
        foreach (($data['days'][$day] ?? []) as $v) $dayTotal += (int) $v;
        if ($dayTotal >= 20000) return;
        array_unshift($data['recent'], [
            'id' => $eventId !== '' ? $eventId : 'e_' . base_convert((string) (int) (microtime(true) * 1000), 10, 36) . '_' . substr(bin2hex(random_bytes(4)), 0, 6),
            'ts' => gmdate('c'),
            'type' => $type,
            'label' => (string) $label,
            'path' => $path,
            'src' => $src,
        ]);
        if (count($data['recent']) > 1000) $data['recent'] = array_slice($data['recent'], 0, 1000);
        if (!isset($data['days'][$day]) || !is_array($data['days'][$day])) $data['days'][$day] = [];
        $d = &$data['days'][$day];
        if (count($d) < 50 || isset($d[$type])) {
            $d[$type] = ($d[$type] ?? 0) + 1;
        }
        if (count($data['days']) > 400) {
            ksort($data['days']);
            $data['days'] = array_slice($data['days'], -400, null, true);
        }
    });
} catch (Throwable $e) {
    // Never fail the client because of tracking.
}

http_response_code(204);
exit;
