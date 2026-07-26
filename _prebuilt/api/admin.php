<?php
// DSCC admin API front controller. Routes /api/admin/* requests for the
// dscc-admin dashboard. Bearer-token auth against DSCC_ADMIN_TOKEN (config.php).

require_once __DIR__ . '/_store.php';
if (file_exists(__DIR__ . '/config.php')) { @require_once __DIR__ . '/config.php'; }

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

date_default_timezone_set('UTC');
define('BIZ_TZ', 'Asia/Riyadh');

function adm_out($code, $payload) {
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function adm_token() {
    // Accept either DSCC_ADMIN_TOKEN or ADMIN_TOKEN (define() in config.php or env).
    foreach (['DSCC_ADMIN_TOKEN', 'ADMIN_TOKEN'] as $name) {
        if (defined($name) && constant($name)) return constant($name);
        $env = getenv($name);
        if ($env) return $env;
    }
    $f = __DIR__ . '/.admin_token';
    if (is_file($f)) { $t = trim(@file_get_contents($f)); if ($t !== '') return $t; }
    return null;
}

function adm_cred() {
    // Username/password for the login screen. Falls back to a default username
    // and to the bearer token as the password so older single-secret setups work.
    $user = null; $pass = null;
    if (defined('ADMIN_USERNAME') && constant('ADMIN_USERNAME') !== '') { $user = constant('ADMIN_USERNAME'); }
    elseif (($e = getenv('ADMIN_USERNAME')) !== false && $e !== '') { $user = $e; }
    if (defined('ADMIN_PASSWORD') && constant('ADMIN_PASSWORD') !== '') { $pass = constant('ADMIN_PASSWORD'); }
    elseif (($e = getenv('ADMIN_PASSWORD')) !== false && $e !== '') { $pass = $e; }
    if ($user === null) $user = 'admin';
    if ($pass === null) $pass = adm_token();
    return [$user, $pass];
}

function adm_bearer() {
    $h = '';
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $h = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $h = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower($k) === 'authorization') { $h = $v; break; }
        }
    }
    if (stripos($h, 'Bearer ') === 0) return trim(substr($h, 7));
    if (!empty($_SERVER['HTTP_X_ADMIN_TOKEN'])) return trim($_SERVER['HTTP_X_ADMIN_TOKEN']);
    return '';
}

function adm_require_auth() {
    $expected = adm_token();
    if (!$expected) {
        adm_out(500, ['error' => "Admin token not configured. Add  define('ADMIN_TOKEN', 'your-secret');  to api/config.php"]);
    }
    $got = adm_bearer();
    if ($got === '' || !hash_equals((string) $expected, (string) $got)) {
        adm_out(401, ['error' => 'Unauthorized']);
    }
}

function adm_body() {
    $raw = file_get_contents('php://input');
    $b = json_decode($raw, true);
    return is_array($b) ? $b : [];
}

function adm_query($k) {
    $v = $_GET[$k] ?? null;
    return is_string($v) ? $v : null;
}

// ---------- routing ----------
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';
$uri = rawurldecode($uri);
$pos = strpos($uri, '/api/admin');
$sub = $pos !== false ? substr($uri, $pos + strlen('/api/admin')) : '';
$sub = '/' . trim($sub, '/');
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// ---------- LOGIN (no auth required) ----------
if ($sub === '/login' && $method === 'POST') {
    $expected = adm_token();
    if (!$expected) {
        adm_out(500, ['error' => 'Admin token not configured.']);
    }
    list($u, $p) = adm_cred();
    $body = adm_body();
    $gotU = isset($body['username']) && is_string($body['username']) ? $body['username'] : '';
    $gotP = isset($body['password']) && is_string($body['password']) ? $body['password'] : '';
    $okU = hash_equals((string) $u, (string) $gotU);
    $okP = hash_equals((string) $p, (string) $gotP);
    if (!$okU || !$okP) {
        adm_out(401, ['error' => 'Invalid credentials']);
    }
    adm_out(200, ['token' => $expected]);
}

adm_require_auth();

// ---------- helpers ----------
function dscc_ymd_in_tz($ts, $tz) {
    try {
        $d = new DateTime('@' . $ts);
        $d->setTimezone(new DateTimeZone($tz));
        return $d->format('Y-m-d');
    } catch (Throwable $e) {
        return gmdate('Y-m-d', $ts);
    }
}

function dscc_find_index(&$leads, $id) {
    foreach ($leads as $i => $l) {
        if (($l['id'] ?? null) === $id) return $i;
    }
    return -1;
}

// ---------- AUTH CHECK ----------
if ($sub === '/auth/check' && $method === 'POST') {
    adm_out(200, ['ok' => true]);
}

// ---------- OPERATORS ----------
if ($sub === '/operators' && $method === 'GET') {
    $raw = getenv('OPERATORS') ?: (defined('DSCC_OPERATORS') ? DSCC_OPERATORS : '');
    $ops = array_values(array_filter(array_map('trim', explode(',', (string) $raw))));
    adm_out(200, ['operators' => $ops]);
}

// ---------- CSV EXPORT ----------
if ($sub === '/leads.csv' && $method === 'GET') {
    $leads = dscc_read_json(dscc_leads_file(), []);
    $cols = ['id','ref','createdAt','source','status','priority','fullName','company','email','phone','city','projectType','services','budget','timeline','sourcePage','message'];
    $esc = function ($v) {
        if ($v === null) return '';
        $s = is_array($v) ? implode('; ', $v) : (string) $v;
        if (preg_match('/^[=+\-@\t\r]/', $s)) $s = "'" . $s;
        if (preg_match('/[",\n]/', $s)) return '"' . str_replace('"', '""', $s) . '"';
        return $s;
    };
    $out = [implode(',', $cols)];
    foreach ($leads as $l) {
        $row = [];
        foreach ($cols as $c) $row[] = $esc($l[$c] ?? null);
        $out[] = implode(',', $row);
    }
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="dscc-leads-' . time() . '.csv"');
    // UTF-8 BOM so Excel renders Arabic correctly; CRLF line endings for Excel.
    echo "\xEF\xBB\xBF" . implode("\r\n", $out);
    exit;
}

