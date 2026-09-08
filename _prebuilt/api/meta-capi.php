<?php
// Consent-gated Meta Conversions API sender. Secrets are generated into
// config.php at deploy time and never committed to the public repository.

if (file_exists(__DIR__ . '/config.php')) { @require_once __DIR__ . '/config.php'; }

function dscc_meta_secret($constant, $environment) {
    if (defined($constant)) return trim((string) constant($constant));
    $value = getenv($environment);
    return is_string($value) ? trim($value) : '';
}

function dscc_meta_ads_consent($consent) {
    return is_array($consent)
        && ($consent['ad_storage'] ?? '') === 'granted'
        && ($consent['ad_user_data'] ?? '') === 'granted'
        && ($consent['ad_personalization'] ?? '') === 'granted';
}

function dscc_meta_email_hash($email) {
    $normalized = strtolower(trim((string) $email));
    if ($normalized === '' || !filter_var($normalized, FILTER_VALIDATE_EMAIL)) return '';
    return hash('sha256', $normalized);
}

function dscc_meta_phone_hash($phone) {
    $digits = preg_replace('/\D+/', '', (string) $phone);
    if (strpos($digits, '00') === 0) $digits = substr($digits, 2);
    if (preg_match('/^05\d{8}$/', $digits)) $digits = '966' . substr($digits, 1);
    elseif (preg_match('/^5\d{8}$/', $digits)) $digits = '966' . $digits;
    if (!preg_match('/^\d{8,15}$/', $digits)) return '';
    return hash('sha256', $digits);
}

function dscc_meta_cookie($name) {
    $value = isset($_COOKIE[$name]) && is_string($_COOKIE[$name]) ? trim($_COOKIE[$name]) : '';
    return preg_match('/^fb\.[12]\.\d{10,14}\.[A-Za-z0-9._-]{1,160}$/', $value) ? $value : '';
}

function dscc_meta_send_lead($eventId, $source, $ref, $email, $phone, $consent) {
    $token = dscc_meta_secret('META_CAPI_ACCESS_TOKEN', 'META_CAPI_ACCESS_TOKEN');
    $pixelId = dscc_meta_secret('META_PIXEL_ID', 'META_PIXEL_ID');
    if ($pixelId === '') $pixelId = '2767855866945056';
    if ($token === '' || $eventId === '' || !dscc_meta_ads_consent($consent)) return false;

    $userData = [];
    $emailHash = dscc_meta_email_hash($email);
    $phoneHash = dscc_meta_phone_hash($phone);
    if ($emailHash !== '') $userData['em'] = [$emailHash];
    if ($phoneHash !== '') $userData['ph'] = [$phoneHash];
    $ip = trim((string) ($_SERVER['REMOTE_ADDR'] ?? ''));
    if ($ip !== '' && filter_var($ip, FILTER_VALIDATE_IP)) $userData['client_ip_address'] = $ip;
    $userAgent = substr(trim((string) ($_SERVER['HTTP_USER_AGENT'] ?? '')), 0, 512);
    if ($userAgent !== '') $userData['client_user_agent'] = $userAgent;
    $fbp = dscc_meta_cookie('_fbp');
    $fbc = dscc_meta_cookie('_fbc');
    if ($fbp !== '') $userData['fbp'] = $fbp;
    if ($fbc !== '') $userData['fbc'] = $fbc;

    $host = preg_replace('/[^A-Za-z0-9.:-]/', '', (string) ($_SERVER['HTTP_HOST'] ?? 'dsccsaudia.com'));
    $referer = trim((string) ($_SERVER['HTTP_REFERER'] ?? ''));
    $sourceUrl = filter_var($referer, FILTER_VALIDATE_URL) ? $referer : 'https://' . $host . '/';
    $event = [
        'event_name' => 'Lead',
        'event_time' => time(),
        'event_id' => $eventId,
        'action_source' => 'website',
        'event_source_url' => $sourceUrl,
        'user_data' => $userData,
        'custom_data' => [
            'currency' => 'SAR',
            'value' => 1.0,
            'content_name' => $source !== '' ? $source : 'website_form',
            'content_category' => 'website_lead',
            'order_id' => $ref,
        ],
    ];
    $payload = ['data' => [$event]];
    $testCode = dscc_meta_secret('META_CAPI_TEST_EVENT_CODE', 'META_CAPI_TEST_EVENT_CODE');
    if ($testCode !== '') $payload['test_event_code'] = $testCode;
    $json = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if (!is_string($json)) return false;

    $url = 'https://graph.facebook.com/v25.0/' . rawurlencode($pixelId) . '/events?access_token=' . rawurlencode($token);
    $status = 0;
    $response = '';
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $json,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT_MS => 1500,
            CURLOPT_TIMEOUT_MS => 3500,
        ]);
        $response = (string) curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
    } else {
        $context = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $json,
            'timeout' => 3.5,
            'ignore_errors' => true,
        ]]);
        $response = (string) @file_get_contents($url, false, $context);
        if (!empty($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) $status = (int) $m[1];
    }
    if ($status < 200 || $status >= 300) {
        $decoded = json_decode($response, true);
        $code = is_array($decoded) ? ($decoded['error']['code'] ?? 'unknown') : 'unknown';
        error_log('Meta CAPI Lead failed: HTTP ' . $status . ', code=' . $code . ', event_id=' . $eventId);
        return false;
    }
    return true;
}
