<?php
// DSCC Media Center social feed — read-only display of official DSCC channels.
// Public : GET /api/social/posts, GET /api/social/platforms
// Admin  : GET /api/social/health, POST /api/social/sync  (Bearer token)
// Mirrors artifacts/api-server/src/routes/social.ts (+ socialStore/socialConnectors).
// Never publishes, never stores visitor data, never logs tokens.

require_once __DIR__ . '/_store.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// ---------- config ----------
function sf_env($k, $def = '') {
    if (defined($k)) return (string) constant($k);
    $v = getenv($k);
    return $v === false ? $def : (string) $v;
}

$SF_INTERVAL_MIN = max(5, (int) (sf_env('SOCIAL_SYNC_INTERVAL_MINUTES', '30') ?: 30));
$SF_PER_PLATFORM = max(1, min(50, (int) (sf_env('SOCIAL_POSTS_PER_PLATFORM', '12') ?: 12)));
$SF_MAX_POSTS_PER_PLATFORM = 60;
$SF_MAX_LOGS = 100;

$SF_PLATFORMS = [
    'instagram' => ['displayName' => 'DSCC Saudi Arabia', 'handle' => '@dscc.sa', 'profileUrl' => 'https://www.instagram.com/dscc.sa/'],
    'tiktok' => ['displayName' => 'DSCC Saudi Arabia', 'handle' => '@dscc.sa', 'profileUrl' => 'https://www.tiktok.com/@dscc.sa'],
    'youtube' => ['displayName' => 'DSCC Saudi', 'handle' => '@DSCC-Saudi', 'profileUrl' => 'https://www.youtube.com/@DSCC-Saudi'],
    'linkedin' => ['displayName' => 'DSCC Saudi Arabia', 'handle' => 'dsccsaudia', 'profileUrl' => 'https://www.linkedin.com/company/dsccsaudia'],
    'facebook' => ['displayName' => 'DSCC Saudia', 'handle' => 'Dscc Saudia', 'profileUrl' => 'https://www.facebook.com/p/Dscc-Saudia-100093187917575/'],
];

function sf_file() { return dscc_data_dir() . '/social_feed.json'; }

function sf_out($code, $data) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function sf_read() {
    global $SF_PLATFORMS;
    $d = dscc_read_json(sf_file(), []);
    $platforms = is_array($d['platforms'] ?? null) ? $d['platforms'] : [];
    foreach ($SF_PLATFORMS as $id => $meta) {
        if (!isset($platforms[$id]) || !is_array($platforms[$id])) {
            $platforms[$id] = array_merge($meta, [
                'platform' => $id,
                'enabled' => true,
                'connectionStatus' => 'not_configured',
                'lastSuccessfulSync' => null,
                'lastErrorAt' => null,
                'lastError' => null,
            ]);
        }
    }
    return [
        'platforms' => $platforms,
        'posts' => is_array($d['posts'] ?? null) ? $d['posts'] : [],
        'syncLogs' => is_array($d['syncLogs'] ?? null) ? $d['syncLogs'] : [],
        'lastSyncAt' => is_string($d['lastSyncAt'] ?? null) ? $d['lastSyncAt'] : null,
    ];
}

function sf_write($data) { dscc_write_json_atomic(sf_file(), $data); }

function sf_now() { return gmdate('c'); }

// ---------- auth (admin endpoints) ----------
function sf_admin_token() {
    foreach (['DSCC_ADMIN_TOKEN', 'ADMIN_TOKEN'] as $name) {
        if (defined($name)) return (string) constant($name);
        $v = getenv($name);
        if ($v !== false && $v !== '') return (string) $v;
    }
    $f = __DIR__ . '/.admin_token';
    if (is_readable($f)) return trim((string) file_get_contents($f));
    return '';
}