// ---------- STATS ----------
if ($sub === '/stats' && $method === 'GET') {
    adm_out(200, dscc_compute_stats());
}

// ---------- VISITS LIVE (real-time snapshot) ----------
if ($sub === '/visits/live' && $method === 'GET') {
    $data = dscc_read_json(dscc_data_dir() . '/visits.json', ['days' => []]);
    $recent = isset($data['recent']) && is_array($data['recent']) ? $data['recent'] : [];
    $nowMs = (int) round(microtime(true) * 1000);
    $activeSids = [];
    $lastHour = 0;
    foreach ($recent as $v) {
        $ts = (int) ($v['ts'] ?? 0);
        if ($nowMs - $ts <= 5 * 60000) $activeSids[(string) ($v['sid'] ?? 'anon')] = true;
        if ($nowMs - $ts <= 60 * 60000) $lastHour++;
    }
    try { $tz = new DateTimeZone(BIZ_TZ); } catch (Throwable $e) { $tz = new DateTimeZone('UTC'); }
    $todayKey = (new DateTime('now', $tz))->format('Y-m-d');
    $day = isset($data['days'][$todayKey]) && is_array($data['days'][$todayKey]) ? $data['days'][$todayKey] : null;
    $hourly = [];
    for ($h = 0; $h < 24; $h++) {
        $key = str_pad((string) $h, 2, '0', STR_PAD_LEFT);
        $hourly[] = ['hour' => $key, 'total' => (int) ($day['h'][$key] ?? 0)];
    }
    $top = function ($m, $n) {
        if (!is_array($m)) return [];
        arsort($m);
        $out = [];
        foreach (array_slice($m, 0, $n, true) as $name => $count) $out[] = ['name' => (string) $name, 'count' => (int) $count];
        return $out;
    };
    adm_out(200, [
        'activeNow' => count($activeSids),
        'lastHour' => $lastHour,
        'today' => (int) ($day['t'] ?? 0),
        'hourly' => $hourly,
        'recent' => array_slice($recent, 0, 50),
        'topSourcesToday' => $top($day['src'] ?? [], 10),
        'topPagesToday' => $top($day['p'] ?? [], 10),
        'devicesToday' => $top($day['dev'] ?? [], 4),
        'topCountriesToday' => $top($day['cn'] ?? [], 10),
        'topCitiesToday' => $top($day['ct'] ?? [], 10),
    ]);
}

// ---------- VISITS ----------
if ($sub === '/visits' && $method === 'GET') {
    $window = isset($_GET['days']) ? min(90, max(1, (int) $_GET['days'])) : 30;
    $data = dscc_read_json(dscc_data_dir() . '/visits.json', ['days' => []]);
    $daysMap = isset($data['days']) && is_array($data['days']) ? $data['days'] : [];
    try { $tz = new DateTimeZone(BIZ_TZ); } catch (Throwable $e) { $tz = new DateTimeZone('UTC'); }
    $today = new DateTime('now', $tz);
    $series = [];
    $srcAgg = []; $pageAgg = []; $cnAgg = []; $ctAgg = [];
    $totToday = 0; $tot7 = 0; $tot30 = 0;
    for ($i = $window - 1; $i >= 0; $i--) {
        $d = (clone $today)->modify("-$i days")->format('Y-m-d');
        $rec = isset($daysMap[$d]) && is_array($daysMap[$d]) ? $daysMap[$d] : null;
        $t = $rec ? (int) ($rec['t'] ?? 0) : 0;
        $series[] = ['date' => $d, 'total' => $t];
        if ($i === 0) $totToday = $t;
        if ($i <= 6) $tot7 += $t;
        if ($i <= 29) $tot30 += $t;
        if ($rec) {
            foreach (($rec['src'] ?? []) as $k => $v) $srcAgg[$k] = ($srcAgg[$k] ?? 0) + (int) $v;
            foreach (($rec['p'] ?? []) as $k => $v) $pageAgg[$k] = ($pageAgg[$k] ?? 0) + (int) $v;
            foreach (($rec['cn'] ?? []) as $k => $v) $cnAgg[$k] = ($cnAgg[$k] ?? 0) + (int) $v;
            foreach (($rec['ct'] ?? []) as $k => $v) $ctAgg[$k] = ($ctAgg[$k] ?? 0) + (int) $v;
        }
    }
    $top = function ($m, $n) {
        arsort($m);
        $out = [];
        foreach (array_slice($m, 0, $n, true) as $name => $count) $out[] = ['name' => (string) $name, 'count' => $count];
        return $out;
    };
    adm_out(200, [
        'days' => $series,
        'today' => $totToday,
        'last7Days' => $tot7,
        'last30Days' => $tot30,
        'topSources' => $top($srcAgg, 10),
        'topPages' => $top($pageAgg, 10),
        'topCountries' => $top($cnAgg, 10),
        'topCities' => $top($ctAgg, 10),
    ]);
}

