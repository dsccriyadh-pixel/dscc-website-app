<?php
// DSCC supplier registration receiver. Persists every registration to the
// supplier store (for the admin dashboard) AND emails it to contact@dsccsaudia.com.

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function out($code, $payload) {
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    out(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

$NOTIFY_TO = 'contact@dsccsaudia.com';
$MAIL_FROM = 'website@dsccsaudia.com';

// Abuse guard: when a browser sends Origin/Referer, it must match our host.
$reqHost = strtolower($_SERVER['HTTP_HOST'] ?? '');
foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $h) {
    if (!empty($_SERVER[$h])) {
        $host = strtolower((string) parse_url($_SERVER[$h], PHP_URL_HOST));
        if ($host !== '' && $reqHost !== '' && $host !== $reqHost && $host !== 'www.' . $reqHost && 'www.' . $host !== $reqHost) {
            out(403, ['ok' => false, 'error' => 'Forbidden.']);
        }
        break;
    }
}

require_once __DIR__ . '/_store.php';

$contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
$isMultipart = strpos($contentType, 'multipart/form-data') !== false;

if ($isMultipart) {
    // Structured data arrives as a JSON string in the "payload" field.
    $payloadJson = is_string($_POST['payload'] ?? null) ? $_POST['payload'] : '';
    if (strlen($payloadJson) > 65536) {
        out(413, ['ok' => false, 'error' => 'Payload too large.']);
    }
    $data = json_decode($payloadJson, true);
    if (!is_array($data)) {
        out(400, ['ok' => false, 'error' => 'Invalid JSON.']);
    }
    $body = [
        'ref' => is_string($_POST['ref'] ?? null) ? $_POST['ref'] : '',
        'at' => is_string($_POST['at'] ?? null) ? $_POST['at'] : gmdate('c'),
        'data' => $data,
    ];
} else {
    $raw = file_get_contents('php://input');
    if (strlen((string) $raw) > 65536) {
        out(413, ['ok' => false, 'error' => 'Payload too large.']);
    }
    $body = json_decode($raw, true);
    if (!is_array($body)) {
        out(400, ['ok' => false, 'error' => 'Invalid JSON.']);
    }
}

// Per-IP rate limit: 6 registrations per minute.
$rlIp = trim((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
if ($rlIp === '') $rlIp = 'unknown';
try {
    $hits = dscc_file_mutate(dscc_data_dir() . '/suppliers_rl.json', [], function (&$s) use ($rlIp) {
        $now = time();
        foreach ($s as $k => $v) { if (!is_array($v) || ($v['ts'] ?? 0) < $now - 60) unset($s[$k]); }
        $e = (isset($s[$rlIp]) && is_array($s[$rlIp]) && $now - ($s[$rlIp]['ts'] ?? 0) < 60)
            ? $s[$rlIp] : ['ts' => $now, 'n' => 0];
        $e['n'] = ($e['n'] ?? 0) + 1;
        $s[$rlIp] = $e;
        return $e['n'];
    });
    if ($hits > 6) {
        out(429, ['ok' => false, 'error' => 'Too many requests.']);
    }
} catch (Throwable $e) {
    error_log('suppliers.php rate limit failed: ' . $e->getMessage());
}

$data = is_array($body['data'] ?? null) ? $body['data'] : [];
$companyName = is_string($data['companyName'] ?? null) ? trim($data['companyName']) : '';
$phone = is_string($data['phone'] ?? null) ? trim($data['phone']) : '';
if ($companyName === '' || $phone === '') {
    out(400, ['ok' => false, 'error' => 'companyName and phone are required']);
}

// Required documents: commercial registration, national address, tax certificate
$DOC_KEYS = ['crFile', 'addressFile', 'taxFile'];
$ALLOWED = [
    'application/pdf' => '.pdf',
    'image/jpeg' => '.jpg',
    'image/png' => '.png',
];
$docs = [];
foreach ($DOC_KEYS as $key) {
    $f = $_FILES[$key] ?? null;
    if (!is_array($f) || ($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        out(400, ['ok' => false, 'error' => 'Missing required document: ' . $key]);
    }
    if (($f['size'] ?? 0) > 5 * 1024 * 1024) {
        out(413, ['ok' => false, 'error' => 'File too large (max 5MB): ' . $key]);
    }
    $mime = '';
    if (function_exists('finfo_open')) {
        $fi = finfo_open(FILEINFO_MIME_TYPE);
        if ($fi) { $mime = (string) finfo_file($fi, $f['tmp_name']); finfo_close($fi); }
    }
    if ($mime === '') $mime = (string) ($f['type'] ?? '');
    if (!isset($ALLOWED[$mime])) {
        out(400, ['ok' => false, 'error' => 'Invalid file type (PDF/JPG/PNG only): ' . $key]);
    }
    $uploadDir = dscc_data_dir() . '/uploads';
    if (!is_dir($uploadDir)) @mkdir($uploadDir, 0775, true);
    $stored = $key . '-' . dscc_rid() . $ALLOWED[$mime];
    if (!@move_uploaded_file($f['tmp_name'], $uploadDir . '/' . $stored)) {
        out(500, ['ok' => false, 'error' => 'Failed to store document: ' . $key]);
    }
    $docs[$key] = [
        'name' => mb_substr((string) ($f['name'] ?? $stored), 0, 200),
        'file' => $stored,
        'size' => (int) ($f['size'] ?? 0),
        'type' => $mime,
    ];
}

$ref = is_string($body['ref'] ?? null) ? $body['ref'] : '';
$persisted = false;
$supplier = null;
try {
    $supplier = dscc_store_append_supplier($body, $docs);
    if (empty($ref) && !empty($supplier['ref'])) $ref = $supplier['ref'];
    $persisted = true;
} catch (Throwable $e) {
    error_log('suppliers.php store failed: ' . $e->getMessage());
}

// Notify the team by email
$lines = [];
$lines[] = '== DSCC Supplier Registration ==';
if ($ref !== '') $lines[] = 'Ref  : ' . $ref;
$lines[] = 'When : ' . gmdate('c');
$lines[] = '';
foreach ($data as $k => $v) {
    if (is_scalar($v)) {
        $lines[] = $k . ' : ' . (string) $v;
    } else {
        $lines[] = $k . ' : ' . json_encode($v, JSON_UNESCAPED_UNICODE);
    }
}
if (count($docs)) {
    $lines[] = '';
    $lines[] = '-- Documents --';
    foreach ($docs as $k => $d) {
        $lines[] = $k . ' : ' . ($d['name'] ?? '') . ' (' . round(($d['size'] ?? 0) / 1024) . ' KB)';
    }
}
$message = implode("\n", $lines);

$subject = 'DSCC: تسجيل مورد جديد / New supplier registration';
if ($ref !== '') $subject .= ' [' . $ref . ']';
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$clientEmail = is_string($data['email'] ?? null) ? trim($data['email']) : '';
$replyTo = $MAIL_FROM;
if ($clientEmail !== '' && !preg_match('/[\r\n]/', $clientEmail) && filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
    $replyTo = $clientEmail;
}

$headers   = [];
$headers[] = 'From: DSCC Website <' . $MAIL_FROM . '>';
$headers[] = 'Reply-To: ' . $replyTo;
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'Content-Transfer-Encoding: 8bit';
$headers[] = 'X-Mailer: dscc-suppliers-php';

$ok = @mail($NOTIFY_TO, $encodedSubject, $message, implode("\r\n", $headers), '-f' . $MAIL_FROM);
if (!$ok) {
    error_log('suppliers.php mail() failed for ref=' . $ref);
    if (!$persisted) {
        out(502, ['ok' => false, 'error' => 'Mail failed.', 'ref' => $ref]);
    }
}

out(200, ['ok' => true, 'ref' => $ref]);
