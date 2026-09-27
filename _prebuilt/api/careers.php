<?php
// DSCC careers API: email verification and private CV submission storage.

$storeCandidates = [
    __DIR__ . '/_store.php',
    __DIR__ . '/../../_prebuilt/api/_store.php',
    __DIR__ . '/../../../_prebuilt/api/_store.php',
];
$storeLoaded = false;
foreach ($storeCandidates as $storeCandidate) {
    if (is_file($storeCandidate)) {
        require_once $storeCandidate;
        $storeLoaded = true;
        break;
    }
}
if (!$storeLoaded) {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    http_response_code(503);
    echo '{"ok":false,"error":"Unable to process request."}';
    exit;
}
if (file_exists(__DIR__ . '/config.php')) { @require_once __DIR__ . '/config.php'; }

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
date_default_timezone_set('UTC');

function careers_out($status, $payload) {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function careers_data_dir() {
    $dir = dscc_data_dir();
    $realDir = realpath($dir);
    $docroot = $_SERVER['DOCUMENT_ROOT'] ?? '';
    $realRoot = $docroot !== '' ? realpath($docroot) : false;
    if (!$realDir || ($realRoot && ($realDir === $realRoot || strpos($realDir, $realRoot . DIRECTORY_SEPARATOR) === 0))) {
        throw new RuntimeException('Private storage unavailable');
    }
    return $realDir;
}

function careers_secret() {
    $configured = getenv('DSCC_CAREERS_HMAC_KEY');
    if ($configured !== false && strlen($configured) >= 32) return $configured;
    if (defined('DSCC_CAREERS_HMAC_KEY') && is_string(DSCC_CAREERS_HMAC_KEY) && strlen(DSCC_CAREERS_HMAC_KEY) >= 32) {
        return DSCC_CAREERS_HMAC_KEY;
    }
    $path = careers_data_dir() . '/careers_hmac.key';
    $lock = @fopen($path . '.lock', 'c');
    if (!$lock || !@flock($lock, LOCK_EX)) {
        if ($lock) @fclose($lock);
        throw new RuntimeException('Private key unavailable');
    }
    try {
        $secret = is_file($path) ? @file_get_contents($path) : false;
        if (!is_string($secret) || strlen($secret) < 32) {
            $secret = random_bytes(32);
            $tmp = $path . '.' . getmypid() . '.tmp';
            if (@file_put_contents($tmp, $secret, LOCK_EX) === false || !@rename($tmp, $path)) {
                @unlink($tmp);
                throw new RuntimeException('Private key unavailable');
            }
            @chmod($path, 0600);
        }
        return $secret;
    } finally {
        @flock($lock, LOCK_UN);
        @fclose($lock);
    }
}

function careers_store_file() {
    return careers_data_dir() . '/careers.json';
}

function careers_email_key($email) {
    return hash_hmac('sha256', strtolower(trim($email)), careers_secret());
}

function careers_code_hash($email, $code) {
    return hash_hmac('sha256', strtolower(trim($email)) . "\n" . $code, careers_secret());
}

function careers_limit_code_request($ip, $email) {
    $secret = careers_secret();
    $keys = [
        'ip:' . hash_hmac('sha256', (string) $ip, $secret),
        'email:' . hash_hmac('sha256', strtolower(trim($email)), $secret),
    ];
    return dscc_file_mutate(careers_data_dir() . '/careers_rate_limits.json', [], function (&$state) use ($keys) {
        $now = time();
        foreach ($state as $key => $times) {
            if (!is_array($times)) { unset($state[$key]); continue; }
            $state[$key] = array_values(array_filter($times, function ($ts) use ($now) {
                return is_numeric($ts) && (int) $ts > $now - 3600;
            }));
            if (!$state[$key]) unset($state[$key]);
        }
        $retryAfter = 0;
        foreach ($keys as $key) {
            $state[$key] = isset($state[$key]) && is_array($state[$key]) ? $state[$key] : [];
            if (count($state[$key]) >= 5) {
                $retryAfter = max($retryAfter, max(1, (int) $state[$key][0] + 3600 - $now));
            }
        }
        if ($retryAfter > 0) return ['allowed' => false, 'retryAfter' => $retryAfter];
        foreach ($keys as $key) $state[$key][] = $now;
        return ['allowed' => true, 'retryAfter' => 0];
    });
}

function careers_deliver_code($email, $subject, $message, $headers, $from) {
    if (PHP_SAPI === 'cli' && defined('DSCC_CAREERS_TESTING') && DSCC_CAREERS_TESTING
        && isset($GLOBALS['DSCC_CAREERS_TEST_MAILER']) && is_callable($GLOBALS['DSCC_CAREERS_TEST_MAILER'])) {
        return (bool) call_user_func($GLOBALS['DSCC_CAREERS_TEST_MAILER'], $email, $subject, $message, $headers, $from);
    }
    return @mail($email, $subject, $message, $headers, '-f' . $from);
}

function careers_send_code($email) {
    $email = strtolower(trim($email));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
        return ['status' => 400, 'retryAfter' => 0, 'payload' => ['ok' => false, 'error' => 'Unable to process request.']];
    }
    try {
        $limit = careers_limit_code_request($_SERVER['REMOTE_ADDR'] ?? 'unknown', $email);
        if (empty($limit['allowed'])) {
            return ['status' => 429, 'retryAfter' => (int) ($limit['retryAfter'] ?? 0), 'payload' => ['ok' => false, 'error' => 'Unable to process request.']];
        }
        $emailKey = careers_email_key($email);
        $now = time();
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $reservation = dscc_file_mutate(careers_store_file(), ['otp' => [], 'applications' => [], 'submissions' => []], function (&$state) use ($emailKey, $email, $now, $code) {
            if (!is_array($state)) $state = [];
            if (!isset($state['otp']) || !is_array($state['otp'])) $state['otp'] = [];
            if (!isset($state['applications']) || !is_array($state['applications'])) $state['applications'] = [];
            if (!isset($state['submissions']) || !is_array($state['submissions'])) $state['submissions'] = [];
            $existing = $state['otp'][$emailKey] ?? null;
            if (is_array($existing) && $now - (int) ($existing['sentAt'] ?? 0) < 60) {
                return ['cooldown' => max(1, 60 - ($now - (int) ($existing['sentAt'] ?? 0)))];
            }
            $state['otp'][$emailKey] = [
                'codeHash' => careers_code_hash($email, $code),
                'sentAt' => $now,
                'expiresAt' => $now + 600,
                'attempts' => 0,
                'used' => false,
                'pending' => true,
            ];
            return ['cooldown' => 0];
        });
        if ((int) ($reservation['cooldown'] ?? 0) > 0) {
            return ['status' => 429, 'retryAfter' => (int) $reservation['cooldown'], 'payload' => ['ok' => false, 'error' => 'Unable to process request.']];
        }
        $from = 'website@dsccsaudia.com';
        $subject = 'DSCC careers verification code';
        $message = "Your DSCC careers verification code is: {$code}\n\nThis code expires in 10 minutes. If you did not request it, you can ignore this email.";
        $headers = [
            'From: DSCC Website <' . $from . '>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'X-Mailer: dscc-careers-php',
        ];
        $sent = careers_deliver_code($email, '=?UTF-8?B?' . base64_encode($subject) . '?=', $message, implode("\r\n", $headers), $from);
        if (!$sent) {
            dscc_file_mutate(careers_store_file(), ['otp' => [], 'applications' => [], 'submissions' => []], function (&$state) use ($emailKey) {
                if (isset($state['otp'][$emailKey]) && is_array($state['otp'][$emailKey])) {
                    $state['otp'][$emailKey]['used'] = true;
                }
            });
            return ['status' => 503, 'retryAfter' => 0, 'payload' => ['ok' => false, 'error' => 'Unable to process request.']];
        }
        dscc_file_mutate(careers_store_file(), ['otp' => [], 'applications' => [], 'submissions' => []], function (&$state) use ($emailKey, $email, $code) {
            if (!isset($state['otp'][$emailKey]) || !is_array($state['otp'][$emailKey])
                || !hash_equals((string) ($state['otp'][$emailKey]['codeHash'] ?? ''), careers_code_hash($email, $code))) {
                throw new RuntimeException('Request unavailable');
            }
            $state['otp'][$emailKey]['pending'] = false;
        });
        return ['status' => 200, 'retryAfter' => 0, 'payload' => ['ok' => true]];
    } catch (Throwable $error) {
        return ['status' => 503, 'retryAfter' => 0, 'payload' => ['ok' => false, 'error' => 'Unable to process request.']];
    }
}