// ---------- EVENTS (site actions) ----------
if ($sub === '/events' && $method === 'GET') {
    $window = isset($_GET['days']) ? min(90, max(1, (int) $_GET['days'])) : 30;
    $limit = isset($_GET['limit']) ? min(500, max(1, (int) $_GET['limit'])) : 100;
    $data = dscc_read_json(dscc_data_dir() . '/events.json', ['recent' => [], 'days' => []]);
    $recent = isset($data['recent']) && is_array($data['recent']) ? array_slice($data['recent'], 0, $limit) : [];
    $daysMap = isset($data['days']) && is_array($data['days']) ? $data['days'] : [];
    try { $tz = new DateTimeZone(BIZ_TZ); } catch (Throwable $e) { $tz = new DateTimeZone('UTC'); }
    $today = new DateTime('now', $tz);
    $typeAgg = [];
    $totToday = 0; $tot7 = 0; $tot30 = 0;
    for ($i = $window - 1; $i >= 0; $i--) {
        $d = (clone $today)->modify("-$i days")->format('Y-m-d');
        $rec = isset($daysMap[$d]) && is_array($daysMap[$d]) ? $daysMap[$d] : null;
        if (!$rec) continue;
        $dayTotal = 0;
        foreach ($rec as $k => $v) { $typeAgg[$k] = ($typeAgg[$k] ?? 0) + (int) $v; $dayTotal += (int) $v; }
        if ($i === 0) $totToday = $dayTotal;
        if ($i <= 6) $tot7 += $dayTotal;
        if ($i <= 29) $tot30 += $dayTotal;
    }
    arsort($typeAgg);
    $byType = [];
    foreach ($typeAgg as $name => $count) $byType[] = ['name' => (string) $name, 'count' => $count];
    adm_out(200, [
        'recent' => $recent,
        'byType' => $byType,
        'today' => $totToday,
        'last7Days' => $tot7,
        'last30Days' => $tot30,
    ]);
}

// ---------- CHAT CONVERSATIONS ----------
if ($sub === '/chats' && $method === 'GET') {
    $limit = isset($_GET['limit']) ? min(300, max(1, (int) $_GET['limit'])) : 100;
    $data = dscc_read_json(dscc_data_dir() . '/chats.json', ['sessions' => []]);
    $sessions = isset($data['sessions']) && is_array($data['sessions']) ? array_values($data['sessions']) : [];
    usort($sessions, function ($a, $b) {
        return strcmp($b['updatedAt'] ?? '', $a['updatedAt'] ?? '');
    });
    $out = [];
    foreach (array_slice($sessions, 0, $limit) as $s) {
        $msgs = isset($s['messages']) && is_array($s['messages']) ? $s['messages'] : [];
        $preview = '';
        foreach ($msgs as $m) {
            if (($m['role'] ?? '') === 'user') { $preview = (string) ($m['content'] ?? ''); break; }
        }
        if ($preview === '' && count($msgs) > 0) $preview = (string) ($msgs[0]['content'] ?? '');
        $out[] = [
            'id' => (string) ($s['id'] ?? ''),
            'startedAt' => (string) ($s['startedAt'] ?? ''),
            'updatedAt' => (string) ($s['updatedAt'] ?? ''),
            'lang' => (string) ($s['lang'] ?? ''),
            'src' => (string) ($s['src'] ?? ''),
            'page' => (string) ($s['page'] ?? ''),
            'messageCount' => count($msgs),
            'preview' => mb_substr($preview, 0, 120),
        ];
    }
    adm_out(200, ['sessions' => $out]);
}
if (preg_match('#^/chats/([^/]+)$#', $sub, $m) && $method === 'GET') {
    $data = dscc_read_json(dscc_data_dir() . '/chats.json', ['sessions' => []]);
    $s = $data['sessions'][$m[1]] ?? null;
    if (!is_array($s)) adm_out(404, ['error' => 'Not found']);
    adm_out(200, $s);
}

// ---------- NOTIFICATIONS ----------
if ($sub === '/notifications' && $method === 'GET') {
    $limit = isset($_GET['limit']) ? min(200, max(1, (int) $_GET['limit'])) : 50;
    $unreadOnly = (($_GET['unread'] ?? '') === '1' || ($_GET['unread'] ?? '') === 'true');
    adm_out(200, dscc_list_notifications($limit, $unreadOnly));
}
if ($sub === '/notifications/read-all' && $method === 'POST') {
    $count = dscc_notif_mark_all_read();
    adm_out(200, ['ok' => true, 'count' => $count]);
}
if (preg_match('#^/notifications/([^/]+)/read$#', $sub, $m) && $method === 'POST') {
    dscc_notif_mark_read($m[1]);
    adm_out(200, ['ok' => true]);
}
if (preg_match('#^/notifications/([^/]+)$#', $sub, $m) && $method === 'DELETE') {
    dscc_notif_delete($m[1]);
    adm_out(200, ['ok' => true]);
}

// ---------- DEMO CLEAR (no-op on prod, kept for contract parity) ----------
if ($sub === '/demo/clear' && $method === 'POST') {
    $removed = dscc_leads_mutate(function (&$leads) {
        $before = count($leads);
        $leads = array_values(array_filter($leads, fn($l) => strpos($l['id'] ?? '', 'L_demo_') !== 0));
        return $before - count($leads);
    });
    adm_out(200, ['ok' => true, 'removed' => $removed]);
}

// ---------- LEADS LIST ----------
if ($sub === '/leads' && $method === 'GET') {
    $all = dscc_read_json(dscc_leads_file(), []);
    $q = adm_query('q'); $q = $q !== null ? mb_strtolower(trim($q)) : null;
    $status = adm_query('status');
    $source = adm_query('source');
    $city = adm_query('city');
    $service = adm_query('service');
    $assigned = adm_query('assigned');
    $priority = adm_query('priority');

    $filtered = array_values(array_filter($all, function ($l) use ($q, $status, $source, $city, $service, $assigned, $priority) {
        if ($status && $status !== 'all' && ($l['status'] ?? null) !== $status) return false;
        if ($source && $source !== 'all' && ($l['source'] ?? null) !== $source) return false;
        if ($city && $city !== 'all' && ($l['city'] ?? null) !== $city) return false;
        if ($service && $service !== 'all' && !in_array($service, $l['services'] ?? [], true)) return false;
        if ($priority && $priority !== 'all' && ($l['priority'] ?? null) !== $priority) return false;
        if ($assigned && $assigned !== 'all') {
            if ($assigned === 'unassigned') {
                if (!empty($l['assignedTo'])) return false;
            } elseif (($l['assignedTo'] ?? '') !== $assigned) {
                return false;
            }
        }
        if ($q) {
            $noteBlob = '';
            foreach ($l['notes'] ?? [] as $n) $noteBlob .= ' ' . ($n['body'] ?? '') . ' ' . ($n['outcome'] ?? '');
            $parts = [
                $l['fullName'] ?? '', $l['company'] ?? '', $l['email'] ?? '', $l['phone'] ?? '',
                $l['city'] ?? '', $l['projectType'] ?? '', $l['message'] ?? '', $l['chatbotSummary'] ?? '',
                $l['ref'] ?? '', $l['assignedTo'] ?? '', $noteBlob,
                implode(' ', $l['services'] ?? []), implode(' ', $l['tags'] ?? []),
            ];
            $blob = mb_strtolower(implode(' ', array_filter($parts)));
            if (strpos($blob, $q) === false) return false;
        }
        return true;
    }));
    adm_out(200, ['leads' => $filtered]);
}

