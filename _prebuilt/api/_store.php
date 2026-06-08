<?php
// DSCC shared lead store — file-based JSON persistence with locking.
// Used by leads.php (write on submission) and admin.php (read/manage).
if (!defined('DSCC_STORE')) {
define('DSCC_STORE', 1);

function dscc_data_dir() {
    $d = __DIR__ . '/data';
    if (!is_dir($d)) { @mkdir($d, 0775, true); }
    return $d;
}
function dscc_leads_file() { return dscc_data_dir() . '/leads.json'; }
function dscc_notif_read_file() { return dscc_data_dir() . '/notif_read.json'; }

function dscc_read_json($file, $default) {
    if (!is_file($file)) return $default;
    $fp = @fopen($file, 'r');
    if (!$fp) return $default;
    @flock($fp, LOCK_SH);
    $txt = stream_get_contents($fp);
    @flock($fp, LOCK_UN);
    @fclose($fp);
    $data = json_decode($txt, true);
    return is_array($data) ? $data : $default;
}

function dscc_write_json_atomic($file, $data) {
    $dir = dirname($file);
    if (!is_dir($dir)) @mkdir($dir, 0775, true);
    $tmp = $file . '.' . getmypid() . '.' . microtime(true) . '.tmp';
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if (@file_put_contents($tmp, $json, LOCK_EX) === false) return false;
    return @rename($tmp, $file);
}

// Mutate the leads array under an exclusive lock. $fn receives the array by
// reference and may return a value, which is returned to the caller.
function dscc_leads_mutate(callable $fn) {
    $file = dscc_leads_file();
    $dir = dirname($file);
    if (!is_dir($dir)) @mkdir($dir, 0775, true);
    $lf = @fopen($file . '.lock', 'c');
    if ($lf) { @flock($lf, LOCK_EX); }
    $leads = dscc_read_json($file, []);
    $result = $fn($leads);
    dscc_write_json_atomic($file, $leads);
    if ($lf) { @flock($lf, LOCK_UN); @fclose($lf); }
    return $result;
}

function dscc_pick_str($v) {
    if (!is_string($v)) return null;
    $t = trim($v);
    return strlen($t) ? $t : null;
}
function dscc_pick_str_arr($v) {
    if (!is_array($v)) return null;
    $out = [];
    foreach ($v as $x) { if (is_string($x) && trim($x) !== '') $out[] = trim($x); }
    return count($out) ? $out : null;
}
function dscc_rid($prefix = '') {
    return $prefix . base_convert((string) time(), 10, 36) . substr(bin2hex(random_bytes(4)), 0, 6);
}
function dscc_infer_source($s) {
    return in_array($s, ['quote', 'contact', 'chatbot', 'newsletter'], true) ? $s : 'other';
}

// Normalize an incoming website payload into the Lead shape the admin expects.
function dscc_normalize_incoming($payload) {
    $now = gmdate('c');
    $data = (isset($payload['data']) && is_array($payload['data'])) ? $payload['data'] : [];
    $first = function ($keys) use ($data) {
        foreach ($keys as $k) {
            $v = dscc_pick_str($data[$k] ?? null);
            if ($v !== null) return $v;
        }
        return null;
    };

    $files = null;
    if (isset($data['files']) && is_array($data['files'])) {
        $files = [];
        foreach ($data['files'] as $f) {
            if (is_string($f)) {
                $files[] = ['name' => $f];
            } elseif (is_array($f)) {
                $name = dscc_pick_str($f['name'] ?? null);
                if ($name) {
                    $item = ['name' => $name];
                    if (isset($f['size']) && is_numeric($f['size'])) $item['size'] = (int) $f['size'];
                    $type = dscc_pick_str($f['type'] ?? null);
                    if ($type) $item['type'] = $type;
                    $files[] = $item;
                }
            }
        }
        if (!count($files)) $files = null;
    }

    $lead = [
        'id' => dscc_rid('L_'),
        'ref' => dscc_pick_str($payload['ref'] ?? null) ?: dscc_rid('DSCC-'),
        'source' => dscc_infer_source($payload['source'] ?? null),
        'status' => 'new',
        'priority' => 'normal',
        'createdAt' => dscc_pick_str($payload['at'] ?? null) ?: $now,
        'updatedAt' => $now,
        'fullName' => $first(['fullName', 'name']),
        'company' => dscc_pick_str($data['company'] ?? null),
        'email' => dscc_pick_str($data['email'] ?? null),
        'phone' => dscc_pick_str($data['phone'] ?? null),
        'city' => dscc_pick_str($data['city'] ?? null),
        'projectType' => $first(['projectType', 'type']),
        'services' => dscc_pick_str_arr($data['services'] ?? null) ?: dscc_pick_str_arr($data['serviceIds'] ?? null),
        'projectSize' => $first(['projectSize', 'size']),
        'budget' => dscc_pick_str($data['budget'] ?? null),
        'timeline' => dscc_pick_str($data['timeline'] ?? null),
        'sourcePage' => $first(['sourcePage', 'page']),
        'sourceAction' => $first(['sourceAction', 'action']),
        'message' => $first(['message', 'notes', 'details']),
        'chatbotSummary' => $first(['summary', 'chatbotSummary']),
        'intent' => dscc_pick_str($data['intent'] ?? null),
        'recommendedServices' => dscc_pick_str_arr($data['recommendedServices'] ?? null),
        'files' => $files,
        'tags' => dscc_pick_str_arr($data['tags'] ?? null),
        'notes' => [],
        'raw' => $data,
    ];

    // Drop null optionals (mirrors TS optional fields); keep notes + raw.
    foreach ($lead as $k => $v) {
        if ($v === null) unset($lead[$k]);
    }
    return $lead;
}

function dscc_store_append_lead($payload) {
    $lead = dscc_normalize_incoming($payload);
    dscc_leads_mutate(function (&$leads) use ($lead) {
        array_unshift($leads, $lead);
    });
    return $lead;
}
}
