<?php
// Server-side Meta Conversions API endpoint. The access token is generated
// into config.php and is sent only as an Authorization header.
if (file_exists(__DIR__ . '/config.php')) @require_once __DIR__ . '/config.php';
if (file_exists(__DIR__ . '/_store.php')) @require_once __DIR__ . '/_store.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function dscc_meta_out($status, $data) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function dscc_meta_secret($constant, $env) {
    if (defined($constant)) return trim((string) constant($constant));
    $value = getenv($env);
    return is_string($value) ? trim($value) : '';
}
function dscc_meta_consent($consent) {
    return is_array($consent)
        && ($consent['ad_storage'] ?? '') === 'granted'
        && ($consent['ad_user_data'] ?? '') === 'granted'
        && ($consent['ad_personalization'] ?? '') === 'granted';
}
function dscc_meta_email($value) {
    $value = strtolower(trim((string) $value));
    return $value !== '' && filter_var($value, FILTER_VALIDATE_EMAIL) ? hash('sha256', $value) : '';
}
function dscc_meta_phone($value) {
    $digits = preg_replace('/\D+/', '', (string) $value);
    if (strpos($digits, '00') === 0) $digits = substr($digits, 2);
    if (preg_match('/^05\d{8}$/', $digits)) $digits = '966' . substr($digits, 1);
    elseif (preg_match('/^5\d{8}$/', $digits)) $digits = '966' . $digits;
    return preg_match('/^\d{8,15}$/', $digits) ? hash('sha256', $digits) : '';
}
function dscc_meta_cookie($name) {
    $value = isset($_COOKIE[$name]) && is_string($_COOKIE[$name]) ? trim($_COOKIE[$name]) : '';
    return preg_match('/^fb\.[12]\.\d{10,14}\.[A-Za-z0-9._-]{1,160}$/', $value) ? $value : '';
}
function dscc_meta_send($eventId, $source, $ref, $email, $phone, $consent) {
    $token = dscc_meta_secret('META_CAPI_ACCESS_TOKEN', 'META_CAPI_ACCESS_TOKEN');
    $pixel = dscc_meta_secret('META_PIXEL_ID', 'META_PIXEL_ID') ?: '2767855866945056';
    if ($token === '' || !dscc_meta_consent($consent)) return false;
    $user = [];
    if (($v = dscc_meta_email($email)) !== '') $user['em'] = [$v];
    if (($v = dscc_meta_phone($phone)) !== '') $user['ph'] = [$v];
    $ip = trim((string) ($_SERVER['REMOTE_ADDR'] ?? ''));
    if (filter_var($ip, FILTER_VALIDATE_IP)) $user['client_ip_address'] = $ip;
    $ua = substr(trim((string) ($_SERVER['HTTP_USER_AGENT'] ?? '')), 0, 512);
    if ($ua !== '') $user['client_user_agent'] = $ua;
    foreach (['_fbp', '_fbc'] as $cookie) if (($v = dscc_meta_cookie($cookie)) !== '') $user[substr($cookie, 1)] = $v;
    $host = preg_replace('/[^A-Za-z0-9.:-]/', '', (string) ($_SERVER['HTTP_HOST'] ?? 'dsccsaudia.com'));
    $referer = trim((string) ($_SERVER['HTTP_REFERER'] ?? ''));
    $url = filter_var($referer, FILTER_VALIDATE_URL) ? $referer : 'https://' . $host . '/';
    $payload = ['data' => [[
        'event_name' => 'Lead', 'event_time' => time(), 'event_id' => $eventId,
        'action_source' => 'website', 'event_source_url' => $url, 'user_data' => $user,
        'custom_data' => ['content_name' => $source ?: 'website_form',
            'content_category' => 'website_lead', 'order_id' => $ref],
    ]];
    $test = dscc_meta_secret('META_CAPI_TEST_EVENT_CODE', 'META_CAPI_TEST_EVENT_CODE');
    if ($test !== '') $payload['test_event_code'] = $test;
    $json = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if (!is_string($json)) return false;
    $endpoint = 'https://graph.facebook.com/v26.0/' . rawurlencode($pixel) . '/events';
    $status = 0; $response = '';
    if (function_exists('curl_init')) {
        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => $json,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . $token],
            CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT_MS => 1500, CURLOPT_TIMEOUT_MS => 3500]);
        $response = (string) curl_exec($ch); $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    }
    if ($status < 200 || $status >= 300) {
        error_log('Meta CAPI Lead failed: HTTP ' . $status . ', event_id=' . substr($eventId, 0, 80));
        return false;
    }
    return true;
}