// ---------- LEAD GET ----------
if (preg_match('#^/leads/([^/]+)$#', $sub, $m) && $method === 'GET') {
    $all = dscc_read_json(dscc_leads_file(), []);
    foreach ($all as $l) {
        if (($l['id'] ?? null) === $m[1]) adm_out(200, ['lead' => $l]);
    }
    adm_out(404, ['error' => 'Not found']);
}

// ---------- LEAD UPDATE ----------
if (preg_match('#^/leads/([^/]+)$#', $sub, $m) && $method === 'PATCH') {
    $id = $m[1];
    $body = adm_body();
    $allowed = ['status','priority','assignedTo','tags','fullName','company','email','phone','city','projectType','services','budget','timeline','visitStatus'];
    $patch = [];
    foreach ($allowed as $k) if (array_key_exists($k, $body)) $patch[$k] = $body[$k];

    if (array_key_exists('status', $patch) && !in_array($patch['status'], ['new','contacted','qualified','quotation_sent','negotiation','won','lost','archived'], true)) {
        adm_out(400, ['error' => 'Invalid status']);
    }
    if (array_key_exists('priority', $patch) && !in_array($patch['priority'], ['low','normal','high','urgent'], true)) {
        adm_out(400, ['error' => 'Invalid priority']);
    }
    if (array_key_exists('visitStatus', $patch) && !in_array($patch['visitStatus'], ['pending','confirmed','visited'], true)) {
        adm_out(400, ['error' => 'Invalid visitStatus']);
    }
    if (array_key_exists('assignedTo', $patch)) {
        $v = $patch['assignedTo'];
        if ($v !== '' && (!is_string($v) || strlen($v) > 80)) adm_out(400, ['error' => 'Invalid assignedTo']);
        if ($v === '') unset($patch['assignedTo']);
    }

    $updated = dscc_leads_mutate(function (&$leads) use ($id, $patch) {
        $idx = dscc_find_index($leads, $id);
        if ($idx === -1) return null;
        foreach ($patch as $k => $v) {
            if ($k === 'assignedTo' && $v === '') { unset($leads[$idx]['assignedTo']); continue; }
            $leads[$idx][$k] = $v;
        }
        $leads[$idx]['updatedAt'] = gmdate('c');
        return $leads[$idx];
    });
    if (!$updated) adm_out(404, ['error' => 'Not found']);
    adm_out(200, ['lead' => $updated]);
}

// ---------- LEAD DELETE ----------
if (preg_match('#^/leads/([^/]+)$#', $sub, $m) && $method === 'DELETE') {
    $id = $m[1];
    $ok = dscc_leads_mutate(function (&$leads) use ($id) {
        $before = count($leads);
        $leads = array_values(array_filter($leads, fn($l) => ($l['id'] ?? null) !== $id));
        return count($leads) < $before;
    });
    if (!$ok) adm_out(404, ['error' => 'Not found']);
    adm_out(200, ['ok' => true]);
}

// ---------- ADD NOTE ----------
if (preg_match('#^/leads/([^/]+)/notes$#', $sub, $m) && $method === 'POST') {
    $id = $m[1];
    $body = adm_body();
    $text = $body['body'] ?? null;
    if (!is_string($text) || $text === '' || strlen($text) > 4000) {
        adm_out(400, ['error' => 'Note body required']);
    }
    $normalizedFu = null;
    if (isset($body['followUpAt']) && $body['followUpAt'] !== null && $body['followUpAt'] !== '') {
        if (!is_string($body['followUpAt'])) adm_out(400, ['error' => 'Invalid followUpAt']);
        $t = strtotime($body['followUpAt']);
        if ($t === false) adm_out(400, ['error' => 'Invalid followUpAt']);
        $normalizedFu = gmdate('c', $t);
    }
    $note = [
        'id' => dscc_rid('N_'),
        'body' => $text,
        'createdAt' => gmdate('c'),
    ];
    if (isset($body['author']) && is_string($body['author'])) $note['author'] = $body['author'];
    if (isset($body['outcome']) && is_string($body['outcome'])) $note['outcome'] = $body['outcome'];
    if ($normalizedFu !== null) $note['followUpAt'] = $normalizedFu;

    $updated = dscc_leads_mutate(function (&$leads) use ($id, $note) {
        $idx = dscc_find_index($leads, $id);
        if ($idx === -1) return null;
        $existing = $leads[$idx]['notes'] ?? [];
        array_unshift($existing, $note);
        $leads[$idx]['notes'] = $existing;
        $leads[$idx]['updatedAt'] = gmdate('c');
        return $leads[$idx];
    });
    if (!$updated) adm_out(404, ['error' => 'Not found']);
    adm_out(200, ['lead' => $updated]);
}

// ---------- SUPPLIERS ----------
// Never return supplier credentials (password hash / session tokens) to the dashboard.
function adm_strip_supplier_auth($s) {
    unset($s['auth']);
    return $s;
}