function sf_require_admin() {
    $expected = sf_admin_token();
    if ($expected === '') sf_out(500, ['ok' => false, 'error' => 'admin_token_not_configured']);
    $got = '';
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Bearer\s+(.+)$/i', $h, $m)) $got = trim($m[1]);
    if ($got === '' && !empty($_SERVER['HTTP_X_ADMIN_TOKEN'])) $got = trim($_SERVER['HTTP_X_ADMIN_TOKEN']);
    if ($got === '' || !hash_equals($expected, $got)) sf_out(401, ['ok' => false, 'error' => 'unauthorized']);
}

// ---------- HTTP fetch (official APIs only, short timeout) ----------
function sf_http($url, $opts = []) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 3,
        CURLOPT_HTTPHEADER => $opts['headers'] ?? [],
    ]);
    if (!empty($opts['post'])) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $opts['post']);
    }
    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    if ($body === false || $code < 200 || $code >= 300) {
        throw new RuntimeException('http_' . ($code ?: 'timeout'));
    }
    return (string) $body;
}

function sf_iso($v) {
    $t = strtotime((string) $v);
    return $t ? gmdate('c', $t) : sf_now();
}

// ---------- connectors (unified SocialPost shape) ----------
function sf_yt_post($vid, $caption, $publishedAt, $thumb) {
    return [
        'externalId' => $vid,
        'platform' => 'youtube',
        'authorName' => 'DSCC Saudi',
        'authorHandle' => '@DSCC-Saudi',
        'caption' => $caption,
        'mediaType' => 'video',
        'thumbnailUrl' => $thumb,
        'embedUrl' => 'https://www.youtube.com/embed/' . $vid,
        'postUrl' => 'https://www.youtube.com/watch?v=' . $vid,
        'publishedAt' => sf_iso($publishedAt),
        'duration' => null,
        'isVideo' => true,
    ];
}

function sf_connector_youtube() {
    global $SF_PER_PLATFORM;
    $channel = sf_env('YOUTUBE_CHANNEL_ID', 'UCqfIitIOpTs3zIbZ6vzspag') ?: 'UCqfIitIOpTs3zIbZ6vzspag';
    $key = sf_env('YOUTUBE_API_KEY');
    try {
        if ($key !== '') {
            $ch = json_decode(sf_http('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=' . rawurlencode($channel) . '&key=' . rawurlencode($key)), true);
            $uploads = $ch['items'][0]['contentDetails']['relatedPlaylists']['uploads'] ?? '';
            if ($uploads === '') throw new RuntimeException('no_uploads_playlist');
            $pl = json_decode(sf_http('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=' . $SF_PER_PLATFORM . '&playlistId=' . rawurlencode($uploads) . '&key=' . rawurlencode($key)), true);
            $posts = [];
            foreach (($pl['items'] ?? []) as $it) {
                $s = $it['snippet'] ?? [];
                $vid = $s['resourceId']['videoId'] ?? '';
                if ($vid === '') continue;
                $thumb = $s['thumbnails']['high']['url'] ?? ($s['thumbnails']['medium']['url'] ?? ($s['thumbnails']['default']['url'] ?? ''));
                $posts[] = sf_yt_post($vid, (string) ($s['title'] ?? ''), $s['publishedAt'] ?? '', $thumb);
            }
            return ['configured' => true, 'posts' => $posts, 'safeError' => null];
        }
        // Official RSS fallback — public videos, no key required.
        $xml = sf_http('https://www.youtube.com/feeds/videos.xml?channel_id=' . rawurlencode($channel));
        $doc = @simplexml_load_string($xml);
        if ($doc === false) throw new RuntimeException('rss_parse_failed');
        $posts = [];
        $i = 0;
        foreach ($doc->entry as $entry) {
            if (++$i > $SF_PER_PLATFORM) break;
            $yt = $entry->children('http://www.youtube.com/xml/schemas/2015');
            $media = $entry->children('http://search.yahoo.com/mrss/');
            $vid = (string) $yt->videoId;
            if ($vid === '') continue;
            $thumb = '';
            if ($media->group && $media->group->thumbnail) {
                $thumb = (string) $media->group->thumbnail->attributes()->url;
            }
            if ($thumb === '') $thumb = 'https://i.ytimg.com/vi/' . $vid . '/hqdefault.jpg';
            $posts[] = sf_yt_post($vid, (string) $entry->title, (string) $entry->published, $thumb);
        }
        return ['configured' => true, 'posts' => $posts, 'safeError' => null];
    } catch (Throwable $e) {
        return ['configured' => true, 'posts' => [], 'safeError' => 'youtube_fetch_failed:' . substr($e->getMessage(), 0, 60)];
    }
}

