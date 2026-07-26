<?php
// DSCC supplier portal API (phase 2): email+password accounts, profile
// completion with document upload, and RFQ browsing / offer submission for
// activated (status === "approved") suppliers.
// Routed via .htaccess: ^api/portal(/.*)?$ -> /api/portal.php

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function pout($code, $payload) {
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/_store.php';

// ---- routing ----
$uri = (string) parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
$pos = strpos($uri, '/api/portal');
$sub = $pos === false ? '' : substr($uri, $pos + strlen('/api/portal'));
$sub = '/' . ltrim((string) $sub, '/');
$sub = rtrim($sub, '/');
if ($sub === '') $sub = '/';
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// Origin guard (same policy as suppliers.php)
$reqHost = strtolower($_SERVER['HTTP_HOST'] ?? '');
foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $h) {
    if (!empty($_SERVER[$h])) {
        $host = strtolower((string) parse_url($_SERVER[$h], PHP_URL_HOST));
        if ($host !== '' && $reqHost !== '' && $host !== $reqHost && $host !== 'www.' . $reqHost && 'www.' . $host !== $reqHost) {
            pout(403, ['ok' => false, 'error' => 'Forbidden.']);
        }
        break;
    }
}

// ---- helpers ----
function portal_body() {
    $raw = file_get_contents('php://input');
    if (strlen((string) $raw) > 65536) pout(413, ['ok' => false, 'error' => 'Payload too large.']);
    $b = json_decode($raw, true);
    return is_array($b) ? $b : [];
}

function portal_rate($key, $limitMin = 10, $limitHour = 40) {
    try {
        $res = dscc_file_mutate(dscc_data_dir() . '/portal_rl.json', [], function (&$s) use ($key) {
            $now = time();
            foreach ($s as $k => $v) { if (!is_array($v) || ($v['h'] ?? 0) < $now - 3600) unset($s[$k]); }
            $e = (isset($s[$key]) && is_array($s[$key])) ? $s[$key] : ['m' => $now, 'mn' => 0, 'h' => $now, 'hn' => 0];
            if ($now - ($e['m'] ?? 0) > 60) { $e['m'] = $now; $e['mn'] = 0; }
            if ($now - ($e['h'] ?? 0) > 3600) { $e['h'] = $now; $e['hn'] = 0; }
            $e['mn'] = ($e['mn'] ?? 0) + 1;
            $e['hn'] = ($e['hn'] ?? 0) + 1;
            $s[$key] = $e;
            return [$e['mn'], $e['hn']];
        });
        if ($res[0] > $limitMin || $res[1] > $limitHour) {
            pout(429, ['ok' => false, 'error' => 'Too many requests.']);
        }
    } catch (Throwable $e) {
        // rate limiter must never take the endpoint down
    }
}

