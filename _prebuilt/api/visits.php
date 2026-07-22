<?php
// DSCC public visit counter — POST /api/visit records one page view.
// Aggregated per day (Asia/Riyadh): totals, sources, pages. No personal data stored.

require_once __DIR__ . '/_store.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Abuse guard 1: when a browser sends Origin/Referer, it must match our host.
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

$path = isset($body['path']) && is_string($body['path']) ? substr(trim($body['path']), 0, 200) : '';
if ($path === '' || $path[0] !== '/') $path = '/';
$src = isset($body['src']) && is_string($body['src']) ? substr(trim($body['src']), 0, 60) : 'direct';
$src = preg_replace('/[^a-z0-9_.\-]/i', '', $src);
if ($src === '' || $src === null) $src = 'direct';
$sid = isset($body['sid']) && is_string($body['sid']) ? substr(preg_replace('/[^a-z0-9]/i', '', $body['sid']), 0, 24) : '';
if ($sid === '' || $sid === null) $sid = 'anon';
$dev = isset($body['dev']) && is_string($body['dev']) && in_array($body['dev'], ['mobile', 'tablet', 'desktop'], true) ? $body['dev'] : 'other';

try {
    $tz = new DateTimeZone('Asia/Riyadh');
    $now = new DateTime('now', $tz);
    $day = $now->format('Y-m-d');
    $hour = $now->format('H');
} catch (Throwable $e) {
    $day = gmdate('Y-m-d');
    $hour = gmdate('H');
}

$file = dscc_data_dir() . '/visits.json';
try {
    dscc_file_mutate($file, ['days' => []], function (&$data) use ($day, $hour, $path, $src, $sid, $dev) {
        if (!isset($data['days']) || !is_array($data['days'])) $data['days'] = [];
        if (!isset($data['days'][$day]) || !is_array($data['days'][$day])) {
            $data['days'][$day] = ['t' => 0, 'src' => [], 'p' => []];
        }
        $d = &$data['days'][$day];
        // Abuse guard 2: hard daily ceiling so spam cannot bloat the file or stats.
        if (($d['t'] ?? 0) >= 50000) return;
        $d['t'] = ($d['t'] ?? 0) + 1;
        if (count($d['src']) < 100 || isset($d['src'][$src])) {
            $d['src'][$src] = ($d['src'][$src] ?? 0) + 1;
        }
        if (count($d['p']) < 200 || isset($d['p'][$path])) {
            $d['p'][$path] = ($d['p'][$path] ?? 0) + 1;
        }
        if (!isset($d['h']) || !is_array($d['h'])) $d['h'] = [];
        $d['h'][$hour] = ($d['h'][$hour] ?? 0) + 1;
        if (!isset($d['dev']) || !is_array($d['dev'])) $d['dev'] = [];
        $d['dev'][$dev] = ($d['dev'][$dev] ?? 0) + 1;
        // Rolling log of recent visits for the live dashboard (max 500).
        if (!isset($data['recent']) || !is_array($data['recent'])) $data['recent'] = [];
        array_unshift($data['recent'], [
            'ts' => (int) round(microtime(true) * 1000),
            'path' => $path,
            'src' => $src,
            'sid' => $sid,
            'dev' => $dev,
        ]);
        if (count($data['recent']) > 500) $data['recent'] = array_slice($data['recent'], 0, 500);
        // Keep at most 400 days of history.
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
