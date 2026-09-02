<?php
// Public anonymized social-proof feed: recent showroom bookings + calculator leads.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

require_once __DIR__ . '/_store.php';

$leads = dscc_read_json(dscc_leads_file(), []);
if (!is_array($leads)) $leads = [];

$now = time();
$weekAgo = $now - 7 * 24 * 3600;

$recent = [];
foreach ($leads as $l) {
    if (!is_array($l)) continue;
    $src = $l['source'] ?? '';
    if ($src !== 'showroom' && $src !== 'calculator') continue;
    if (!empty($l['raw']['seeded'])) continue;
    $ts = strtotime($l['createdAt'] ?? '');
    if ($ts === false || $ts < $weekAgo) continue;
    $recent[] = ['l' => $l, 'ts' => $ts];
}

usort($recent, function ($a, $b) { return $b['ts'] <=> $a['ts']; });

$items = [];
foreach (array_slice($recent, 0, 10) as $r) {
    $l = $r['l'];
    $full = trim((string)($l['fullName'] ?? ''));
    $parts = preg_split('/\s+/u', $full);
    $items[] = [
        'name'       => $parts[0] ?? '',
        'city'       => (string)($l['city'] ?? ''),
        'source'     => (string)($l['source'] ?? ''),
        'minutesAgo' => max(1, (int) round(($now - $r['ts']) / 60)),
    ];
}

$weeklyShowroomCount = 0;
foreach ($recent as $r) {
    if (($r['l']['source'] ?? '') === 'showroom') $weeklyShowroomCount++;
}

echo json_encode([
    'ok' => true,
    'items' => $items,
    'weeklyCount' => count($recent),
    'weeklyShowroomCount' => $weeklyShowroomCount,
], JSON_UNESCAPED_UNICODE);