function portal_ip() {
    return trim((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown')) ?: 'unknown';
}

function portal_account_view($s) {
    return [
        'id' => $s['id'] ?? '',
        'ref' => $s['ref'] ?? '',
        'email' => $s['email'] ?? '',
        'companyName' => $s['companyName'] ?? null,
        'phone' => $s['phone'] ?? null,
        'status' => $s['status'] ?? 'new',
        'profileComplete' => !empty($s['profileComplete']),
        'docs' => array_keys(is_array($s['docs'] ?? null) ? $s['docs'] : []),
    ];
}

function portal_supplier_index(&$suppliers, $id) {
    foreach ($suppliers as $i => $s) {
        if (($s['id'] ?? null) === $id) return $i;
    }
    return -1;
}

function portal_find_by_email($suppliers, $email) {
    $norm = strtolower(trim($email));
    foreach ($suppliers as $i => $s) {
        if (isset($s['auth']) && strtolower((string) ($s['email'] ?? '')) === $norm) return $i;
    }
    return -1;
}

function portal_auth_supplier() {
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    if (stripos($hdr, 'Bearer ') !== 0) pout(401, ['ok' => false, 'error' => 'Unauthorized']);
    $token = trim(substr($hdr, 7));
    if ($token === '') pout(401, ['ok' => false, 'error' => 'Unauthorized']);
    $all = dscc_read_json(dscc_suppliers_file(), []);
    $now = round(microtime(true) * 1000);
    foreach ($all as $s) {
        foreach ((array) ($s['auth']['tokens'] ?? []) as $t) {
            if (is_array($t) && hash_equals((string) ($t['t'] ?? ''), $token) && ($t['exp'] ?? 0) > $now) {
                return [$s, $token];
            }
        }
    }
    pout(401, ['ok' => false, 'error' => 'Unauthorized']);
}

function portal_issue_token($supplierId) {
    $token = 'T_' . bin2hex(random_bytes(24));
    $exp = round(microtime(true) * 1000) + 30 * 24 * 3600 * 1000;
    dscc_suppliers_mutate(function (&$suppliers) use ($supplierId, $token, $exp) {
        foreach ($suppliers as &$s) {
            if (($s['id'] ?? null) !== $supplierId) continue;
            $now = round(microtime(true) * 1000);
            $tokens = array_values(array_filter((array) ($s['auth']['tokens'] ?? []), fn($t) => is_array($t) && ($t['exp'] ?? 0) > $now));
            $tokens = array_slice($tokens, -4);
            $tokens[] = ['t' => $token, 'exp' => $exp];
            $s['auth']['tokens'] = $tokens;
            $s['updatedAt'] = gmdate('c');
        }
        return true;
    });
    return $token;
}

$UPLOAD_ALLOWED = ['application/pdf' => '.pdf', 'image/jpeg' => '.jpg'];

function portal_save_upload($f, $prefix, $ALLOWED) {
    if (($f['size'] ?? 0) > 5 * 1024 * 1024) pout(413, ['ok' => false, 'error' => 'File too large (max 5MB).']);
    if (($f['size'] ?? 0) < 1024) pout(400, ['ok' => false, 'error' => 'File too small or empty.']);
    $mime = '';
    if (function_exists('finfo_open')) {
        $fi = finfo_open(FILEINFO_MIME_TYPE);
        if ($fi) { $mime = (string) finfo_file($fi, $f['tmp_name']); finfo_close($fi); }
    }
    if ($mime === '') $mime = (string) ($f['type'] ?? '');
    if (!isset($ALLOWED[$mime])) pout(400, ['ok' => false, 'error' => 'Invalid file type (PDF/JPG only).']);
    $dir = dscc_data_dir() . '/uploads';
    if (!is_dir($dir)) @mkdir($dir, 0775, true);
    $stored = $prefix . '-' . dscc_rid() . $ALLOWED[$mime];
    if (!@move_uploaded_file($f['tmp_name'], $dir . '/' . $stored)) {
        pout(500, ['ok' => false, 'error' => 'Failed to store file.']);
    }
    return [
        'name' => mb_substr((string) ($f['name'] ?? $stored), 0, 200),
        'file' => $stored,
        'size' => (int) ($f['size'] ?? 0),
        'type' => $mime,
    ];
}

// =====================================================================
// POST /register
if ($sub === '/register' && $method === 'POST') {
    portal_rate('reg:' . portal_ip());
    $b = portal_body();
    $email = strtolower(trim((string) ($b['email'] ?? '')));
    $password = (string) ($b['password'] ?? '');
    $companyName = mb_substr(trim((string) ($b['companyName'] ?? '')), 0, 200);
    $phone = mb_substr(trim((string) ($b['phone'] ?? '')), 0, 40);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 200) pout(400, ['ok' => false, 'error' => 'invalid_email']);
    if (strlen($password) < 8 || strlen($password) > 200) pout(400, ['ok' => false, 'error' => 'weak_password']);
    if ($companyName === '') pout(400, ['ok' => false, 'error' => 'company_required']);

    $new = null;
    $exists = false;
    dscc_suppliers_mutate(function (&$suppliers) use ($email, $password, $companyName, $phone, &$new, &$exists) {
        if (portal_find_by_email($suppliers, $email) !== -1) { $exists = true; return false; }
        $now = gmdate('c');
        $new = [
            'id' => dscc_rid('S_'),
            'ref' => strtoupper(dscc_rid('SUP-')),
            'status' => 'new',
            'createdAt' => $now,
            'updatedAt' => $now,
            'email' => $email,
            'companyName' => $companyName,
            'phone' => $phone !== '' ? $phone : null,
            'notes' => [],
            'auth' => ['passHash' => password_hash($password, PASSWORD_DEFAULT), 'tokens' => []],
            'profileComplete' => false,
        ];
        array_unshift($suppliers, $new);
        return true;
    });
    if ($exists) pout(409, ['ok' => false, 'error' => 'email_exists']);
    $token = portal_issue_token($new['id']);
    pout(200, ['ok' => true, 'token' => $token, 'account' => portal_account_view($new)]);
}

// POST /login
if ($sub === '/login' && $method === 'POST') {
    portal_rate('login:' . portal_ip());
    $b = portal_body();
    $email = strtolower(trim((string) ($b['email'] ?? '')));
    $password = (string) ($b['password'] ?? '');
    $all = dscc_read_json(dscc_suppliers_file(), []);
    $idx = $email !== '' ? portal_find_by_email($all, $email) : -1;
    $s = $idx >= 0 ? $all[$idx] : null;
    if (!$s || $password === '' || !password_verify($password, (string) ($s['auth']['passHash'] ?? ''))) {
        pout(401, ['ok' => false, 'error' => 'invalid_credentials']);
    }
    $token = portal_issue_token($s['id']);
    pout(200, ['ok' => true, 'token' => $token, 'account' => portal_account_view($s)]);
}

// POST /logout
if ($sub === '/logout' && $method === 'POST') {
    list($me, $token) = portal_auth_supplier();
    dscc_suppliers_mutate(function (&$suppliers) use ($me, $token) {
        foreach ($suppliers as &$s) {
            if (($s['id'] ?? null) !== $me['id']) continue;
            $s['auth']['tokens'] = array_values(array_filter((array) ($s['auth']['tokens'] ?? []), fn($t) => !is_array($t) || ($t['t'] ?? '') !== $token));
        }
        return true;
    });
    pout(200, ['ok' => true]);
}

// GET /me
if ($sub === '/me' && $method === 'GET') {
    list($me) = portal_auth_supplier();
    pout(200, ['ok' => true, 'account' => portal_account_view($me)]);
}

// POST /profile  (multipart: payload + crFile/addressFile/taxFile)
if ($sub === '/profile' && $method === 'POST') {
    list($me) = portal_auth_supplier();
    $payloadJson = is_string($_POST['payload'] ?? null) ? $_POST['payload'] : '';
    if (strlen($payloadJson) > 65536) pout(413, ['ok' => false, 'error' => 'Payload too large.']);
    $data = json_decode($payloadJson, true);
    if (!is_array($data)) $data = [];

    $docKeys = ['crFile', 'addressFile', 'taxFile', 'ibanFile'];
    $docs = is_array($me['docs'] ?? null) ? $me['docs'] : [];
    foreach ($docKeys as $key) {
        $f = $_FILES[$key] ?? null;
        $hasUpload = is_array($f) && ($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK;
        if (!$hasUpload) {
            if (empty($docs[$key])) pout(400, ['ok' => false, 'error' => 'Missing required document: ' . $key]);
            continue;
        }
        $old = $docs[$key] ?? null;
        $docs[$key] = portal_save_upload($f, $key, $UPLOAD_ALLOWED);
        if (is_array($old) && is_string($old['file'] ?? null)) {
            @unlink(dscc_data_dir() . '/uploads/' . basename($old['file']));
        }
    }

    $pickStr = function ($k, $max = 300) use ($data) {
        $v = $data[$k] ?? null;
        if (!is_string($v)) return null;
        $t = mb_substr(trim($v), 0, $max);
        return $t !== '' ? $t : null;
    };
    $wasComplete = !empty($me['profileComplete']);
    $updated = null;
    dscc_suppliers_mutate(function (&$suppliers) use ($me, $docs, $data, $pickStr, &$updated) {
        foreach ($suppliers as &$s) {
            if (($s['id'] ?? null) !== $me['id']) continue;
            $s['docs'] = $docs;
            $s['profileComplete'] = true;
            foreach (['companyName' => 200, 'contactName' => 300, 'phone' => 40, 'country' => 60, 'city' => 100, 'yearsExperience' => 40, 'website' => 300, 'catalogUrl' => 300, 'about' => 4000] as $k => $max) {
                $v = $pickStr($k, $max);
                if ($v !== null) $s[$k] = $v;
            }
            if (is_array($data['categories'] ?? null)) {
                $cats = [];
                foreach ($data['categories'] as $c) {
                    if (is_string($c) && trim($c) !== '') $cats[] = mb_substr(trim($c), 0, 60);
                    if (count($cats) >= 20) break;
                }
                $s['categories'] = $cats;
            }
            $s['updatedAt'] = gmdate('c');
            $updated = $s;
        }
        return true;
    });
    if (!$updated) pout(404, ['ok' => false, 'error' => 'Not found']);

    if (!$wasComplete) {
        // Notify DSCC (best-effort)
        $to = 'contact@dsccsaudia.com';
        $subject = 'Supplier profile completed - ' . preg_replace('/[\r\n]+/', ' ', (string) ($updated['companyName'] ?? $updated['email']));
        $msg = "Company: " . ($updated['companyName'] ?? '-') . "\nEmail: " . ($updated['email'] ?? '-') . "\nRef: " . ($updated['ref'] ?? '-') . "\nStatus: awaiting activation";
        @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $msg, "From: website@dsccsaudia.com\r\nContent-Type: text/plain; charset=UTF-8");
    }
    pout(200, ['ok' => true, 'account' => portal_account_view($updated)]);
}

// GET /rfqs  (activated suppliers only)
if ($sub === '/rfqs' && $method === 'GET') {
    list($me) = portal_auth_supplier();
    if (($me['status'] ?? '') !== 'approved') pout(403, ['ok' => false, 'error' => 'not_activated']);
    $all = dscc_read_json(dscc_rfqs_file(), []);
    $out = [];
    foreach ($all as $r) {
        if (($r['status'] ?? '') !== 'open') continue;
        $mine = null;
        foreach ((array) ($r['offers'] ?? []) as $o) {
            if (($o['supplierId'] ?? null) === $me['id']) {
                $mine = [
                    'id' => $o['id'] ?? '',
                    'price' => $o['price'] ?? null,
                    'currency' => $o['currency'] ?? null,
                    'message' => $o['message'] ?? null,
                    'createdAt' => $o['createdAt'] ?? null,
                    'fileName' => is_array($o['file'] ?? null) ? ($o['file']['name'] ?? null) : null,
                ];
                break;
            }
        }
        $out[] = [
            'id' => $r['id'] ?? '',
            'ref' => $r['ref'] ?? '',
            'title' => $r['title'] ?? '',
            'description' => $r['description'] ?? null,
            'categories' => $r['categories'] ?? null,
            'deadline' => $r['deadline'] ?? null,
            'createdAt' => $r['createdAt'] ?? null,
            'myOffer' => $mine,
        ];
    }
    pout(200, ['ok' => true, 'rfqs' => $out]);
}

// GET /messages — internal thread with DSCC (any logged-in supplier)
if ($sub === '/messages' && $method === 'GET') {
    list($me) = portal_auth_supplier();
    $msgs = [];
    foreach ((array) ($me['messages'] ?? []) as $mm) {
        if (!is_array($mm)) continue;
        $msgs[] = [
            'id' => (string) ($mm['id'] ?? ''),
            'from' => (string) ($mm['from'] ?? ''),
            'body' => (string) ($mm['body'] ?? ''),
            'createdAt' => (string) ($mm['createdAt'] ?? ''),
        ];
    }
    // Mark admin messages as read by this supplier (best-effort).
    dscc_suppliers_mutate(function (&$suppliers) use ($me) {
        $idx = portal_supplier_index($suppliers, $me['id']);
        if ($idx === -1) return false;
        $changed = false;
        foreach ((array) ($suppliers[$idx]['messages'] ?? []) as $k => $mm) {
            if (is_array($mm) && empty($mm['readBySupplier'])) {
                $suppliers[$idx]['messages'][$k]['readBySupplier'] = true;
                $changed = true;
            }
        }
        return $changed;
    });
    pout(200, ['ok' => true, 'messages' => $msgs]);
}

// POST /messages — supplier sends a message to DSCC
if ($sub === '/messages' && $method === 'POST') {
    list($me) = portal_auth_supplier();
    portal_rate('msg_' . $me['id'], 10, 60);
    $body = portal_body();
    $text = isset($body['body']) && is_string($body['body']) ? trim($body['body']) : '';
    if ($text === '') pout(400, ['ok' => false, 'error' => 'Message body required']);
    if (mb_strlen($text) > 4000) pout(400, ['ok' => false, 'error' => 'Message too long (max 4000 chars)']);
    $msg = [
        'id' => dscc_rid('M_'),
        'from' => 'supplier',
        'body' => $text,
        'createdAt' => gmdate('c'),
        'readByAdmin' => false,
        'readBySupplier' => true,
    ];
    $ok = dscc_suppliers_mutate(function (&$suppliers) use ($me, $msg) {
        $idx = portal_supplier_index($suppliers, $me['id']);
        if ($idx === -1) return false;
        if (!is_array($suppliers[$idx]['messages'] ?? null)) $suppliers[$idx]['messages'] = [];
        $suppliers[$idx]['messages'][] = $msg;
        if (count($suppliers[$idx]['messages']) > 500) {
            $suppliers[$idx]['messages'] = array_slice($suppliers[$idx]['messages'], -500);
        }
        $suppliers[$idx]['updatedAt'] = gmdate('c');
        return true;
    });
    if (!$ok) pout(404, ['ok' => false, 'error' => 'Not found']);
    // Admin notification is derived from unread supplier messages (see admin.php).
    pout(200, ['ok' => true, 'message' => ['id' => $msg['id'], 'from' => 'supplier', 'body' => $msg['body'], 'createdAt' => $msg['createdAt']]]);
}

// POST /rfqs/{id}/offers  (multipart: price/currency/message + optional file)
if (preg_match('#^/rfqs/([^/]+)/offers$#', $sub, $m) && $method === 'POST') {
    list($me) = portal_auth_supplier();
    if (($me['status'] ?? '') !== 'approved') pout(403, ['ok' => false, 'error' => 'not_activated']);
    portal_rate('offer:' . $me['id']);
    $price = mb_substr(trim((string) ($_POST['price'] ?? '')), 0, 40);
    $currency = mb_substr(trim((string) ($_POST['currency'] ?? 'SAR')), 0, 10) ?: 'SAR';
    $message = mb_substr(trim((string) ($_POST['message'] ?? '')), 0, 4000);
    if ($price === '' && $message === '') pout(400, ['ok' => false, 'error' => 'empty_offer']);

    $file = null;
    $f = $_FILES['file'] ?? null;
    if (is_array($f) && ($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK) {
        $file = portal_save_upload($f, 'offer', $UPLOAD_ALLOWED);
    }

    $err = null;
    $rfqTitle = '';
    dscc_rfqs_mutate(function (&$rfqs) use ($m, $me, $price, $currency, $message, $file, &$err, &$rfqTitle) {
        foreach ($rfqs as &$r) {
            if (($r['id'] ?? null) !== $m[1]) continue;
            if (($r['status'] ?? '') !== 'open') { $err = 'closed'; return false; }
            foreach ((array) ($r['offers'] ?? []) as $o) {
                if (($o['supplierId'] ?? null) === $me['id']) { $err = 'duplicate'; return false; }
            }
            $offer = [
                'id' => dscc_rid('O_'),
                'supplierId' => $me['id'],
                'companyName' => $me['companyName'] ?? ($me['email'] ?? $me['ref']),
                'price' => $price,
                'currency' => $currency,
                'message' => $message,
                'createdAt' => gmdate('c'),
            ];
            if ($file) $offer['file'] = $file;
            if (!is_array($r['offers'] ?? null)) $r['offers'] = [];
            $r['offers'][] = $offer;
            $r['updatedAt'] = $offer['createdAt'];
            $rfqTitle = (string) ($r['title'] ?? '');
            return true;
        }
        $err = 'not_found';
        return false;
    });
    if ($err) {
        if ($file) @unlink(dscc_data_dir() . '/uploads/' . basename($file['file']));
        pout($err === 'not_found' ? 404 : 409, ['ok' => false, 'error' => $err]);
    }

    // Notify DSCC (best-effort)
    $subject = 'New supplier offer - ' . preg_replace('/[\r\n]+/', ' ', $rfqTitle);
    $msg = "RFQ: {$rfqTitle}\nSupplier: " . ($me['companyName'] ?? '-') . " (" . ($me['email'] ?? '-') . ")\nPrice: " . ($price !== '' ? "$price $currency" : '-') . "\nMessage: " . ($message !== '' ? $message : '-') . "\nAttachment: " . ($file ? $file['name'] : '-');
    @mail('contact@dsccsaudia.com', '=?UTF-8?B?' . base64_encode($subject) . '?=', $msg, "From: website@dsccsaudia.com\r\nContent-Type: text/plain; charset=UTF-8");
    pout(200, ['ok' => true]);
}

pout(404, ['ok' => false, 'error' => 'Not found']);