function dscc_meta_send_once($event, $source, $ref, $email, $phone, $consent) {
    $dedupe = function_exists('dscc_data_dir') ? dscc_data_dir() . '/meta_event_ids.json' : sys_get_temp_dir() . '/dscc_meta_event_ids.json';
    $claimed = false;
    if (function_exists('dscc_file_mutate')) {
        try {
            $claimed = dscc_file_mutate($dedupe, [], function (&$ids) use ($event) {
                $now = time();
                foreach ($ids as $id => $entry) {
                    $ts = is_array($entry) ? (int) ($entry['ts'] ?? 0) : (int) $entry;
                    if ($ts < $now - 604800) unset($ids[$id]);
                }
                if (isset($ids[$event])) {
                    $entry = $ids[$event];
                    $state = is_array($entry) ? ($entry['state'] ?? 'sent') : 'sent';
                    $ts = is_array($entry) ? (int) ($entry['ts'] ?? 0) : (int) $entry;
                    if ($state === 'sent' || ($state === 'pending' && $ts >= $now - 300)) return false;
                }
                $ids[$event] = ['state' => 'pending', 'ts' => $now];
                return true;
            });
            if (!$claimed) return ['ok' => true, 'deduplicated' => true];
        } catch (Throwable $e) {
            error_log('Meta CAPI dedupe claim unavailable');
        }
    }
    $ok = dscc_meta_send($event, $source, $ref, $email, $phone, $consent);
    if ($claimed && function_exists('dscc_file_mutate')) {
        try {
            dscc_file_mutate($dedupe, [], function (&$ids) use ($event, $ok) {
                if ($ok) $ids[$event] = ['state' => 'sent', 'ts' => time()];
                else unset($ids[$event]);
                return true;
            });
        } catch (Throwable $e) {
            error_log('Meta CAPI dedupe commit unavailable');
        }
    }
    return ['ok' => $ok, 'deduplicated' => false];
}

function dscc_meta_handle_request() {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        header('Allow: POST');
        dscc_meta_out(405, ['ok' => false, 'error' => 'Method not allowed.']);
    }
    $length = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($length > 65536) dscc_meta_out(413, ['ok' => false, 'error' => 'Payload too large.']);
    $raw = file_get_contents('php://input');
    if (!is_string($raw) || strlen($raw) > 65536) dscc_meta_out(413, ['ok' => false, 'error' => 'Payload too large.']);
    $body = json_decode($raw, true);
    if (!is_array($body) || json_last_error() !== JSON_ERROR_NONE) dscc_meta_out(400, ['ok' => false, 'error' => 'Invalid JSON.']);
    $event = is_string($body['event_id'] ?? null) ? trim($body['event_id']) : '';
    if (!preg_match('/^[A-Za-z0-9_-]{8,128}$/', $event)) dscc_meta_out(400, ['ok' => false, 'error' => 'Invalid event_id.']);
    if (!dscc_meta_consent($body['consent'] ?? null)) dscc_meta_out(403, ['ok' => false, 'error' => 'Advertising consent required.']);

    $ip = trim((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    $rateFile = function_exists('dscc_data_dir') ? dscc_data_dir() . '/meta_rl.json' : sys_get_temp_dir() . '/dscc_meta_rl.json';
    if (function_exists('dscc_file_mutate')) {
        try {
            $hits = dscc_file_mutate($rateFile, [], function (&$all) use ($ip) {
                $now = time();
                foreach ($all as $k => $v) if (($v['ts'] ?? 0) < $now - 60) unset($all[$k]);
                $all[$ip] = ['ts' => $now, 'n' => (($all[$ip]['n'] ?? 0) + 1)];
                return $all[$ip]['n'];
            });
            if ($hits > 10) dscc_meta_out(429, ['ok' => false, 'error' => 'Too many requests.']);
        } catch (Throwable $e) {
            error_log('Meta CAPI rate limiter unavailable');
        }
    }
    $result = dscc_meta_send_once(
        $event,
        is_string($body['source'] ?? null) ? $body['source'] : '',
        is_string($body['ref'] ?? null) ? $body['ref'] : '',
        $body['email'] ?? ($body['data']['email'] ?? ''),
        $body['phone'] ?? ($body['data']['phone'] ?? ''),
        $body['consent']
    );
    dscc_meta_out($result['ok'] ? 200 : 502, ['ok' => $result['ok'], 'deduplicated' => $result['deduplicated']]);
}

$scriptFile = isset($_SERVER['SCRIPT_FILENAME']) ? realpath((string) $_SERVER['SCRIPT_FILENAME']) : false;
if ($scriptFile !== false && $scriptFile === realpath(__FILE__)) {
    dscc_meta_handle_request();
}