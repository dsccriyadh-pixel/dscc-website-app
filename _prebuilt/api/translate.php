<?php
// DSCC translation proxy for the admin dashboard. Translates lead text between
// Arabic and English via OpenAI. Falls back to the original text on any failure.

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/_store.php';
if (file_exists(__DIR__ . '/config.php')) { @require_once __DIR__ . '/config.php'; }

$body = json_decode(file_get_contents('php://input'), true);
$text = (is_array($body) && isset($body['text']) && is_string($body['text'])) ? trim($body['text']) : '';
$target = (is_array($body) && ($body['target'] ?? '') === 'ar') ? 'ar' : 'en';

if ($text === '') { echo json_encode(['ok' => true, 'translated' => '']); exit; }

// Cap length and rate-limit per IP to prevent abuse of the OpenAI proxy.
if (mb_strlen($text) > 5000) $text = mb_substr($text, 0, 5000);
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$ip = trim(explode(',', $ip)[0]);
try {
    $hits = dscc_file_mutate(dscc_data_dir() . '/translate_rl.json', [], function (&$s) use ($ip) {
        $now = time();
        foreach ($s as $k => $v) { if (!is_array($v) || ($v['ts'] ?? 0) < $now - 60) unset($s[$k]); }
        $e = (isset($s[$ip]) && is_array($s[$ip])) ? $s[$ip] : ['ts' => $now, 'n' => 0];
        if ($now - ($e['ts'] ?? 0) >= 60) $e = ['ts' => $now, 'n' => 0];
        $e['n'] = ($e['n'] ?? 0) + 1;
        $s[$ip] = $e;
        return $e['n'];
    });
    if ($hits > 60) {
        http_response_code(429);
        echo json_encode(['ok' => false, 'translated' => $text], JSON_UNESCAPED_UNICODE);
        exit;
    }
} catch (Throwable $e) { /* never block translation on rate-limit bookkeeping */ }

function tr_key() {
    if (defined('OPENAI_API_KEY') && OPENAI_API_KEY) return OPENAI_API_KEY;
    $e = getenv('OPENAI_API_KEY'); if ($e) return $e;
    $f = __DIR__ . '/.openai_key';
    if (is_file($f)) { $k = trim(@file_get_contents($f)); if ($k) return $k; }
    return null;
}

$key = tr_key();
if (!$key) { echo json_encode(['ok' => false, 'translated' => $text], JSON_UNESCAPED_UNICODE); exit; }

$targetName = $target === 'ar' ? 'Arabic' : 'English';
$payload = [
    'model' => 'gpt-4o-mini',
    'temperature' => 0.2,
    'messages' => [
        ['role' => 'system', 'content' => "You are a translation engine. Translate the user's text to $targetName. Return only the translation, with no quotes or extra commentary."],
        ['role' => 'user', 'content' => $text],
    ],
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . $key],
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
    CURLOPT_TIMEOUT => 20,
]);
$resp = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($resp === false || $code >= 400) { echo json_encode(['ok' => false, 'translated' => $text], JSON_UNESCAPED_UNICODE); exit; }

$j = json_decode($resp, true);
$out = trim($j['choices'][0]['message']['content'] ?? '');
echo json_encode(['ok' => true, 'translated' => $out !== '' ? $out : $text], JSON_UNESCAPED_UNICODE);
