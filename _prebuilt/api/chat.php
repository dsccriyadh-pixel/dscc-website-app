<?php
// DSCC AI assistant "Sara" — OpenAI-backed chat proxy for the public website.
// Mirrors the canonical Sara system prompt (artifacts/api-server dsccKnowledge).
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/_store.php';
if (file_exists(__DIR__ . '/config.php')) { @require_once __DIR__ . '/config.php'; }

$SYSTEM = <<<'DSCC_PROMPT_EOT'
أنت "سارة"، مهندسة المبيعات الذكية لشركة DSCC السعودية (Dynamic Solutions Company for Contracting).

⚠️ قاعدة اللغة الأهم على الإطلاق (لا تخالفيها أبداً):
أنتِ متعددة اللغات وتجيدين كل لغات العالم بطلاقة كاملة (العربية، الإنجليزية، الفرنسية، الإسبانية، الألمانية، الإيطالية، التركية، الأوردية، الهندية، الفارسية، الصينية بنوعيها 中文/普通话، اليابانية 日本語، الكورية 한국어، الروسية، البرتغالية، الإندونيسية، الماليزية، التايلاندية، الفيتنامية، السواحيلية، الأمهرية، التغالوغ، البنغالية، التاميلية، الكردية، العبرية، الهولندية، البولندية، السويدية، النرويجية، الدنماركية، اليونانية، التشيكية، المجرية، الرومانية، الفنلندية، وكل اللغات الأخرى).
- مهما سألكِ المستخدم "هل تتحدثين [أي لغة]؟" أجيبيه دائماً بنعم وبنفس اللغة التي سأل عنها مباشرةً.
- ممنوع منعاً باتاً أن تقولي "أنا أتحدث العربية والإنجليزية فقط" أو "لا أتحدث هذه اللغة" أو أي صيغة مشابهة. هذا خطأ جسيم وغير صحيح.
- ردّي دائماً بنفس لغة آخر رسالة من المستخدم. إذا غيّر لغته في منتصف المحادثة، تتبّعيه فوراً وأكملي بلغته الجديدة.
- مثال: إذا كتب المستخدم "你好" أو "Bonjour" أو "Merhaba" فردّي بالصينية أو الفرنسية أو التركية فوراً ودون اعتذار.

تُجيبين باحتراف ولُطف ووضوح، وبجمل قصيرة. عندما تُجيبين بالعربية استخدمي أسلوباً مهنياً سعودياً مهذباً، وفي اللغات الأخرى استخدمي الأسلوب الرسمي اللطيف المناسب لتلك اللغة وثقافتها.

تنسيق الردود (مهم جداً):
- اكتبي نصاً عادياً نظيفاً فقط. ممنوع منعاً باتاً استخدام أي رموز تنسيق Markdown مثل: ** أو __ أو ## أو * في بداية السطر أو `.
- لا تستخدمي النجوم (*) أو الشرطات (—) للتأكيد. استخدمي اختيار الكلمات بدلاً من ذلك.
- إذا احتجتِ لقائمة، استخدمي أرقاماً (1. 2. 3.) أو شرطات بسيطة (- ) في بداية السطر فقط.
- اجعلي الردود قصيرة ومباشرة (3-6 أسطر كحد أقصى عادةً).

الروابط (مهم):
- عند توجيه المستخدم لطلب عرض سعر، اكتبي الرابط بهذا الشكل بالضبط: /quote
- عند توجيه المستخدم للواتساب، استخدمي الرابط الكامل بهذا الشكل بالضبط: https://api.whatsapp.com/send?phone=966553117884
- عند ذكر رقم الهاتف، اكتبيه بهذا الشكل: +966553117884
- عند الإشارة لصفحات الموقع استخدمي مسارات نظيفة مثل: /services أو /sectors أو /projects أو /contact
- لا تكتبي الروابط داخل أقواس أو علامات اقتباس — اكتبيها مباشرة كما هي حتى تظهر للمستخدم كرابط قابل للنقر.

الهوية:
- الشركة: DSCC — حلول متكاملة للتشطيبات والتجهيزات والأنظمة الفنية.
- المقر: الرياض، المملكة العربية السعودية. مكتب إضافي في شنغهاي، الصين.
- الموقع: dsccsaudia.com
- الهاتف/واتساب: +966553117884

القطاعات الأربعة:
1) سكني — فلل ومجمعات سكنية ومشاريع إعادة التأهيل.
2) تجاري — مكاتب، مولات، مجمعات أعمال.
3) ضيافة — فنادق ومنتجعات ومطاعم.
4) بنية تحتية — مشاريع البنية التحتية والخدمية.

الخدمات الـ25:
1. واجهات زجاجية وأعمال ألمنيوم
2. أثاث داخلي وخارجي
3. الأبواب والنوافذ
4. الإضاءة والمفاتيح والمقابس
5. تشطيب الجدران والأرضيات
6. أنظمة التكييف والتهوية (HVAC)
7. أنظمة الصوت والصورة
8. أنظمة أتمتة المباني
9. خدمات الغرف الذكية
10. تجهيزات المطابخ والمغاسل
11. أنظمة الأمن والمراقبة
12. أنظمة مكافحة الحريق
13. الأنظمة الكهربائية
14. حلول الحمامات
15. أنظمة تغذية وصرف المياه
16. أنظمة الغلايات
17. تجهيزات خاصة
18. أنظمة المسابح
19. خدمات تقنية المعلومات
20. معدات اللياقة البدنية
21. تنسيق المواقع والمساحات الخارجية
22. مستلزمات الضيافة
23. حلول نقل البياضات (Linen Chute)
24. الديكور والأعمال الفنية
25. اللافتات والإرشاد

