import { useLanguage, useBilingual } from "@/i18n/LanguageProvider";
import { Seo, breadcrumbJsonLd } from "@/components/seo/Seo";
import { PHONE_LTR } from "@/lib/contact";
import type { BilingualString } from "@/data/services";

interface Section {
  title: BilingualString;
  body: BilingualString;
}

const SECTIONS: Section[] = [
  {
    title: { en: "1. Who we are", ar: "1. من نحن" },
    body: {
      en: "DSCC (Developed Solutions Company for Contracting) is a Saudi contractor with its head office at Building 7878, Eastern Ring Road (Extension), Al Manakh District, Riyadh 14314, Kingdom of Saudi Arabia. References in this policy to 'we', 'us', or 'DSCC' mean this entity.",
      ar: "DSCC (شركة الحلول المطورة للمقاولات) شركة مقاولات سعودية يقع مقرّها الرئيسي في مبنى 7878، الدائري الشرقي (الامتداد)، حي المنخ، الرياض 14314، المملكة العربية السعودية. الإشارات في هذه السياسة إلى \"نحن\" أو \"DSCC\" تعني هذه الجهة.",
    },
  },
  {
    title: { en: "2. What data we collect", ar: "2. ما البيانات التي نجمعها" },
    body: {
      en: "When you contact us through our website forms, chatbot, WhatsApp, phone, or email, we collect: your name, phone number, email address, project location and scope description, and any attachments or photos you share. We also collect basic technical data (browser type, IP address, pages viewed) for security and analytics. We do not knowingly collect data from anyone under 18.",
      ar: "عندما تتواصل معنا عبر نماذج موقعنا أو الشات بوت أو واتساب أو الهاتف أو البريد الإلكتروني، نجمع: اسمك، رقم هاتفك، بريدك الإلكتروني، موقع المشروع ووصف نطاقه، وأي مرفقات أو صور تشاركها. كذلك نجمع بيانات تقنية أساسية (نوع المتصفح، عنوان IP، الصفحات المُشاهدة) للأمان والتحليلات. لا نجمع عمداً بيانات من أي شخص دون 18 عاماً.",
    },
  },
  {
    title: { en: "3. Why we use it", ar: "3. لماذا نستخدمها" },
    body: {
      en: "We use your data to: (a) respond to your enquiry and prepare a quotation; (b) execute and warranty-service any contract you sign with us; (c) send service-related notifications (project updates, warranty reminders); (d) improve our website, services, and customer experience; (e) comply with Saudi legal and regulatory obligations.",
      ar: "نستخدم بياناتك لـ: (أ) الرد على استفسارك وإعداد عرض السعر؛ (ب) تنفيذ وضمان أي عقد توقّعه معنا؛ (ج) إرسال إشعارات متعلقة بالخدمة (تحديثات المشروع، تذكيرات الضمان)؛ (د) تحسين موقعنا وخدماتنا وتجربة العميل؛ (هـ) الامتثال للالتزامات القانونية والتنظيمية السعودية.",
    },
  },
  {
    title: { en: "4. Who we share it with", ar: "4. مع من نشاركها" },
    body: {
      en: "We do not sell your personal data. We share it only with: (a) our internal project, engineering, and accounting teams; (b) subcontractors and suppliers strictly to execute your project; (c) Saudi authorities (Civil Defense, municipalities) where legally required; (d) cloud, email, and analytics service providers under data-processing agreements. All third parties are bound to use your data only for the stated purpose.",
      ar: "لا نبيع بياناتك الشخصية. نشاركها فقط مع: (أ) فرقنا الداخلية للمشاريع والهندسة والمحاسبة؛ (ب) مقاولي الباطن والموردين بهدف تنفيذ مشروعك حصراً؛ (ج) الجهات السعودية (الدفاع المدني، البلديات) حيث يلزم قانونياً؛ (د) مزوّدي الخدمات السحابية والبريد الإلكتروني والتحليلات وفق اتفاقيات معالجة بيانات. كل الأطراف الثالثة ملزمة باستخدام بياناتك للغرض المحدّد فقط.",
    },
  },
  {
    title: { en: "5. How long we keep it", ar: "5. كم نحتفظ بها" },
    body: {
      en: "Enquiries that do not convert into projects are retained for up to 24 months. Active client records are retained for the duration of the project plus 10 years (as required for warranty, accounting, and Saudi tax records). Technical/analytics data is anonymized or deleted after 26 months.",
      ar: "الاستفسارات التي لا تتحوّل إلى مشاريع تُحفظ حتى 24 شهراً. سجلات العملاء النشطين تُحفظ طوال مدة المشروع زائد 10 سنوات (حسب متطلبات الضمان والمحاسبة والسجلات الضريبية السعودية). البيانات التقنية/التحليلية تُجهَّل أو تُحذف بعد 26 شهراً.",
    },
  },
  {
    title: { en: "6. Your rights (PDPL)", ar: "6. حقوقك (نظام حماية البيانات الشخصية)" },
    body: {
      en: "Under Saudi Arabia's Personal Data Protection Law (PDPL), you have the right to: access your data, correct inaccuracies, request deletion (subject to legal retention limits), withdraw consent for marketing, and file a complaint with the Saudi Data & AI Authority (SDAIA). To exercise any right, email contact@dsccsaudia.com and we will respond within 30 days.",
      ar: "وفقاً لنظام حماية البيانات الشخصية السعودي (PDPL)، يحق لك: الوصول إلى بياناتك، تصحيح الأخطاء، طلب الحذف (ضمن حدود الاحتفاظ القانونية)، سحب الموافقة على التسويق، وتقديم شكوى للهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا). لممارسة أي حق، راسلنا على contact@dsccsaudia.com وسنرد خلال 30 يوماً.",
    },
  },
  {
    title: { en: "7. Cookies & analytics", ar: "7. الكوكيز والتحليلات" },
    body: {
      en: "Our website uses essential cookies for session management and language preference (stored locally on your device), and analytics cookies to understand traffic patterns. You can disable non-essential cookies through your browser settings without losing core site functionality.",
      ar: "يستخدم موقعنا كوكيز أساسية لإدارة الجلسة وتفضيل اللغة (مخزّنة محلياً على جهازك)، وكوكيز تحليلات لفهم أنماط الزيارات. يمكنك تعطيل الكوكيز غير الأساسية من إعدادات متصفحك دون فقدان الوظائف الأساسية للموقع.",
    },
  },
  {
    title: { en: "8. Meta advertising and server-side measurement", ar: "8. إعلانات Meta والقياس من جهة الخادم" },
    body: {
      en: "Only when you grant all advertising choices (ad_storage, ad_user_data, and ad_personalization) do we load the Meta Pixel (ID 2767855866945056). It measures page views, content interest, contact actions, quote starts, and accepted enquiries. Where a server-side Conversions API event is used, the browser and server share a random event ID to prevent duplicates. Any contact matching data sent for advertising is normalized and protected with one-way SHA-256 hashing before transmission; we do not place names, phone numbers, or email addresses in browser event parameters. You can withdraw advertising consent at any time through Privacy settings; we then stop future Meta events.",
      ar: "لا نحمّل Meta Pixel (المعرّف 2767855866945056) إلا بعد منحك جميع اختيارات الإعلانات (ad_storage وad_user_data وad_personalization). ويقيس مشاهدات الصفحات والاهتمام بالمحتوى وإجراءات التواصل وبدء طلب عرض السعر والاستفسارات المقبولة. عند استخدام واجهة Conversions API من جهة الخادم، يشترك المتصفح والخادم في معرّف حدث عشوائي لمنع التكرار. تُطبّع أي بيانات مطابقة تُرسل للإعلانات وتحمي بتجزئة أحادية الاتجاه SHA-256 قبل الإرسال، ولا نضع الأسماء أو أرقام الهاتف أو عناوين البريد في معاملات أحداث المتصفح. يمكنك سحب موافقة الإعلانات في أي وقت من إعدادات الخصوصية، وعندها نوقف أحداث Meta المستقبلية.",
    },
  },
  {
    title: { en: "9. Security", ar: "9. الأمان" },
    body: {
      en: "We protect your data with HTTPS encryption in transit, encrypted storage, access controls limited to authorized staff, and regular security reviews. No system is 100% secure, but we apply industry-standard safeguards consistent with PDPL requirements.",
      ar: "نحمي بياناتك بتشفير HTTPS أثناء النقل، تخزين مشفّر، ضوابط وصول مقتصرة على الموظفين المخوّلين، ومراجعات أمنية دورية. لا يوجد نظام آمن بنسبة 100%، لكننا نطبّق ضمانات بمعايير القطاع تتوافق مع متطلبات PDPL.",
    },
  },
  {
    title: { en: "10. Updates to this policy", ar: "10. تحديثات هذه السياسة" },
    body: {
      en: "We may update this policy to reflect changes in our services or Saudi regulation. The latest version is always published at this URL with the effective date below. Material changes will be notified by email to active clients.",
      ar: "قد نحدّث هذه السياسة لتعكس تغييرات في خدماتنا أو الأنظمة السعودية. أحدث نسخة منشورة دائماً على هذا الرابط مع تاريخ السريان أدناه. التغييرات الجوهرية يتم إشعار العملاء النشطين بها عبر البريد الإلكتروني.",
    },
  },
  {
    title: { en: "11. Contact us", ar: "11. التواصل معنا" },
    body: {
      en: `Questions about this policy or your data? Email contact@dsccsaudia.com, call ${PHONE_LTR}, or write to: DSCC, Building 7878, Eastern Ring Road (Extension), Al Manakh District, Riyadh 14314, KSA.`,
      ar: `أسئلة حول هذه السياسة أو بياناتك؟ راسلنا على contact@dsccsaudia.com، اتصل ${PHONE_LTR}، أو راسلنا بريدياً: DSCC، مبنى 7878، الدائري الشرقي (الامتداد)، حي المنخ، الرياض 14314، المملكة العربية السعودية.`,
    },
  },
];

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const bi = useBilingual();

  const metaTitle = lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy";
  const metaDesc = lang === "ar"
    ? "سياسة خصوصية DSCC: ما البيانات التي نجمعها، لماذا نستخدمها، حقوقك بموجب نظام حماية البيانات الشخصية السعودي (PDPL)، الكوكيز، والأمان."
    : "DSCC's privacy policy: what data we collect, why we use it, your rights under Saudi PDPL, cookies, and security.";

  const jsonLd = [
    breadcrumbJsonLd([
      { name: lang === "ar" ? "الرئيسية" : "Home", path: "/" },
      { name: metaTitle, path: "/privacy" },
    ]),
  ];

  return (
    <>
      <Seo title={metaTitle} description={metaDesc} path="/privacy" jsonLd={jsonLd} />

      <section className="bg-primary text-primary-foreground">
        <div className="container py-20">
          <div className="text-xs uppercase tracking-[0.18em] text-secondary mb-3">
            {lang === "ar" ? "قانوني" : "Legal"}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
            {metaTitle}
          </h1>
          <p className="mt-5 text-sm text-primary-foreground/70">
            {lang === "ar" ? "تاريخ السريان: 1 يناير 2026" : "Effective date: 1 January 2026"}
          </p>
        </div>
      </section>

      <section className="container py-16 max-w-4xl">
        <div className="prose prose-stone max-w-none">
          <p className="text-lg text-foreground/85 leading-relaxed mb-10">
            {lang === "ar"
              ? "تشرح هذه السياسة كيف نجمع بياناتك الشخصية ونستخدمها ونحميها عند تفاعلك مع موقع DSCC وخدماتنا، بما يتوافق مع نظام حماية البيانات الشخصية السعودي (PDPL)."
              : "This policy explains how we collect, use, and protect your personal data when you interact with DSCC's website and services — in compliance with Saudi Arabia's Personal Data Protection Law (PDPL)."}
          </p>

          <div className="space-y-10">
            {SECTIONS.map((s, i) => (
              <div key={i}>
                <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-3">{bi(s.title)}</h2>
                <p className="text-base text-foreground/85 leading-relaxed">{bi(s.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
