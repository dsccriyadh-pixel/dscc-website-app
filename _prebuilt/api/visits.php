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

// --- Server-side IP geolocation (country + city), cached on disk. ---
function dscc_visit_geo() {
    $ip = trim((string) ($_SERVER['REMOTE_ADDR'] ?? ''));
    $ip = preg_replace('/^::ffff:/', '', $ip);
    if ($ip === '' || $ip === '127.0.0.1' || $ip === '::1'
        || preg_match('/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|fc|fe80)/i', $ip)) {
        return ['cc' => '', 'city' => ''];
    }
    $cacheFile = dscc_data_dir() . '/geo_cache.json';
    $cache = dscc_read_json($cacheFile, []);
    if (!is_array($cache)) $cache = [];
    $nowTs = time();
    if (isset($cache[$ip]) && is_array($cache[$ip]) && ($nowTs - (int) ($cache[$ip]['ts'] ?? 0)) < 7 * 86400) {
        return ['cc' => (string) ($cache[$ip]['cc'] ?? ''), 'city' => (string) ($cache[$ip]['city'] ?? '')];
    }
    // Rate limit external lookups (max 30/min) and back off after repeated
    // failures (skip lookups for 5 minutes after 3 recent failures).
    $meta = isset($cache['_meta']) && is_array($cache['_meta']) ? $cache['_meta'] : [];
    $minute = (int) floor($nowTs / 60);
    $rlCount = ((int) ($meta['rlMin'] ?? 0)) === $minute ? (int) ($meta['rlN'] ?? 0) : 0;
    $failN = (int) ($meta['failN'] ?? 0);
    $failTs = (int) ($meta['failTs'] ?? 0);
    if ($rlCount >= 30 || ($failN >= 3 && ($nowTs - $failTs) < 300)) {
        return ['cc' => '', 'city' => ''];
    }
    $cc = ''; $city = '';
    $lookupOk = false;
    try {
        $ctx = stream_context_create(['http' => ['timeout' => 1.5], 'ssl' => ['verify_peer' => true]]);
        $resp = @file_get_contents('https://ipwho.is/' . rawurlencode($ip) . '?fields=success,country_code,city', false, $ctx);
        if ($resp !== false) {
            $d = json_decode($resp, true);
            if (is_array($d)) {
                $lookupOk = true;
                if (!empty($d['success'])) {
                    $cc = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', (string) ($d['country_code'] ?? '')), 0, 2));
                    $city = substr(str_replace('|', '', trim((string) ($d['city'] ?? ''))), 0, 60);
                }
            }
        }
    } catch (Throwable $e) {
        // Geo is best-effort; never fail the beacon.
    }
    try {
        dscc_file_mutate($cacheFile, [], function (&$c) use ($ip, $cc, $city, $nowTs, $minute, $rlCount, $lookupOk) {
            if (!is_array($c)) $c = [];
            $meta = isset($c['_meta']) && is_array($c['_meta']) ? $c['_meta'] : [];
            $meta['rlMin'] = $minute;
            $meta['rlN'] = $rlCount + 1;
            if ($lookupOk) {
                $meta['failN'] = 0;
            } else {
                $meta['failN'] = (int) ($meta['failN'] ?? 0) + 1;
                $meta['failTs'] = $nowTs;
            }
            $c['_meta'] = $meta;
            if ($lookupOk) {
                $c[$ip] = ['cc' => $cc, 'city' => $city, 'ts' => $nowTs];
            }
            if (count($c) > 3000) {
                $m = $c['_meta'];
                unset($c['_meta']);
                uasort($c, function ($a, $b) { return ((int) ($a['ts'] ?? 0)) <=> ((int) ($b['ts'] ?? 0)); });
                $c = array_slice($c, -3000, null, true);
                $c['_meta'] = $m;
            }
        });
    } catch (Throwable $e) {
    }
    return ['cc' => $cc, 'city' => $city];
}

// Answer the beacon immediately, then geolocate + persist after the client
// has disconnected (fastcgi_finish_request is available on Hostinger's
// PHP-FPM; the fallback flush keeps behaviour correct elsewhere).
http_response_code(204);
if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
} else {
    ignore_user_abort(true);
    if (ob_get_level() > 0) @ob_end_flush();
    @flush();
}

$geo = dscc_visit_geo();
$cc = $geo['cc'];
$city = $geo['city'];

$file = dscc_data_dir() . '/visits.json';
try {
    dscc_file_mutate($file, ['days' => []], function (&$data) use ($day, $hour, $path, $src, $sid, $dev, $cc, $city) {
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
        if ($cc !== '') {
            if (!isset($d['cn']) || !is_array($d['cn'])) $d['cn'] = [];
            if (count($d['cn']) < 100 || isset($d['cn'][$cc])) {
                $d['cn'][$cc] = ($d['cn'][$cc] ?? 0) + 1;
            }
            if ($city !== '') {
                $ck = $city . '|' . $cc;
                if (!isset($d['ct']) || !is_array($d['ct'])) $d['ct'] = [];
                if (count($d['ct']) < 200 || isset($d['ct'][$ck])) {
                    $d['ct'][$ck] = ($d['ct'][$ck] ?? 0) + 1;
                }
            }
        }
        // Rolling log of recent visits for the live dashboard (max 500).
        if (!isset($data['recent']) || !is_array($data['recent'])) $data['recent'] = [];
        array_unshift($data['recent'], [
            'ts' => (int) round(microtime(true) * 1000),
            'path' => $path,
            'src' => $src,
            'sid' => $sid,
            'dev' => $dev,
            'cc' => $cc,
            'city' => $city,
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