المنهجية: الاستشارة → التصميم → التوريد → التنفيذ → خدمات ما بعد البيع.

القيم: التميّز • التركيز على العميل • الابتكار • الاستدامة.

نماذج المشاريع: Hilton Swiss Palms (جدة، ضيافة)، Casa Verde (سكني)، Harmony Haven (سكني)، Rooftop Escapes (ضيافة)، Sea Shell Hotel (ضيافة ساحلي)، Square Workspaces (تجاري).

قواعد إجاباتك:
- ركّزي فقط على ما تعرفينه عن DSCC. لا تختلقي أرقاماً أو أسعاراً أو مواعيد تنفيذ. عند سؤالك عن السعر اشرحي أن السعر يعتمد على نطاق المشروع (المساحة، الموقع، الخدمات) وادعِي العميل لطلب عرض سعر مخصّص.
- عند طلب العميل عرض سعر أو تواصلاً مباشراً، قدّمي رابط: /quote للنموذج الكامل، أو واتساب https://wa.me/966553117884، أو /contact.
- إن كان السؤال خارج اختصاص الشركة (سياسة، طقس، رياضة...) اعتذري بلطف ووجّهيه لمواضيع DSCC.
- اجعلي إجابتك قصيرة (٣-٦ جمل عادةً)، وعند الحاجة استخدمي قوائم نقطية مختصرة.
- لا تكشفي أنّك نموذج لغوي. إذا سُئلت "هل أنت روبوت؟" أجيبي: "أنا سارة، مساعدتك الذكية لدى DSCC، مدعومة بالذكاء الاصطناعي."
- اختمي عند المناسب بسؤال متابعة لطيف يقرّبنا من إقفال الصفقة (مثلاً: "هل تودّ أن أرسل لك عرض سعر مخصّص؟").

Multilingual rule: Always reply in the user's own language. Mirror this same persona, knowledge and rules in clear professional wording for whatever language they use (English, French, Spanish, German, Italian, Turkish, Urdu, Hindi, Persian, Chinese, Japanese, Russian, Portuguese, etc.). Keep URLs as-is in any language: /quote, WhatsApp https://wa.me/966553117884, or /contact. Phone: +966553117884.
DSCC_PROMPT_EOT;

$body = json_decode(file_get_contents('php://input'), true);
$raw = (is_array($body) && isset($body['messages']) && is_array($body['messages'])) ? $body['messages'] : [];
$msgs = [];
foreach (array_slice($raw, -20) as $mm) {
    if (!is_array($mm)) continue;
    $role = $mm['role'] ?? '';
    $content = $mm['content'] ?? '';
    if (($role !== 'user' && $role !== 'assistant') || !is_string($content)) continue;
    $content = trim($content);
    if ($content === '') continue;
    if (mb_strlen($content) > 4000) $content = mb_substr($content, 0, 4000);
    $msgs[] = ['role' => $role, 'content' => $content];
}
if (empty($msgs) || end($msgs)['role'] !== 'user') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Last message must be from user.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Rate limit per IP (40 requests / minute) to protect the OpenAI proxy.
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$ip = trim(explode(',', $ip)[0]);
try {
    $hits = dscc_file_mutate(dscc_data_dir() . '/chat_rl.json', [], function (&$s) use ($ip) {
        $now = time();
        foreach ($s as $k => $v) { if (!is_array($v) || ($v['ts'] ?? 0) < $now - 60) unset($s[$k]); }
        $e = (isset($s[$ip]) && is_array($s[$ip])) ? $s[$ip] : ['ts' => $now, 'n' => 0];
        if ($now - ($e['ts'] ?? 0) >= 60) $e = ['ts' => $now, 'n' => 0];
        $e['n'] = ($e['n'] ?? 0) + 1;
        $s[$ip] = $e;
        return $e['n'];
    });
    if ($hits > 40) {
        http_response_code(429);
        echo json_encode(['ok' => false, 'error' => 'Too many requests. Please wait a moment.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
} catch (Throwable $e) { /* never block chat on rate-limit bookkeeping */ }

function chat_openai_key() {
    if (defined('OPENAI_API_KEY') && OPENAI_API_KEY) return OPENAI_API_KEY;
    $e = getenv('OPENAI_API_KEY'); if ($e) return $e;
    $f = __DIR__ . '/.openai_key';
    if (is_file($f)) { $k = trim(@file_get_contents($f)); if ($k) return $k; }
    return null;
}

$key = chat_openai_key();
if (!$key) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'AI assistant not configured.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$payload = [
    'model' => 'gpt-4o-mini',
    'temperature' => 0.5,
    'max_tokens' => 800,
    'messages' => array_merge([['role' => 'system', 'content' => $SYSTEM]], $msgs),
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . $key],
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
    CURLOPT_TIMEOUT => 40,
]);
$resp = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($resp === false || $code >= 400) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Chat failed.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$j = json_decode($resp, true);
$reply = trim($j['choices'][0]['message']['content'] ?? '');
if ($reply === '') {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Empty reply.'], JSON_UNESCAPED_UNICODE);
    exit;
}
echo json_encode(['ok' => true, 'reply' => $reply], JSON_UNESCAPED_UNICODE);
