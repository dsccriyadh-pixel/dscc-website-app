<?php
// DSCC leads receiver. Emails every form/chatbot submission to contact@dsccsaudia.com.

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

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) {
    out(400, ['ok' => false, 'error' => 'Invalid JSON.']);
}

$source = is_string($body['source'] ?? null) ? $body['source'] : 'unknown';
$ref    = is_string($body['ref'] ?? null) ? $body['ref'] : '';
$at     = is_string($body['at'] ?? null) ? $body['at'] : gmdate('c');
$data   = is_array($body['data'] ?? null) ? $body['data'] : [];

$sourceLabels = [
    'quote'      => 'طلب عرض سعر / Quote request',
    'contact'    => 'رسالة تواصل / Contact message',
    'chatbot'    => 'محادثة شات بوت / Chatbot conversation',
    'newsletter' => 'اشتراك نشرة / Newsletter signup',
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
];
$subject = 'DSCC: ' . ($subjectMap[$source] ?? 'إرسال جديد من الموقع');
if ($ref !== '') $subject .= ' [' . $ref . ']';

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$headers   = [];
$headers[] = 'From: DSCC Website <' . $MAIL_FROM . '>';
$headers[] = 'Reply-To: ' . ($clientEmail !== '' ? $clientEmail : $MAIL_FROM);
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'Content-Transfer-Encoding: 8bit';
$headers[] = 'X-Mailer: dscc-leads-php';

$ok = @mail($NOTIFY_TO, $encodedSubject, $message, implode("\r\n", $headers), '-f' . $MAIL_FROM);
if (!$ok) {
    error_log('leads.php mail() failed for ref=' . $ref);
    out(502, ['ok' => false, 'error' => 'Mail failed.', 'ref' => $ref]);
}

out(200, ['ok' => true, 'ref' => $ref]);