if ($sub === '/suppliers.csv' && $method === 'GET') {
    $all = dscc_read_json(dscc_suppliers_file(), []);
    $cols = ['id','ref','createdAt','status','rating','companyName','contactName','email','phone','country','city','categories','yearsExperience','website','catalogUrl','about'];
    $esc = function ($v) {
        if ($v === null) return '';
        $s = is_array($v) ? implode('; ', $v) : (string) $v;
        if (preg_match('/^[=+\-@\t\r]/', $s)) $s = "'" . $s;
        if (preg_match('/[",\n]/', $s)) return '"' . str_replace('"', '""', $s) . '"';
        return $s;
    };
    $out = [implode(',', $cols)];
    foreach ($all as $l) {
        $row = [];
        foreach ($cols as $c) $row[] = $esc($l[$c] ?? null);
        $out[] = implode(',', $row);
    }
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="dscc-suppliers-' . time() . '.csv"');
    echo "\xEF\xBB\xBF" . implode("\r\n", $out);
    exit;
}

if ($sub === '/suppliers' && $method === 'GET') {
    $all = dscc_read_json(dscc_suppliers_file(), []);
    $q = adm_query('q'); $q = $q !== null ? mb_strtolower(trim($q)) : null;
    $status = adm_query('status');
    $category = adm_query('category');
    $country = adm_query('country');
    $filtered = array_values(array_filter($all, function ($s) use ($q, $status, $category, $country) {
        if ($status && $status !== 'all' && ($s['status'] ?? null) !== $status) return false;
        if ($category && $category !== 'all' && !in_array($category, $s['categories'] ?? [], true)) return false;
        if ($country && $country !== 'all' && ($s['country'] ?? '') !== $country) return false;
        if ($q) {
            $noteBlob = '';
            foreach ($s['notes'] ?? [] as $n) $noteBlob .= ' ' . ($n['body'] ?? '');
            $parts = [
                $s['companyName'] ?? '', $s['contactName'] ?? '', $s['email'] ?? '', $s['phone'] ?? '',
                $s['country'] ?? '', $s['city'] ?? '', $s['ref'] ?? '', $s['about'] ?? '', $noteBlob,
                implode(' ', $s['categories'] ?? []),
            ];
            $blob = mb_strtolower(implode(' ', array_filter($parts)));
            if (strpos($blob, $q) === false) return false;
        }
        return true;
    }));
    adm_out(200, ['suppliers' => array_map('adm_strip_supplier_auth', $filtered)]);
}

if (preg_match('#^/suppliers/([^/]+)$#', $sub, $m) && $method === 'GET') {
    $all = dscc_read_json(dscc_suppliers_file(), []);
    foreach ($all as $s) {
        if (($s['id'] ?? null) === $m[1]) adm_out(200, ['supplier' => adm_strip_supplier_auth($s)]);
    }
    adm_out(404, ['error' => 'Not found']);
}

if (preg_match('#^/suppliers/([^/]+)/docs/([^/]+)$#', $sub, $m) && $method === 'GET') {
    $all = dscc_read_json(dscc_suppliers_file(), []);
    foreach ($all as $s) {
        if (($s['id'] ?? null) !== $m[1]) continue;
        $doc = $s['docs'][$m[2]] ?? null;
        if (!is_array($doc) || !is_string($doc['file'] ?? null)) adm_out(404, ['error' => 'Not found']);
        $safe = basename($doc['file']);
        $abs = dscc_data_dir() . '/uploads/' . $safe;
        if (!is_file($abs)) adm_out(404, ['error' => 'File missing']);
        header('Content-Type: ' . (is_string($doc['type'] ?? null) && $doc['type'] !== '' ? $doc['type'] : 'application/octet-stream'));
        header('Content-Length: ' . filesize($abs));
        header('Content-Disposition: attachment; filename="' . rawurlencode($doc['name'] ?? $safe) . '"');
        header('X-Content-Type-Options: nosniff');
        readfile($abs);
        exit;
    }
    adm_out(404, ['error' => 'Not found']);
}

if (preg_match('#^/suppliers/([^/]+)$#', $sub, $m) && $method === 'PATCH') {
    $id = $m[1];
    $body = adm_body();
    $allowed = ['status','rating','tags','companyName','contactName','email','phone','country','city','categories','yearsExperience','website','catalogUrl','about'];
    $patch = [];
    foreach ($allowed as $k) if (array_key_exists($k, $body)) $patch[$k] = $body[$k];
    if (array_key_exists('status', $patch) && !in_array($patch['status'], ['new','reviewing','approved','rejected','archived'], true)) {
        adm_out(400, ['error' => 'Invalid status']);
    }
    if (array_key_exists('rating', $patch)) {
        $r = $patch['rating'];
        if ($r !== null && (!is_numeric($r) || $r < 0 || $r > 5)) adm_out(400, ['error' => 'Invalid rating']);
    }
    $updated = dscc_suppliers_mutate(function (&$suppliers) use ($id, $patch) {
        $idx = dscc_find_index($suppliers, $id);
        if ($idx === -1) return null;
        foreach ($patch as $k => $v) {
            if ($v === null) { unset($suppliers[$idx][$k]); continue; }
            $suppliers[$idx][$k] = $v;
        }
        $suppliers[$idx]['updatedAt'] = gmdate('c');
        return $suppliers[$idx];
    });
    if (!$updated) adm_out(404, ['error' => 'Not found']);
    adm_out(200, ['supplier' => adm_strip_supplier_auth($updated)]);
}