function careers_safe_filename($name) {
    $name = str_replace('\\', '/', (string) $name);
    $name = basename($name);
    $name = preg_replace('/[\x00-\x1F\x7F]/', '', $name);
    return substr(trim($name), 0, 240);
}

function careers_validate_cv($path, $name, $size) {
    $actualSize = is_string($path) && is_file($path) ? (int) @filesize($path) : 0;
    if (!is_string($path) || !is_file($path) || !is_readable($path) || $actualSize < 1 || $actualSize > 8 * 1024 * 1024
        || (int) $size !== $actualSize) return false;
    $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $fp = @fopen($path, 'rb');
    if (!$fp) return false;
    $head = fread($fp, 8);
    fclose($fp);
    if ($extension === 'pdf') return is_string($head) && strncmp($head, '%PDF-', 5) === 0;
    if ($extension === 'doc') return is_string($head) && $head === "\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1";
    if ($extension !== 'docx' || !is_string($head) || strncmp($head, "PK\x03\x04", 4) !== 0 || !class_exists('ZipArchive')) return false;
    $zip = new ZipArchive();
    if ($zip->open($path) !== true) return false;
    $contentTypes = $zip->statName('[Content_Types].xml');
    $entry = $zip->statName('word/document.xml');
    $totalExpanded = 0;
    for ($i = 0; $i < $zip->numFiles; $i++) {
        $stat = $zip->statIndex($i);
        if (!is_array($stat)) { $zip->close(); return false; }
        $totalExpanded += (int) ($stat['size'] ?? 0);
        if ($totalExpanded > 16 * 1024 * 1024) { $zip->close(); return false; }
    }
    if (!is_array($contentTypes) || (int) ($contentTypes['size'] ?? 0) > 1024 * 1024
        || !is_array($entry) || (int) ($entry['size'] ?? 0) > 8 * 1024 * 1024) {
        $zip->close();
        return false;
    }
    $typesXml = $zip->getFromName('[Content_Types].xml');
    $document = $zip->getFromName('word/document.xml');
    $zip->close();
    return is_string($typesXml) && preg_match('/<(?:[A-Za-z_][\w.-]*:)?Types\b/', $typesXml) === 1
        && is_string($document) && $document !== ''
        && preg_match('/<(?:[A-Za-z_][\w.-]*:)?document\b/', $document) === 1
        && preg_match('/<\/(?:[A-Za-z_][\w.-]*:)?document\s*>/', $document) === 1;
}

