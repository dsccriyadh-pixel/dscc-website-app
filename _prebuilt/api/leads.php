<?php
// DSCC leads receiver. Persists every submission to the lead store (for the
// admin dashboard) AND emails it to contact@dsccsaudia.com.

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

$raw = file_get_contents('php://input');
// Payload ceiling: no legitimate lead is anywhere near 64 KB.
if (strlen((string) $raw) > 65536) {
    out(413, ['ok' => false, 'error' => 'Payload too large.']);
}
$body = json_decode($raw, true);
if (!is_array($body)) {
    out(400, ['ok' => false, 'error' => 'Invalid JSON.']);
}

// Per-IP rate limit: 10 lead submissions per minute.
require_once __DIR__ . '/_store.php';
$rlIp = trim((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
if ($rlIp === '') $rlIp = 'unknown';
try {
    $hits = dscc_file_mutate(dscc_data_dir() . '/leads_rl.json', [], function (&$s) use ($rlIp) {
        $now = time();
        foreach ($s as $k => $v) { if (!is_array($v) || ($v['ts'] ?? 0) < $now - 60) unset($s[$k]); }
        $e = (isset($s[$rlIp]) && is_array($s[$rlIp]) && $now - ($s[$rlIp]['ts'] ?? 0) < 60)
            ? $s[$rlIp] : ['ts' => $now, 'n' => 0];
        $e['n'] = ($e['n'] ?? 0) + 1;
        $s[$rlIp] = $e;
        return $e['n'];
    });
    if ($hits > 10) {
        out(429, ['ok' => false, 'error' => 'Too many requests.']);
    }
} catch (Throwable $e) {
    error_log('leads.php rate limit failed: ' . $e->getMessage());
}

$source = is_string($body['source'] ?? null) ? $body['source'] : 'unknown';
$ref    = is_string($body['ref'] ?? null) ? $body['ref'] : '';
$at     = is_string($body['at'] ?? null) ? $body['at'] : gmdate('c');
$data   = is_array($body['data'] ?? null) ? $body['data'] : [];
$eventId = is_string($body['event_id'] ?? null) ? preg_replace('/[^A-Za-z0-9_-]/', '', $body['event_id']) : '';
if (!empty($body['test_mode'])) {
    out(200, ['ok' => true, 'ref' => $ref !== '' ? $ref : 'DSCC-TEST', 'test_mode' => true, 'persisted' => false]);
}
// Idempotency protects retried browser submissions from duplicate CRM records
// and duplicate email alerts. Test mode never bypasses this production guard.
if ($eventId !== '') {
    $duplicateRef = '';
    try {
        $duplicateRef = dscc_file_mutate(dscc_data_dir() . '/lead_event_ids.json', [], function (&$ids) use ($eventId, $ref) {
            if (isset($ids[$eventId]) && is_string($ids[$eventId])) return $ids[$eventId];
            $ids[$eventId] = $ref !== '' ? $ref : 'pending';
            if (count($ids) > 5000) $ids = array_slice($ids, -4000, null, true);
            return '';
        });
    } catch (Throwable $e) { error_log('leads.php idempotency failed: ' . $e->getMessage()); }
    if ($duplicateRef !== '' && $duplicateRef !== 'pending') out(200, ['ok' => true, 'ref' => $duplicateRef, 'deduplicated' => true]);
    $data['event_id'] = $eventId;
}
$data['attribution'] = is_array($body['attribution'] ?? null) ? $body['attribution'] : [];
$data['consent'] = is_array($body['consent'] ?? null) ? $body['consent'] : [];
$data['language'] = is_string($body['language'] ?? null) ? substr($body['language'], 0, 12) : '';
$body['data'] = $data;

// Persist the lead so the admin dashboard can manage it. Never let a storage
// failure block the email notification below.
$persisted = false;
try {
    if (function_exists('dscc_store_append_lead')) {
        $saved = dscc_store_append_lead($body);
        if (empty($ref) && !empty($saved['ref'])) $ref = $saved['ref'];
        $persisted = true;
    }
} catch (Throwable $e) {
    error_log('leads.php store failed: ' . $e->getMessage());
}
if ($persisted && $eventId !== '') {
    try { dscc_file_mutate(dscc_data_dir() . '/lead_event_ids.json', [], function (&$ids) use ($eventId, $ref) { $ids[$eventId] = $ref; }); } catch (Throwable $e) { error_log('leads.php idempotency commit failed: ' . $e->getMessage()); }
}

$sourceLabels = [
    'quote'      => 'طلب عرض سعر / Quote request',
    'contact'    => 'رسالة تواصل / Contact message',
    'chatbot'    => 'محادثة شات بوت / Chatbot conversation',
    'newsletter' => 'اشتراك نشرة / Newsletter signup',
    'showroom'   => 'حجز زيارة معرض / Showroom visit booking',
    'calculator' => 'طلب حاسبة التكلفة / Cost calculator lead',
];
$sourceLabel = $sourceLabels[$source] ?? $source;

$clientEmail = '';
$clientName  = '';
$clientPhone = '';
foreach (['email','clientEmail','contactEmail'] as $k) {
    if (!empty($data[$k]) && is_string($data[$k])) { $clientEmail = trim($data[$k]); break; }
}
foreach (['name','fullName','clientName'] as $k) {
    if (!empty($data[$k]) && is_string($data[$k])) { $clientName = trim($data[$k]); break; }
}
foreach (['phone','mobile','whatsapp'] as $k) {
    if (!empty($data[$k]) && is_string($data[$k])) { $clientPhone = trim($data[$k]); break; }
}

// Build readable plain-text body
$lines = [];
$lines[] = '== DSCC Website Submission ==';
$lines[] = 'Type : ' . $sourceLabel;
if ($ref !== '')         $lines[] = 'Ref  : ' . $ref;
$lines[] = 'When : ' . $at;
if ($clientName !== '')  $lines[] = 'Name : ' . $clientName;
if ($clientEmail !== '') $lines[] = 'Email: ' . $clientEmail;
if ($clientPhone !== '') $lines[] = 'Phone: ' . $clientPhone;
$lines[] = '';
$lines[] = '-- Details --';

if ($source === 'chatbot' && isset($data['conversation']) && is_array($data['conversation'])) {
    foreach ($data['conversation'] as $m) {
        if (!is_array($m)) continue;
        $r = ($m['role'] ?? '') === 'user' ? 'USER     ' : 'ASSISTANT';
        $c = is_string($m['content'] ?? null) ? trim($m['content']) : '';
        if ($c === '') continue;
        $lines[] = $r . ' : ' . $c;
        $lines[] = '';
    }
} else {
    foreach ($data as $k => $v) {
        if (is_scalar($v)) {
            $lines[] = $k . ' : ' . (string) $v;
        } else {
            $lines[] = $k . ' : ' . json_encode($v, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }
    }
}

$lines[] = '';
$lines[] = '-- Raw payload --';
$lines[] = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

$message = implode("\n", $lines);

$subjectMap = [
    'quote'      => 'طلب عرض سعر جديد',
    'contact'    => 'رسالة تواصل جديدة',
    'chatbot'    => 'محادثة شات بوت جديدة',
    'newsletter' => 'اشتراك نشرة جديد',
    'showroom'   => 'حجز زيارة معرض جديد',
    'calculator' => 'طلب حاسبة تكلفة جديد',
];
$subject = 'DSCC: ' . ($subjectMap[$source] ?? 'إرسال جديد من الموقع');
if ($ref !== '') $subject .= ' [' . $ref . ']';

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

// Guard against mail header (CRLF) injection via the client-supplied email.
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
$headers[] = 'X-Mailer: dscc-leads-php';

$ok = @mail($NOTIFY_TO, $encodedSubject, $message, implode("\r\n", $headers), '-f' . $MAIL_FROM);
if (!$ok) {
    error_log('leads.php mail() failed for ref=' . $ref);
    // Storage-first semantics: the lead is already saved for the admin
    // dashboard, so report success — a 5xx here would make the client retry
    // and create duplicate leads.
    if (!$persisted) {
        out(502, ['ok' => false, 'error' => 'Mail failed.', 'ref' => $ref]);
    }
}

out(200, ['ok' => true, 'ref' => $ref]);