if (preg_match('#^/suppliers/([^/]+)$#', $sub, $m) && $method === 'DELETE') {
    $id = $m[1];
    $ok = dscc_suppliers_mutate(function (&$suppliers) use ($id) {
        $before = count($suppliers);
        $removedDocs = [];
        foreach ($suppliers as $s) {
            if (($s['id'] ?? null) === $id && is_array($s['docs'] ?? null)) $removedDocs = $s['docs'];
        }
        $suppliers = array_values(array_filter($suppliers, fn($s) => ($s['id'] ?? null) !== $id));
        foreach ($removedDocs as $d) {
            if (is_array($d) && is_string($d['file'] ?? null)) {
                @unlink(dscc_data_dir() . '/uploads/' . basename($d['file']));
            }
        }
        return count($suppliers) < $before;
    });
    if (!$ok) adm_out(404, ['error' => 'Not found']);
    adm_out(200, ['ok' => true]);
}

if (preg_match('#^/suppliers/([^/]+)/notes$#', $sub, $m) && $method === 'POST') {
    $id = $m[1];
    $body = adm_body();
    $text = $body['body'] ?? null;
    if (!is_string($text) || $text === '' || strlen($text) > 4000) {
        adm_out(400, ['error' => 'Note body required']);
    }
    $note = [
        'id' => dscc_rid('N_'),
        'body' => $text,
        'createdAt' => gmdate('c'),
    ];
    if (isset($body['author']) && is_string($body['author'])) $note['author'] = $body['author'];
    $updated = dscc_suppliers_mutate(function (&$suppliers) use ($id, $note) {
        $idx = dscc_find_index($suppliers, $id);
        if ($idx === -1) return null;
        $existing = $suppliers[$idx]['notes'] ?? [];
        array_unshift($existing, $note);
        $suppliers[$idx]['notes'] = $existing;
        $suppliers[$idx]['updatedAt'] = gmdate('c');
        return $suppliers[$idx];
    });
    if (!$updated) adm_out(404, ['error' => 'Not found']);
    adm_out(200, ['supplier' => adm_strip_supplier_auth($updated)]);
}

// ============================================================
// RFQs (requests for quotation) + supplier offers
// ============================================================

if ($sub === '/rfqs' && $method === 'GET') {
    adm_out(200, ['rfqs' => dscc_read_json(dscc_rfqs_file(), [])]);
}

if ($sub === '/rfqs' && $method === 'POST') {
    $body = adm_body();
    $title = is_string($body['title'] ?? null) ? mb_substr(trim($body['title']), 0, 300) : '';
    if ($title === '') adm_out(400, ['error' => 'title is required']);
    $now = gmdate('c');
    $rfq = [
        'id' => dscc_rid('R_'),
        'ref' => strtoupper(dscc_rid('RFQ-')),
        'status' => 'open',
        'title' => $title,
        'createdAt' => $now,
        'updatedAt' => $now,
        'offers' => [],
    ];
    if (is_string($body['description'] ?? null) && trim($body['description']) !== '') $rfq['description'] = mb_substr(trim($body['description']), 0, 8000);
    if (is_string($body['deadline'] ?? null) && trim($body['deadline']) !== '') $rfq['deadline'] = mb_substr(trim($body['deadline']), 0, 30);
    if (is_array($body['categories'] ?? null)) {
        $cats = [];
        foreach ($body['categories'] as $c) {
            if (is_string($c) && trim($c) !== '') $cats[] = mb_substr(trim($c), 0, 60);
            if (count($cats) >= 20) break;
        }
        if ($cats) $rfq['categories'] = $cats;
    }
    dscc_rfqs_mutate(function (&$rfqs) use ($rfq) { array_unshift($rfqs, $rfq); return true; });
    adm_out(200, ['rfq' => $rfq]);
}

if (preg_match('#^/rfqs/([^/]+)$#', $sub, $m) && $method === 'GET') {
    foreach (dscc_read_json(dscc_rfqs_file(), []) as $r) {
        if (($r['id'] ?? null) === $m[1]) adm_out(200, ['rfq' => $r]);
    }
    adm_out(404, ['error' => 'Not found']);
}

if (preg_match('#^/rfqs/([^/]+)$#', $sub, $m) && $method === 'PATCH') {
    $body = adm_body();
    $updated = null;
    dscc_rfqs_mutate(function (&$rfqs) use ($m, $body, &$updated) {
        foreach ($rfqs as &$r) {
            if (($r['id'] ?? null) !== $m[1]) continue;
            if (is_string($body['title'] ?? null) && trim($body['title']) !== '') $r['title'] = mb_substr(trim($body['title']), 0, 300);
            if (is_string($body['description'] ?? null)) $r['description'] = mb_substr(trim($body['description']), 0, 8000);
            if (is_string($body['deadline'] ?? null)) $r['deadline'] = mb_substr(trim($body['deadline']), 0, 30);
            if (is_string($body['status'] ?? null) && in_array($body['status'], ['open', 'closed'], true)) $r['status'] = $body['status'];
            if (is_array($body['categories'] ?? null)) {
                $cats = [];
                foreach ($body['categories'] as $c) {
                    if (is_string($c) && trim($c) !== '') $cats[] = mb_substr(trim($c), 0, 60);
                    if (count($cats) >= 20) break;
                }
                $r['categories'] = $cats;
            }
            $r['updatedAt'] = gmdate('c');
            $updated = $r;
        }
        return true;
    });
    if (!$updated) adm_out(404, ['error' => 'Not found']);
    adm_out(200, ['rfq' => $updated]);
}

if (preg_match('#^/rfqs/([^/]+)$#', $sub, $m) && $method === 'DELETE') {
    $removedOffers = [];
    $found = false;
    dscc_rfqs_mutate(function (&$rfqs) use ($m, &$removedOffers, &$found) {
        foreach ($rfqs as $r) {
            if (($r['id'] ?? null) === $m[1]) {
                $found = true;
                $removedOffers = (array) ($r['offers'] ?? []);
            }
        }
        $rfqs = array_values(array_filter($rfqs, fn($r) => ($r['id'] ?? null) !== $m[1]));
        return true;
    });
    if (!$found) adm_out(404, ['error' => 'Not found']);
    foreach ($removedOffers as $o) {
        $f = is_array($o) ? ($o['file'] ?? null) : null;
        if (is_array($f) && is_string($f['file'] ?? null)) {
            @unlink(dscc_data_dir() . '/uploads/' . basename($f['file']));
        }
    }
    adm_out(200, ['ok' => true]);
}