function careers_application_response($application) {
    return ['ok' => true, 'id' => (string) ($application['id'] ?? ''), 'ref' => (string) ($application['ref'] ?? '')];
}

function careers_move_cv($source, $destination, $allowFixture) {
    if ($allowFixture && PHP_SAPI === 'cli' && defined('DSCC_CAREERS_TESTING') && DSCC_CAREERS_TESTING) {
        return @copy($source, $destination);
    }
    return @move_uploaded_file($source, $destination);
}

function careers_submit_application($fields, $file, $allowFixture = false) {
    $fullName = is_string($fields['fullName'] ?? null) ? trim($fields['fullName']) : '';
    $email = is_string($fields['email'] ?? null) ? strtolower(trim($fields['email'])) : '';
    $phone = is_string($fields['phone'] ?? null) ? trim($fields['phone']) : '';
    $position = is_string($fields['position'] ?? null) ? trim($fields['position']) : '';
    $code = is_string($fields['code'] ?? null) ? trim($fields['code']) : '';
    $submissionId = is_string($fields['submissionId'] ?? null) ? trim($fields['submissionId']) : '';
    $failure = ['ok' => false, 'error' => 'Unable to process request.'];
    if (preg_match('/^[A-Za-z0-9_-]{16,128}$/', $submissionId) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        try {
            $submissionKey = hash_hmac('sha256', $submissionId, careers_secret());
            $priorStore = dscc_read_json(careers_store_file(), ['submissions' => []]);
            $prior = $priorStore['submissions'][$submissionKey] ?? null;
            if (is_array($prior) && strtolower((string) ($prior['email'] ?? '')) === $email) {
                return ['status' => 200, 'payload' => careers_application_response($prior)];
            }
        } catch (Throwable $error) {
            return ['status' => 503, 'payload' => $failure];
        }
    }
    if ($fullName === '' || strlen($fullName) > 200 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254
        || $phone === '' || strlen($phone) > 60 || strlen($position) > 120 || !preg_match('/^\d{6}$/', $code)
        || !preg_match('/^[A-Za-z0-9_-]{16,128}$/', $submissionId) || !is_array($file)
        || (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return ['status' => 400, 'payload' => $failure];
    }
    $cvName = careers_safe_filename($file['name'] ?? '');
    $cvSize = (int) ($file['size'] ?? 0);
    $tmpName = $file['tmp_name'] ?? '';
    $fixtureAllowed = $allowFixture && PHP_SAPI === 'cli' && defined('DSCC_CAREERS_TESTING') && DSCC_CAREERS_TESTING;
    if ($cvName === '' || !is_string($tmpName) || (!$fixtureAllowed && !is_uploaded_file($tmpName))
        || !careers_validate_cv($tmpName, $cvName, $cvSize)) {
        return ['status' => 400, 'payload' => $failure];
    }

    try {
        $storeFile = careers_store_file();
        $emailKey = careers_email_key($email);
        $submissionKey = hash_hmac('sha256', $submissionId, careers_secret());
        $id = 'C_' . base_convert((string) time(), 10, 36) . bin2hex(random_bytes(6));
        $ref = 'CAREERS-' . strtoupper(bin2hex(random_bytes(4)));
        $extension = strtolower(pathinfo($cvName, PATHINFO_EXTENSION));
        $cvDir = careers_data_dir() . '/careers_cvs';
        if (!is_dir($cvDir) && !@mkdir($cvDir, 0770, true)) throw new RuntimeException('Private storage unavailable');
        $cvPath = $cvDir . '/' . $id . '.' . $extension;
        $application = [
            'id' => $id,
            'ref' => $ref,
            'createdAt' => gmdate('c'),
            'fullName' => $fullName,
            'email' => $email,
            'phone' => $phone,
            'position' => $position,
            'cvName' => $cvName,
            'cvSize' => $cvSize,
            'cvPath' => $cvPath,
        ];

        $result = dscc_file_mutate($storeFile, ['otp' => [], 'applications' => [], 'submissions' => []], function (&$state) use ($application, $submissionKey, $emailKey, $email, $code, $tmpName, $cvPath, $fixtureAllowed) {
            if (!is_array($state)) $state = [];
            if (!isset($state['otp']) || !is_array($state['otp'])) $state['otp'] = [];
            if (!isset($state['applications']) || !is_array($state['applications'])) $state['applications'] = [];
            if (!isset($state['submissions']) || !is_array($state['submissions'])) $state['submissions'] = [];
            if (isset($state['submissions'][$submissionKey]) && is_array($state['submissions'][$submissionKey])) {
                return $state['submissions'][$submissionKey];
            }
            $otp = $state['otp'][$emailKey] ?? null;
            $now = time();
            $valid = is_array($otp) && empty($otp['used']) && empty($otp['pending']) && (int) ($otp['expiresAt'] ?? 0) >= $now
                && (int) ($otp['attempts'] ?? 0) < 5
                && isset($otp['codeHash']) && hash_equals((string) $otp['codeHash'], careers_code_hash($email, $code));
            if (!$valid) {
                if (is_array($otp) && empty($otp['pending']) && empty($otp['used']) && (int) ($otp['attempts'] ?? 0) < 5) {
                    $state['otp'][$emailKey]['attempts'] = (int) ($otp['attempts'] ?? 0) + 1;
                    if ($state['otp'][$emailKey]['attempts'] >= 5) $state['otp'][$emailKey]['used'] = true;
                }
                return null;
            }
            if (!careers_move_cv($tmpName, $cvPath, $fixtureAllowed)) throw new RuntimeException('Private storage unavailable');
            @chmod($cvPath, 0600);
            $state['otp'][$emailKey]['used'] = true;
            array_unshift($state['applications'], $application);
            $state['submissions'][$submissionKey] = $application;
            return $application;
        });
        if (!is_array($result)) return ['status' => 400, 'payload' => $failure];
        return ['status' => 200, 'payload' => careers_application_response($result)];
    } catch (Throwable $error) {
        return ['status' => 503, 'payload' => $failure];
    }
}

// Include-only entry point used by isolated CLI fixture checks.
if (PHP_SAPI === 'cli' && defined('DSCC_CAREERS_LIB_ONLY') && DSCC_CAREERS_LIB_ONLY) return;

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';
$route = preg_replace('#^.*?/api/careers#', '', $uri);
$route = '/' . trim((string) $route, '/');
if ($route === '/') $route = '';

if ($method !== 'POST' || !in_array($route, ['/code', '/apply'], true)) {
    header('Allow: POST');
    careers_out(405, ['ok' => false, 'error' => 'Unable to process request.']);
}

if ($route === '/code') {
    $rawBody = file_get_contents('php://input');
    if (!is_string($rawBody) || strlen($rawBody) > 8192) careers_out(400, ['ok' => false, 'error' => 'Unable to process request.']);
    $body = json_decode($rawBody, true);
    $email = is_array($body) && is_string($body['email'] ?? null) ? trim($body['email']) : '';
    $result = careers_send_code($email);
    if ($result['status'] === 429 && (int) ($result['retryAfter'] ?? 0) > 0) {
        header('Retry-After: ' . (int) $result['retryAfter']);
    }
    careers_out($result['status'], $result['payload']);
}

$result = careers_submit_application($_POST, $_FILES['cv'] ?? null);
careers_out($result['status'], $result['payload']);