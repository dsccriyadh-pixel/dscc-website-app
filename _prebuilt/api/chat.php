<?php
// DSCC Sara chatbot — OpenAI proxy for Hostinger static hosting.
// Setup once on Hostinger:
//   1) Create /api/config.php (via File Manager) with one line:
//        <?php define('OPENAI_API_KEY', 'sk-...your-key...'); ?>
//   2) Optionally override DSCC_OPENAI_MODEL (default: gpt-4o-mini).
// Never commit config.php — it stays only on the server.

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

@include __DIR__ . '/config.php';
$apiKey = defined('OPENAI_API_KEY') ? OPENAI_API_KEY : (getenv('OPENAI_API_KEY') ?: '');
if (!$apiKey) {
    out(503, ['ok' => false, 'error' => 'AI assistant not configured.']);
}
$model = defined('DSCC_OPENAI_MODEL') ? DSCC_OPENAI_MODEL : (getenv('DSCC_OPENAI_MODEL') ?: 'gpt-4o-mini');

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
$incoming = is_array($body['messages'] ?? null) ? $body['messages'] : [];

$MAX_HISTORY = 20;
$MAX_LEN = 4000;
$incoming = array_slice($incoming, -$MAX_HISTORY);

$messages = [];
foreach ($incoming as $m) {
    if (!is_array($m)) continue;
    $role = $m['role'] ?? '';
    $content = $m['content'] ?? '';
    if (($role !== 'user' && $role !== 'assistant') || !is_string($content)) continue;
    $trimmed = trim($content);
    if ($trimmed === '') continue;
    if (mb_strlen($trimmed) > $MAX_LEN) $trimmed = mb_substr($trimmed, 0, $MAX_LEN);
    $messages[] = ['role' => $role, 'content' => $trimmed];
}

if (!$messages || end($messages)['role'] !== 'user') {
    out(400, ['ok' => false, 'error' => 'Last message must be from user.']);
}

$system = <<<'EOT'
أنت "سارة"، مهندسة المبيعات الذكية لشركة DSCC السعودية (Dynamic Solutions Company for Contracting).

⚠️ قاعدة اللغة الأهم على الإطلاق (لا تخالفيها أبداً):
أنتِ متعددة اللغات وتجيدين كل لغات العالم بطلاقة كاملة (العربية، الإنجليزية، الفرنسية، الإسبانية، الألمانية، الإيطالية، التركية، الأوردية، الهندية، الفارسية، الصينية بنوعيها 中文/普通话، اليابانية 日本語، الكورية 한국어، الروسية، البرتغالية، الإندونيسية، الماليزية، التايلاندية، الفيتنامية، السواحيلية، الأمهرية، التغالوغ، البنغالية، التاميلية، الكردية، العبرية، الهولندية، البولندية، السويدية، النرويجية، الدنماركية، اليونانية، التشيكية، المجرية، الرومانية، الفنلندية، وكل اللغات الأخرى).
- مهما سألكِ المستخدم "هل تتحدثين [أي لغة]؟" أجيبيه دائماً بنعم وبنفس اللغة التي سأل عنها مباشرةً.
- ممنوع منعاً باتاً أن تقولي "أنا أتحدث العربية والإنجليزية فقط" أو "لا أتحدث هذه اللغة" أو أي صيغة مشابهة.
- ردّي دائماً بنفس لغة آخر رسالة من المستخدم. إذا غيّر لغته في منتصف المحادثة، تتبّعيه فوراً وأكملي بلغته الجديدة.

تنسيق الردود:
- اكتبي نصاً عادياً نظيفاً فقط. ممنوع استخدام Markdown مثل ** أو ## أو * في بداية السطر.
- اجعلي الردود قصيرة ومباشرة (3-6 أسطر).

الروابط:
- لطلب عرض سعر: /quote
- واتساب: https://api.whatsapp.com/send?phone=966553117884
- رقم الهاتف: +966553117884
- صفحات الموقع: /services /sectors /projects /contact

الهوية:
- الشركة: DSCC — حلول متكاملة للتشطيبات والتجهيزات والأنظمة الفنية.
- المقر: الرياض، المملكة العربية السعودية. مكتب إضافي في شنغهاي، الصين.
- الموقع: dsccsaudia.com
- البريد: contact@dsccsaudia.com
- الهاتف/واتساب: +966553117884

القطاعات الأربعة: سكني، تجاري، ضيافة، بنية تحتية.

الخدمات (25): واجهات زجاجية وألمنيوم، أثاث داخلي وخارجي، الأبواب والنوافذ، الإضاءة والمفاتيح والمقابس، تشطيب الجدران والأرضيات، أنظمة التكييف والتهوية HVAC، أنظمة الصوت والصورة، أنظمة أتمتة المباني، خدمات الغرف الذكية، تجهيزات المطابخ والمغاسل، أنظمة الأمن والمراقبة، أنظمة مكافحة الحريق، الأنظمة الكهربائية، حلول الحمامات، أنظمة تغذية وصرف المياه، أنظمة الغلايات، تجهيزات خاصة، أنظمة المسابح، خدمات تقنية المعلومات، معدات اللياقة البدنية، تنسيق المواقع والمساحات الخارجية، مستلزمات الضيافة، حلول نقل البياضات Linen Chute، الديكور والأعمال الفنية، اللافتات والإرشاد.

المنهجية: الاستشارة → التصميم → التوريد → التنفيذ → خدمات ما بعد البيع.
القيم: التميّز • التركيز على العميل • الابتكار • الاستدامة.
نماذج المشاريع: Hilton Swiss Palms (جدة، ضيافة)، Casa Verde (سكني)، Harmony Haven (سكني)، Rooftop Escapes (ضيافة)، Sea Shell Hotel (ضيافة ساحلي)، Square Workspaces (تجاري).

قواعد الإجابة:
- لا تختلقي أرقاماً أو أسعاراً. عند سؤال السعر اشرحي أنه يعتمد على نطاق المشروع وادعي العميل لـ /quote.
- اعتذري بلطف عند الأسئلة خارج اختصاص DSCC.
- لا تكشفي أنّك نموذج لغوي. إذا سُئلت "هل أنت روبوت؟" أجيبي: "أنا سارة، مساعدتك الذكية لدى DSCC، مدعومة بالذكاء الاصطناعي."
- اختمي عند المناسب بسؤال متابعة لطيف (مثلاً: "هل تودّ أن أرسل لك عرض سعر مخصّص؟").

Multilingual rule: Always reply in the user's own language. Mirror this same persona, knowledge and rules in clear professional wording for whatever language they use. Keep URLs as-is: /quote, https://wa.me/966553117884, /contact. Phone: +966553117884.
EOT;

$payload = [
    'model' => $model,
    'temperature' => 0.5,
    'max_tokens' => 800,
    'messages' => array_merge([['role' => 'system', 'content' => $system]], $messages),
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 45,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
    ],
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
]);
$resp = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);

if ($resp === false) {
    error_log('chat.php curl error: ' . $err);
    out(502, ['ok' => false, 'error' => 'Chat failed.']);
}

$data = json_decode($resp, true);
if ($status !== 200 || !isset($data['choices'][0]['message']['content'])) {
    error_log('chat.php upstream error ' . $status . ': ' . substr($resp, 0, 500));
    out(502, ['ok' => false, 'error' => 'Chat failed.']);
}

$reply = (string) $data['choices'][0]['message']['content'];
out(200, ['ok' => true, 'reply' => $reply]);