if (preg_match('#^/rfqs/([^/]+)/offers/([^/]+)/file$#', $sub, $m) && $method === 'GET') {
    foreach (dscc_read_json(dscc_rfqs_file(), []) as $r) {
        if (($r['id'] ?? null) !== $m[1]) continue;
        foreach ((array) ($r['offers'] ?? []) as $o) {
            if (($o['id'] ?? null) !== $m[2]) continue;
            $f = $o['file'] ?? null;
            if (!is_array($f) || !is_string($f['file'] ?? null)) adm_out(404, ['error' => 'Not found']);
            $safe = basename($f['file']);
            $abs = dscc_data_dir() . '/uploads/' . $safe;
            if (!is_file($abs)) adm_out(404, ['error' => 'File missing']);
            header('Content-Type: ' . (is_string($f['type'] ?? null) && $f['type'] !== '' ? $f['type'] : 'application/octet-stream'));
            header('Content-Length: ' . filesize($abs));
            header('Content-Disposition: attachment; filename="' . rawurlencode($f['name'] ?? $safe) . '"');
            header('X-Content-Type-Options: nosniff');
            readfile($abs);
            exit;
        }
    }
    adm_out(404, ['error' => 'Not found']);
}

adm_out(404, ['error' => 'Unknown admin route: ' . $method . ' ' . $sub]);

// ============================================================
// Stats
// ============================================================
function dscc_compute_stats() {
    $all = dscc_read_json(dscc_leads_file(), []);
    $byStatus = []; $bySource = []; $byPriority = []; $svc = []; $cities = []; $assignees = [];
    $now = time();
    $todayYmd = dscc_ymd_in_tz($now, BIZ_TZ);
    $in7days = $now + 7 * 86400;
    $last7 = 0; $last30 = 0; $assignedCount = 0; $unassignedCount = 0;
    $frTotal = 0; $frSamples = 0;
    $overdue = []; $todayItems = []; $upcoming = [];

    foreach ($all as $l) {
        $st = $l['status'] ?? 'new'; $byStatus[$st] = ($byStatus[$st] ?? 0) + 1;
        $sr = $l['source'] ?? 'other'; $bySource[$sr] = ($bySource[$sr] ?? 0) + 1;
        $pr = $l['priority'] ?? 'normal'; $byPriority[$pr] = ($byPriority[$pr] ?? 0) + 1;
        foreach ($l['services'] ?? [] as $s) $svc[$s] = ($svc[$s] ?? 0) + 1;
        if (!empty($l['city'])) $cities[$l['city']] = ($cities[$l['city']] ?? 0) + 1;
        if (!empty($l['assignedTo'])) { $assignedCount++; $assignees[$l['assignedTo']] = ($assignees[$l['assignedTo']] ?? 0) + 1; }
        else { $unassignedCount++; }

        $t = isset($l['createdAt']) ? strtotime($l['createdAt']) : false;
        if ($t !== false) {
            $days = ($now - $t) / 86400;
            if ($days <= 7) $last7++;
            if ($days <= 30) $last30++;
        }
        $notes = $l['notes'] ?? [];
        if (count($notes) > 0 && $t !== false) {
            $oldest = 0;
            foreach ($notes as $n) {
                $tn = isset($n['createdAt']) ? strtotime($n['createdAt']) : false;
                if ($tn !== false && ($oldest === 0 || $tn < $oldest)) $oldest = $tn;
            }
            if ($oldest > 0) {
                $delta = $oldest - $t;
                if ($delta > 0) { $frTotal += $delta; $frSamples++; }
            }
        }
        foreach ($notes as $n) {
            if (empty($n['followUpAt'])) continue;
            $fu = strtotime($n['followUpAt']);
            if ($fu === false) continue;
            $item = [
                'leadId' => $l['id'] ?? '',
                'leadRef' => $l['ref'] ?? '',
                'leadName' => $l['fullName'] ?? ($l['company'] ?? ($l['email'] ?? ($l['phone'] ?? ($l['ref'] ?? '')))),
                'noteId' => $n['id'] ?? '',
                'body' => $n['body'] ?? '',
                'followUpAt' => $n['followUpAt'],
            ];
            if (!empty($l['assignedTo'])) $item['assignedTo'] = $l['assignedTo'];
            $fuYmd = dscc_ymd_in_tz($fu, BIZ_TZ);
            if ($fuYmd === $todayYmd) {
                $todayItems[] = $item;
            } elseif ($fu < $now) {
                if (!in_array($st, ['won','lost','archived'], true)) $overdue[] = $item;
            } elseif ($fu <= $in7days) {
                $upcoming[] = $item;
            }
        }
    }

    $top = function ($m) {
        arsort($m);
        $out = [];
        foreach (array_slice($m, 0, 10, true) as $name => $count) $out[] = ['name' => (string) $name, 'count' => $count];
        return $out;
    };

    $wonCount = $byStatus['won'] ?? 0;
    $lostCount = $byStatus['lost'] ?? 0;
    $denom = $wonCount + $lostCount;
    $conversionRate = $denom > 0 ? round(($wonCount / $denom) * 1000) / 10 : 0;
    $avgFr = $frSamples > 0 ? round(($frTotal / $frSamples / 3600) * 10) / 10 : null;

    $stages = ['new','contacted','qualified','quotation_sent','negotiation','won'];
    $pipelineTotal = 0;
    foreach ($stages as $s) $pipelineTotal += ($byStatus[$s] ?? 0);
    $pipeline = [];
    foreach ($stages as $stage) {
        $count = $byStatus[$stage] ?? 0;
        $pct = $pipelineTotal > 0 ? round(($count / $pipelineTotal) * 1000) / 10 : 0;
        $pipeline[] = ['stage' => $stage, 'count' => $count, 'pct' => $pct];
    }

    $sortFu = function (&$arr) { usort($arr, fn($a, $b) => strtotime($a['followUpAt']) - strtotime($b['followUpAt'])); };
    $sortFu($overdue); $sortFu($todayItems); $sortFu($upcoming);

    return [
        'total' => count($all),
        'byStatus' => (object) $byStatus,
        'bySource' => (object) $bySource,
        'byPriority' => (object) $byPriority,
        'topServices' => $top($svc),
        'topCities' => $top($cities),
        'newLast7Days' => $last7,
        'newLast30Days' => $last30,
        'recent' => array_slice($all, 0, 8),
        'conversionRate' => $conversionRate,
        'wonCount' => $wonCount,
        'lostCount' => $lostCount,
        'avgFirstResponseHours' => $avgFr,
        'firstResponseSampleSize' => $frSamples,
        'pipelineValueByStage' => $pipeline,
        'assignedCount' => $assignedCount,
        'unassignedCount' => $unassignedCount,
        'byAssignee' => $top($assignees),
        'overdueFollowUps' => array_slice($overdue, 0, 50),
        'todayFollowUps' => array_slice($todayItems, 0, 50),
        'upcomingFollowUps' => array_slice($upcoming, 0, 50),
    ];
}

