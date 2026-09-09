<?php
// DSCC leads receiver. Persists every accepted submission for the admin
// dashboard, sends the operational email, then mirrors the accepted Lead to
// Meta CAPI without allowing Meta failures to affect the customer response.

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function out($code, $payload) {
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    out(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

$NOTIFY_TO = 'contact@dsccsaudia.com';
$MAIL_FROM = 'website@dsccsaudia.com';

// When a browser sends Origin/Referer, it must match the current host.
$reqHost = strtolower($_SERVER['HTTP_HOST'] ?? '');
foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $headerName) {
    if (!empty($_SERVER[$headerName])) {
        $host = strtolower((string) parse_url($_SERVER[$headerName], PHP_URL_HOST));
        if ($host !== '' && $reqHost !== '' && $host !== $reqHost && $host !== 'www.' . $reqHost && 'www.' . $host !== $reqHost) {
            out(403, ['ok' => false, 'error' => 'Forbidden.']);
        }
        break;
    }
}

$raw = file_get_contents('php://input');
if (!is_string($raw) || strlen($raw) > 65536) {
    out(413, ['ok' => false, 'error' => 'Payload too large.']);
}
$body = json_decode($raw, true);
if (!is_array($body) || json_last_error() !== JSON_ERROR_NONE) {
    out(400, ['ok' => false, 'error' => 'Invalid JSON.']);
}

require_once __DIR__ . '/_store.php';
require_once __DIR__ . '/meta-capi.php';

// Per-IP rate limit: 10 lead submissions per minute.
$rlIp = trim((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
if ($rlIp === '') $rlIp = 'unknown';
try {
    $hits = dscc_file_mutate(dscc_data_dir() . '/leads_rl.json', [], function (&$state) use ($rlIp) {
        $now = time();
        foreach ($state as $key => $entry) {
            if (!is_array($entry) || ($entry['ts'] ?? 0) < $now - 60) unset($state[$key]);
        }
        $entry = isset($state[$rlIp]) && is_array($state[$rlIp]) && $now - ($state[$rlIp]['ts'] ?? 0) < 60
            ? $state[$rlIp]
            : ['ts' => $now, 'n' => 0];
        $entry['n'] = ($entry['n'] ?? 0) + 1;
        $state[$rlIp] = $entry;
        return $entry['n'];
    });
    if ($hits > 10) out(429, ['ok' => false, 'error' => 'Too many requests.']);
} catch (Throwable $error) {
    error_log('leads.php rate limit unavailable');
}

$source = is_string($body['source'] ?? null) ? substr($body['source'], 0, 40) : 'unknown';
$ref = is_string($body['ref'] ?? null) ? substr($body['ref'], 0, 80) : '';
$at = is_string($body['at'] ?? null) ? substr($body['at'], 0, 40) : gmdate('c');
$data = is_array($body['data'] ?? null) ? $body['data'] : [];
$eventId = is_string($body['event_id'] ?? null) ? trim($body['event_id']) : '';
if ($eventId !== '' && !preg_match('/^[A-Za-z0-9_-]{8,128}$/', $eventId)) {
    out(400, ['ok' => false, 'error' => 'Invalid event_id.']);
}
if (!empty($body['test_mode'])) {
    out(200, ['ok' => true, 'ref' => $ref !== '' ? $ref : 'DSCC-TEST', 'test_mode' => true, 'persisted' => false]);
}

// Claim the browser event before persistence so retries cannot create a second
// CRM record or email. Committed records return their original reference.
if ($eventId !== '') {
    $duplicateRef = '';
    try {
        $duplicateRef = dscc_file_mutate(dscc_data_dir() . '/lead_event_ids.json', [], function (&$ids) use ($eventId, $ref) {
            if (isset($ids[$eventId]) && is_string($ids[$eventId])) return $ids[$eventId];
            $ids[$eventId] = $ref !== '' ? $ref : 'pending';
            if (count($ids) > 5000) $ids = array_slice($ids, -4000, null, true);
            return '';
        });
    } catch (Throwable $error) {
        error_log('leads.php idempotency unavailable');
    }
    if ($duplicateRef !== '' && $duplicateRef !== 'pending') {
        out(200, ['ok' => true, 'ref' => $duplicateRef, 'deduplicated' => true]);
    }
    $data['event_id'] = $eventId;
}

$consent = is_array($body['consent'] ?? null) ? $body['consent'] : [];
$data['attribution'] = is_array($body['attribution'] ?? null) ? $body['attribution'] : [];
$data['consent'] = $consent;
$data['language'] = is_string($body['language'] ?? null) ? substr($body['language'], 0, 12) : '';
$body['data'] = $data;

$persisted = false;
try {
    if (function_exists('dscc_store_append_lead')) {
        $saved = dscc_store_append_lead($body);
        if ($ref === '' && !empty($saved['ref'])) $ref = $saved['ref'];
        $persisted = true;
    }
} catch (Throwable $error) {
    error_log('leads.php store failed');
}
if ($persisted && $eventId !== '') {
    try {
        dscc_file_mutate(dscc_data_dir() . '/lead_event_ids.json', [], function (&$ids) use ($eventId, $ref) {
            $ids[$eventId] = $ref;
            return true;
        });
    } catch (Throwable $error) {
        error_log('leads.php idempotency commit unavailable');
    }
}

$sourceLabels = [
    'quote' => 'طلب عرض سعر / Quote request',
    'contact' => 'رسالة تواصل / Contact message',
    'chatbot' => 'محادثة شات بوت / Chatbot conversation',
    'newsletter' => 'اشتراك نشرة / Newsletter signup',
    'showroom' => 'حجز زيارة معرض / Showroom visit booking',
    'calculator' => 'طلب حاسبة التكلفة / Cost calculator lead',
];
$sourceLabel = $sourceLabels[$source] ?? $source;

$clientEmail = '';
$clientName = '';
$clientPhone = '';
foreach (['email', 'clientEmail', 'contactEmail'] as $key) {
    if (!empty($data[$key]) && is_string($data[$key])) {
        $clientEmail = trim($data[$key]);
        break;
    }
}
foreach (['name', 'fullName', 'clientName'] as $key) {
    if (!empty($data[$key]) && is_string($data[$key])) {
        $clientName = trim($data[$key]);
        break;
    }
}
foreach (['phone', 'mobile', 'whatsapp'] as $key) {
    if (!empty($data[$key]) && is_string($data[$key])) {
        $clientPhone = trim($data[$key]);
        break;
    }
}

$lines = [];
$lines[] = '== DSCC Website Submission ==';
$lines[] = 'Type : ' . $sourceLabel;
if ($ref !== '') $lines[] = 'Ref  : ' . $ref;
$lines[] = 'When : ' . $at;
if ($clientName !== '') $lines[] = 'Name : ' . $clientName;
if ($clientEmail !== '') $lines[] = 'Email: ' . $clientEmail;
if ($clientPhone !== '') $lines[] = 'Phone: ' . $clientPhone;
$lines[] = '';
$lines[] = '-- Details --';

if ($source === 'chatbot' && isset($data['conversation']) && is_array($data['conversation'])) {
    foreach ($data['conversation'] as $message) {
        if (!is_array($message)) continue;
        $role = ($message['role'] ?? '') === 'user' ? 'USER     ' : 'ASSISTANT';
        $content = is_string($message['content'] ?? null) ? trim($message['content']) : '';
        if ($content === '') continue;
        $lines[] = $role . ' : ' . $content;
        $lines[] = '';
    }
} else {
    foreach ($data as $key => $value) {
        $lines[] = $key . ' : ' . (is_scalar($value)
            ? (string) $value
            : json_encode($value, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
}
$lines[] = '';
$lines[] = '-- Raw payload --';
$lines[] = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
$message = implode("\n", $lines);

$subjectMap = [
    'quote' => 'طلب عرض سعر جديد',
    'contact' => 'رسالة تواصل جديدة',
    'chatbot' => 'محادثة شات بوت جديدة',
    'newsletter' => 'اشتراك نشرة جديد',
    'showroom' => 'حجز زيارة معرض جديد',
    'calculator' => 'طلب حاسبة تكلفة جديد',
];
$subject = 'DSCC: ' . ($subjectMap[$source] ?? 'إرسال جديد من الموقع');
if ($ref !== '') $subject .= ' [' . $ref . ']';
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$replyTo = $MAIL_FROM;
if ($clientEmail !== '' && !preg_match('/[\r\n]/', $clientEmail) && filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
    $replyTo = $clientEmail;
}
$headers = [
    'From: DSCC Website <' . $MAIL_FROM . '>',
    'Reply-To: ' . $replyTo,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: dscc-leads-php',
];
$mailSent = @mail($NOTIFY_TO, $encodedSubject, $message, implode("\r\n", $headers), '-f' . $MAIL_FROM);
if (!$mailSent && !$persisted) {
    error_log('leads.php mail and storage failed');
    out(502, ['ok' => false, 'error' => 'Submission failed.', 'ref' => $ref]);
}
if (!$mailSent) error_log('leads.php mail failed after persistence');

// Meta is downstream of an accepted lead. It shares the browser event ID and
// never changes the successful customer response when Graph is unavailable.
if ($eventId !== '' && ($persisted || $mailSent)) {
    try {
        dscc_meta_send_once($eventId, $source, $ref, $clientEmail, $clientPhone, $consent);
    } catch (Throwable $error) {
        error_log('Meta CAPI dispatch unavailable');
    }
}

out(200, ['ok' => true, 'ref' => $ref]);