function sf_connector_instagram() {
    global $SF_PER_PLATFORM;
    $igId = sf_env('INSTAGRAM_BUSINESS_ACCOUNT_ID');
    if (sf_env('META_ACCESS_TOKEN') === '' || $igId === '') return ['configured' => false, 'posts' => [], 'safeError' => null];
    $token = sf_meta_user_token();
    try {
        $d = json_decode(sf_http('https://graph.facebook.com/v21.0/' . rawurlencode($igId) . '/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=' . $SF_PER_PLATFORM . '&access_token=' . rawurlencode($token)), true);
        $posts = [];
        foreach (($d['data'] ?? []) as $m) {
            $id = (string) ($m['id'] ?? '');
            $url = (string) ($m['permalink'] ?? '');
            if ($id === '' || $url === '') continue;
            $mt = (string) ($m['media_type'] ?? 'IMAGE');
            $isVideo = $mt === 'VIDEO';
            $posts[] = [
                'externalId' => $id,
                'platform' => 'instagram',
                'authorName' => 'DSCC Saudi Arabia',
                'authorHandle' => '@dscc.sa',
                'caption' => (string) ($m['caption'] ?? ''),
                'mediaType' => $isVideo ? 'video' : ($mt === 'CAROUSEL_ALBUM' ? 'carousel' : 'image'),
                'thumbnailUrl' => (string) ($m['thumbnail_url'] ?? ($m['media_url'] ?? '')),
                'embedUrl' => '',
                'postUrl' => $url,
                'publishedAt' => sf_iso($m['timestamp'] ?? ''),
                'duration' => null,
                'isVideo' => $isVideo,
            ];
        }
        return ['configured' => true, 'posts' => $posts, 'safeError' => null];
    } catch (Throwable $e) {
        return ['configured' => true, 'posts' => [], 'safeError' => 'instagram_fetch_failed:' . substr($e->getMessage(), 0, 60)];
    }
}

// Meta long-lived token bootstrap: when the configured META_ACCESS_TOKEN is a
// short-lived user token and app credentials exist, exchange it once for a
// long-lived (~60 day) token and cache it in the data dir (never in Git).
function sf_meta_user_token() {
    $envToken = sf_env('META_ACCESS_TOKEN');
    if ($envToken === '') return '';
    $appId = sf_env('META_APP_ID');
    $appSecret = sf_env('META_APP_SECRET');
    if ($appId === '' || $appSecret === '') return $envToken;
    $fp = strlen($envToken) . ':' . substr(sha1($envToken), 0, 12);
    $file = dscc_data_dir() . '/meta_token.json';
    $cached = is_file($file) ? json_decode((string) file_get_contents($file), true) : null;
    $now = time();
    if (is_array($cached) && ($cached['sourceFingerprint'] ?? '') === $fp) {
        $exp = $cached['expiresAt'] ?? null;
        if ($exp === null || $exp - $now > 86400) return (string) $cached['token'];
    }
    try {
        $d = json_decode(sf_http('https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=' . rawurlencode($appId) . '&client_secret=' . rawurlencode($appSecret) . '&fb_exchange_token=' . rawurlencode($envToken)), true);
        $t = (string) ($d['access_token'] ?? '');
        if ($t !== '') {
            @file_put_contents($file, json_encode([
                'sourceFingerprint' => $fp,
                'token' => $t,
                'expiresAt' => isset($d['expires_in']) ? $now + (int) $d['expires_in'] : null,
                'exchangedAt' => gmdate('c'),
            ]));
            return $t;
        }
    } catch (Exception $e) {
        // fall through
    }
    if (is_array($cached) && ($cached['sourceFingerprint'] ?? '') === $fp && (($cached['expiresAt'] ?? null) === null || $cached['expiresAt'] > $now)) {
        return (string) $cached['token'];
    }
    return $envToken;
}