// ============================================================
// Notifications — derived from leads + a read/deleted state file
// ============================================================
function dscc_notif_state() {
    $s = dscc_read_json(dscc_notif_read_file(), []);
    return [
        'ids' => isset($s['ids']) && is_array($s['ids']) ? $s['ids'] : [],
        'deleted' => isset($s['deleted']) && is_array($s['deleted']) ? $s['deleted'] : [],
        'allAt' => isset($s['allAt']) && is_string($s['allAt']) ? $s['allAt'] : null,
    ];
}
function dscc_notif_id_for_lead($lead) {
    return 'n_' . ($lead['id'] ?? '');
}
function dscc_build_notifications() {
    $all = dscc_read_json(dscc_leads_file(), []);
    $state = dscc_notif_state();
    $allAt = $state['allAt'] ? strtotime($state['allAt']) : 0;
    $sourceAr = ['quote'=>'طلب عرض سعر','contact'=>'نموذج تواصل','chatbot'=>'محادثة الروبوت','newsletter'=>'نشرة بريدية','showroom'=>'حجز زيارة معرض','other'=>'طلب عام'];
    $sourceEn = ['quote'=>'Quote request','contact'=>'Contact message','chatbot'=>'Chatbot lead','newsletter'=>'Newsletter signup','showroom'=>'Showroom visit booking','other'=>'Inquiry'];
    $items = [];
    foreach ($all as $l) {
        $nid = dscc_notif_id_for_lead($l);
        if (in_array($nid, $state['deleted'], true)) continue;
        $who = $l['fullName'] ?? ($l['company'] ?? ($l['email'] ?? ($l['phone'] ?? 'بدون اسم')));
        $src = $l['source'] ?? 'other';
        $created = $l['createdAt'] ?? gmdate('c');
        $createdTs = strtotime($created);
        $read = in_array($nid, $state['ids'], true) || ($allAt > 0 && $createdTs !== false && $createdTs <= $allAt);
        $items[] = [
            'id' => $nid,
            'type' => 'lead_new',
            'titleAr' => ($sourceAr[$src] ?? 'طلب جديد') . ' · ' . $who,
            'titleEn' => ($sourceEn[$src] ?? 'New lead') . ' · ' . $who,
            'bodyAr' => $l['message'] ?? ($l['chatbotSummary'] ?? ('مرجع: ' . ($l['ref'] ?? ''))),
            'bodyEn' => $l['message'] ?? ($l['chatbotSummary'] ?? ('Ref: ' . ($l['ref'] ?? ''))),
            'leadId' => $l['id'] ?? '',
            'leadRef' => $l['ref'] ?? '',
            'read' => $read,
            'createdAt' => $created,
            '_ts' => $createdTs === false ? 0 : $createdTs,
        ];
    }
    usort($items, fn($a, $b) => $b['_ts'] - $a['_ts']);
    return $items;
}
function dscc_list_notifications($limit, $unreadOnly) {
    $items = dscc_build_notifications();
    $total = count($items);
    $unread = 0;
    foreach ($items as $it) if (!$it['read']) $unread++;
    if ($unreadOnly) $items = array_values(array_filter($items, fn($i) => !$i['read']));
    $items = array_slice($items, 0, $limit);
    foreach ($items as &$it) unset($it['_ts']);
    return ['items' => $items, 'unread' => $unread, 'total' => $total];
}
function dscc_notif_mark_read($id) {
    dscc_file_mutate(dscc_notif_read_file(), [], function (&$s) use ($id) {
        if (!isset($s['ids']) || !is_array($s['ids'])) $s['ids'] = [];
        if (!in_array($id, $s['ids'], true)) $s['ids'][] = $id;
    });
    return true;
}
function dscc_notif_mark_all_read() {
    $items = dscc_build_notifications();
    $count = 0;
    foreach ($items as $it) if (!$it['read']) $count++;
    dscc_file_mutate(dscc_notif_read_file(), [], function (&$s) {
        $s['allAt'] = gmdate('c');
    });
    return $count;
}
function dscc_notif_delete($id) {
    dscc_file_mutate(dscc_notif_read_file(), [], function (&$s) use ($id) {
        if (!isset($s['deleted']) || !is_array($s['deleted'])) $s['deleted'] = [];
        if (!in_array($id, $s['deleted'], true)) $s['deleted'][] = $id;
    });
    return true;
}