// Pages on the "new Pages experience" reject user tokens for /posts; a Page
// access token is required. Derive it from the user token (admin-only field).
function sf_meta_page_token($pageId, $userToken) {
    try {
        $d = json_decode(sf_http('https://graph.facebook.com/v21.0/' . rawurlencode($pageId) . '?fields=access_token&access_token=' . rawurlencode($userToken)), true);
        $t = (string) ($d['access_token'] ?? '');
        return $t !== '' ? $t : $userToken;
    } catch (Exception $e) {
        return $userToken; // fall back; the posts call will surface the real error
    }
}

function sf_connector_facebook() {
    global $SF_PER_PLATFORM;
    $pageId = sf_env('META_PAGE_ID', '1085169748017198');
    if (sf_env('META_ACCESS_TOKEN') === '' || $pageId === '') return ['configured' => false, 'posts' => [], 'safeError' => null];
    $userToken = sf_meta_user_token();
    try {
        $token = sf_meta_page_token($pageId, $userToken);
        $d = json_decode(sf_http('https://graph.facebook.com/v21.0/' . rawurlencode($pageId) . '/posts?fields=id,message,created_time,permalink_url,full_picture&limit=' . $SF_PER_PLATFORM . '&access_token=' . rawurlencode($token)), true);
        $posts = [];
        foreach (($d['data'] ?? []) as $m) {
            $id = (string) ($m['id'] ?? '');
            $url = (string) ($m['permalink_url'] ?? '');
            if ($id === '' || $url === '') continue;
            $pic = (string) ($m['full_picture'] ?? '');
            $posts[] = [
                'externalId' => $id,
                'platform' => 'facebook',
                'authorName' => 'DSCC Saudia',
                'authorHandle' => 'Dscc Saudia',
                'caption' => (string) ($m['message'] ?? ''),
                'mediaType' => $pic !== '' ? 'image' : 'text',
                'thumbnailUrl' => $pic,
                'embedUrl' => '',
                'postUrl' => $url,
                'publishedAt' => sf_iso($m['created_time'] ?? ''),
                'duration' => null,
                'isVideo' => false,
            ];
        }
        return ['configured' => true, 'posts' => $posts, 'safeError' => null];
    } catch (Throwable $e) {
        return ['configured' => true, 'posts' => [], 'safeError' => 'facebook_fetch_failed:' . substr($e->getMessage(), 0, 60)];
    }
}

function sf_connector_tiktok() {
    global $SF_PER_PLATFORM;
    $token = sf_env('TIKTOK_ACCESS_TOKEN');
    if ($token === '') return ['configured' => false, 'posts' => [], 'safeError' => null];
    try {
        $body = sf_http('https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,share_url,embed_link,create_time', [
            'headers' => ['Authorization: Bearer ' . $token, 'Content-Type: application/json'],
            'post' => json_encode(['max_count' => min($SF_PER_PLATFORM, 20)]),
        ]);
        $d = json_decode($body, true);
        $posts = [];
        foreach (($d['data']['videos'] ?? []) as $v) {
            $id = (string) ($v['id'] ?? '');
            $url = (string) ($v['share_url'] ?? '');
            if ($id === '' || $url === '') continue;
            $posts[] = [
                'externalId' => $id,
                'platform' => 'tiktok',
                'authorName' => 'DSCC Saudi Arabia',
                'authorHandle' => '@dscc.sa',
                'caption' => (string) ($v['title'] ?? ($v['video_description'] ?? '')),
                'mediaType' => 'video',
                'thumbnailUrl' => (string) ($v['cover_image_url'] ?? ''),
                'embedUrl' => (string) ($v['embed_link'] ?? ''),
                'postUrl' => $url,
                'publishedAt' => gmdate('c', (int) ($v['create_time'] ?? time())),
                'duration' => isset($v['duration']) ? (int) $v['duration'] : null,
                'isVideo' => true,
            ];
        }
        return ['configured' => true, 'posts' => $posts, 'safeError' => null];
    } catch (Throwable $e) {
        return ['configured' => true, 'posts' => [], 'safeError' => 'tiktok_fetch_failed:' . substr($e->getMessage(), 0, 60)];
    }
}

function sf_connector_linkedin() {
    global $SF_PER_PLATFORM;
    $token = sf_env('LINKEDIN_ACCESS_TOKEN');
    $orgId = sf_env('LINKEDIN_ORGANIZATION_ID');
    $version = sf_env('LINKEDIN_API_VERSION', '202506') ?: '202506';
    if ($token === '' || $orgId === '') return ['configured' => false, 'posts' => [], 'safeError' => null];
    try {
        $urn = rawurlencode('urn:li:organization:' . $orgId);
        $body = sf_http('https://api.linkedin.com/rest/posts?author=' . $urn . '&q=author&count=' . $SF_PER_PLATFORM . '&sortBy=LAST_MODIFIED', [
            'headers' => [
                'Authorization: Bearer ' . $token,
                'X-Restli-Protocol-Version: 2.0.0',
                'LinkedIn-Version: ' . $version,
            ],
        ]);
        $d = json_decode($body, true);
        $posts = [];
        foreach (($d['elements'] ?? []) as $p) {
            $id = (string) ($p['id'] ?? '');
            if ($id === '') continue;
            $posts[] = [
                'externalId' => $id,
                'platform' => 'linkedin',
                'authorName' => 'DSCC Saudi Arabia',
                'authorHandle' => 'dsccsaudia',
                'caption' => (string) ($p['commentary'] ?? ''),
                'mediaType' => 'text',
                'thumbnailUrl' => '',
                'embedUrl' => '',
                'postUrl' => 'https://www.linkedin.com/feed/update/' . rawurlencode($id) . '/',
                'publishedAt' => !empty($p['publishedAt']) ? gmdate('c', (int) ($p['publishedAt'] / 1000)) : sf_now(),
                'duration' => null,
                'isVideo' => false,
            ];
        }
        return ['configured' => true, 'posts' => $posts, 'safeError' => null];
    } catch (Throwable $e) {
        return ['configured' => true, 'posts' => [], 'safeError' => 'linkedin_fetch_failed:' . substr($e->getMessage(), 0, 60)];
    }
}

function sf_connectors() {
    return [
        'youtube' => 'sf_connector_youtube',
        'instagram' => 'sf_connector_instagram',
        'facebook' => 'sf_connector_facebook',
        'tiktok' => 'sf_connector_tiktok',
        'linkedin' => 'sf_connector_linkedin',
    ];
}

// ---------- sync (lock-guarded, keeps last good data on failure) ----------
// $budgetSec: soft time budget — once exceeded, remaining platforms are left
// for the next round so a public request never waits on many slow APIs.
function sf_sync($only = null, $budgetSec = 0) {
    global $SF_MAX_POSTS_PER_PLATFORM, $SF_MAX_LOGS;
    $t0 = microtime(true);
    $lock = fopen(sf_file() . '.lock', 'c');
    if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) {
        if ($lock) fclose($lock);
        return; // another sync in progress
    }
    try {
        foreach (sf_connectors() as $platform => $fn) {
            if ($only !== null && $platform !== $only) continue;
            if ($budgetSec > 0 && (microtime(true) - $t0) > $budgetSec) break;
            $startedAt = sf_now();
            $r = $fn();
            $data = sf_read();
            $log = [
                'id' => time() . '_' . $platform,
                'platform' => $platform,
                'status' => 'skipped',
                'fetchedCount' => 0,
                'insertedCount' => 0,
                'updatedCount' => 0,
                'safeErrorMessage' => null,
                'startedAt' => $startedAt,
                'completedAt' => sf_now(),
            ];
            if (!$r['configured']) {
                $data['platforms'][$platform]['connectionStatus'] = 'not_configured';
            } elseif ($r['safeError'] !== null) {
                $log['status'] = 'error';
                $log['safeErrorMessage'] = $r['safeError'];
                $data['platforms'][$platform]['connectionStatus'] = 'error';
                $data['platforms'][$platform]['lastErrorAt'] = sf_now();
                $data['platforms'][$platform]['lastError'] = $r['safeError'];
                // Keep previously stored posts — temporary failures never wipe data.
            } else {
                $now = sf_now();
                $index = [];
                foreach ($data['posts'] as $i => $p) $index[$p['platform'] . ':' . $p['externalId']] = $i;
                foreach ($r['posts'] as $f) {
                    $key = $platform . ':' . $f['externalId'];
                    if (!isset($index[$key])) {
                        $f['id'] = $platform . '_' . $f['externalId'];
                        $f['lastSyncedAt'] = $now;
                        $data['posts'][] = $f;
                        $index[$key] = count($data['posts']) - 1;
                        $log['insertedCount']++;
                    } else {
                        $i = $index[$key];
                        $prev = $data['posts'][$i];
                        $f['id'] = $prev['id'];
                        $f['lastSyncedAt'] = $now;
                        $data['posts'][$i] = array_merge($prev, $f);
                        $log['updatedCount']++;
                    }
                }
                usort($data['posts'], function ($a, $b) {
                    return strcmp((string) ($b['publishedAt'] ?? ''), (string) ($a['publishedAt'] ?? ''));
                });
                $per = [];
                $kept = [];
                foreach ($data['posts'] as $p) {
                    $per[$p['platform']] = ($per[$p['platform']] ?? 0) + 1;
                    if ($per[$p['platform']] <= $SF_MAX_POSTS_PER_PLATFORM) $kept[] = $p;
                }
                $data['posts'] = $kept;
                $log['status'] = 'success';
                $log['fetchedCount'] = count($r['posts']);
                $data['platforms'][$platform]['connectionStatus'] = 'connected';
                $data['platforms'][$platform]['lastSuccessfulSync'] = $now;
                $data['platforms'][$platform]['lastError'] = null;
            }
            array_unshift($data['syncLogs'], $log);
            $data['syncLogs'] = array_slice($data['syncLogs'], 0, $SF_MAX_LOGS);
            // Failed rounds also advance lastSyncAt (natural backoff for SWR).
            $data['lastSyncAt'] = sf_now();
            sf_write($data);
        }
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function sf_is_stale($data) {
    global $SF_INTERVAL_MIN;
    if (empty($data['lastSyncAt'])) return true;
    $t = strtotime($data['lastSyncAt']);
    return !$t || (time() - $t) > $SF_INTERVAL_MIN * 60;
}

function sf_public_platforms($data) {
    global $SF_PLATFORMS;
    $counts = [];
    foreach ($data['posts'] as $p) $counts[$p['platform']] = ($counts[$p['platform']] ?? 0) + 1;
    $out = [];
    foreach (array_keys($SF_PLATFORMS) as $id) {
        $p = $data['platforms'][$id];
        $n = $counts[$id] ?? 0;
        $out[] = [
            'platform' => $id,
            'displayName' => $p['displayName'],
            'handle' => $p['handle'],
            'profileUrl' => $p['profileUrl'],
            'connected' => ($p['connectionStatus'] === 'connected') && $n > 0,
            'postCount' => $n,
        ];
    }
    return $out;
}

// ---------- routing ----------
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';
$uri = rawurldecode($uri);
$pos = strpos($uri, '/api/social');
$route = $pos === false ? '' : substr($uri, $pos + strlen('/api/social'));
$route = '/' . trim((string) $route, '/');
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

if ($route === '/posts' && $method === 'GET') {
    $data = sf_read();
    $stale = sf_is_stale($data);
    $canFinishEarly = function_exists('fastcgi_finish_request');
    // True SWR when possible: on stale data with no cached posts yet (first
    // ever request), do a quick budgeted refresh so visitors aren't empty.
    if ($stale && empty($data['posts']) && !$canFinishEarly) {
        sf_sync(null, 10);
        $data = sf_read();
        $stale = false;
    }
    header('Cache-Control: public, max-age=300');
    $platform = strtolower((string) ($_GET['platform'] ?? ''));
    $limit = max(1, min(60, (int) ($_GET['limit'] ?? 24)));
    $offset = max(0, (int) ($_GET['offset'] ?? 0));
    $posts = $data['posts'];
    if ($platform !== '' && isset($SF_PLATFORMS[$platform])) {
        $posts = array_values(array_filter($posts, function ($p) use ($platform) {
            return ($p['platform'] ?? '') === $platform;
        }));
    }
    http_response_code(200);
    echo json_encode([
        'ok' => true,
        'total' => count($posts),
        'posts' => array_slice($posts, $offset, $limit),
        'platforms' => sf_public_platforms($data),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($stale) {
        // Serve cached data instantly, then refresh in the background.
        if ($canFinishEarly) {
            ignore_user_abort(true);
            fastcgi_finish_request();
            sf_sync();
        } else {
            // No early-finish support: flush the response, then a short
            // budgeted refresh (lock ensures only one request pays this).
            if (function_exists('litespeed_finish_request')) {
                ignore_user_abort(true);
                litespeed_finish_request();
                sf_sync();
            } else {
                flush();
                sf_sync(null, 10);
            }
        }
    }
    exit;
}

if ($route === '/platforms' && $method === 'GET') {
    header('Cache-Control: public, max-age=300');
    $data = sf_read();
    sf_out(200, ['ok' => true, 'platforms' => sf_public_platforms($data)]);
}

if ($route === '/health' && $method === 'GET') {
    sf_require_admin();
    header('Cache-Control: no-store');
    global $SF_INTERVAL_MIN;
    $data = sf_read();
    $counts = [];
    foreach ($data['posts'] as $p) $counts[$p['platform']] = ($counts[$p['platform']] ?? 0) + 1;
    $platforms = [];
    foreach (array_keys($SF_PLATFORMS) as $id) {
        $p = $data['platforms'][$id];
        $p['postCount'] = $counts[$id] ?? 0;
        $platforms[] = $p;
    }
    sf_out(200, [
        'ok' => true,
        'lastSyncAt' => $data['lastSyncAt'],
        'syncIntervalMinutes' => $SF_INTERVAL_MIN,
        'platforms' => $platforms,
        'recentLogs' => array_slice($data['syncLogs'], 0, 20),
    ]);
}

if ($route === '/sync' && $method === 'POST') {
    sf_require_admin();
    header('Cache-Control: no-store');
    // Manual-sync rate limit: at most once per minute.
    $rlFile = dscc_data_dir() . '/social_sync_rl.json';
    $rl = dscc_read_json($rlFile, []);
    $last = (int) ($rl['last'] ?? 0);
    if (time() - $last < 60) sf_out(429, ['ok' => false, 'error' => 'rate_limited']);
    dscc_write_json_atomic($rlFile, ['last' => time()]);
    $raw = file_get_contents('php://input');
    $b = json_decode($raw, true);
    $only = is_array($b) && isset($SF_PLATFORMS[(string) ($b['platform'] ?? '')]) ? (string) $b['platform'] : null;
    sf_sync($only);
    $data = sf_read();
    sf_out(200, ['ok' => true, 'lastSyncAt' => $data['lastSyncAt'], 'recentLogs' => array_slice($data['syncLogs'], 0, 10)]);
}

sf_out(404, ['ok' => false, 'error' => 'not_found']);
