import type { Lead } from "./types";
import type { TKey } from "./i18n";

export type TemplateLang = "ar" | "en";

export interface MessageTemplate {
  id: string;
  labelKey: TKey;
  subjectKey?: TKey;
  build: (lead: Lead, lang: TemplateLang) => { subject?: string; body: string };
}

const NAME = (lead: Lead, lang: TemplateLang) =>
  lead.fullName?.split(" ")[0] || (lang === "ar" ? "عميلنا الكريم" : "there");

export const TEMPLATES: MessageTemplate[] = [
  {
    id: "first_touch",
    labelKey: "tpl_first_touch",
    build: (lead, lang) => {
      if (lang === "ar") {
        return {
          subject: `شكراً لتواصلك مع DSCC · ${lead.ref}`,
          body:
`السلام عليكم ${NAME(lead, "ar")}،

شكراً لتواصلك مع شركة المملكة المتنوّعة للمقاولات (DSCC). وصلنا طلبك بنجاح${lead.projectType ? ` بخصوص ${lead.projectType}` : ""}${lead.city ? ` في ${lead.city}` : ""}، ورقم المرجع لديك: ${lead.ref}.

سنتواصل معك خلال 24 ساعة عمل لمناقشة التفاصيل وأنسب الخطوات القادمة.

في حال كان لديك أي استفسار عاجل، يسعدنا الردّ عليه مباشرة.

تحيّاتنا،
فريق المبيعات · DSCC`,
        };
      }
      return {
        subject: `Thank you for contacting DSCC · ${lead.ref}`,
        body:
`Hello ${NAME(lead, "en")},

Thank you for reaching out to Diversified Saudi Contracting Company (DSCC). We have received your inquiry${lead.projectType ? ` regarding ${lead.projectType}` : ""}${lead.city ? ` in ${lead.city}` : ""}. Your reference number is: ${lead.ref}.

Our sales team will contact you within 24 business hours to discuss the details and the best next steps.

Please feel free to reply if you have any urgent questions.

Best regards,
DSCC Sales Team`,
      };
    },
  },
  {
    id: "followup",
    labelKey: "tpl_followup",
    build: (lead, lang) => {
      if (lang === "ar") {
        return {
          subject: `متابعة بشأن طلبك · ${lead.ref}`,
          body:
`السلام عليكم ${NAME(lead, "ar")}،

أتابع معك بخصوص طلبك السابق (${lead.ref}). حاولنا التواصل دون أن نتمكّن من الوصول إليك. أرجو إعلامنا بالوقت المناسب لإجراء مكالمة قصيرة لاستكمال التفاصيل.

شكراً لاهتمامك،
فريق المبيعات · DSCC`,
        };
      }
      return {
        subject: `Follow-up on your inquiry · ${lead.ref}`,
        body:
`Hello ${NAME(lead, "en")},

I'm following up regarding your earlier inquiry (${lead.ref}). We tried reaching you but couldn't connect. Could you let us know a convenient time for a brief call to discuss the details?

Thank you for your interest,
DSCC Sales Team`,
      };
    },
  },
  {
    id: "meeting",
    labelKey: "tpl_meeting",
    build: (lead, lang) => {
      if (lang === "ar") {
        return {
          subject: `اقتراح اجتماع · ${lead.ref}`,
          body:
`مرحباً ${NAME(lead, "ar")}،

لمناقشة طلبك (${lead.ref}) بشكل أوسع، نقترح عقد اجتماع قصير عبر Microsoft Teams أو زيارة لموقعك. هل يناسبك أحد التواريخ التالية؟

• الأحد القادم — 10:00 ص
• الإثنين — 2:00 م
• الثلاثاء — 11:00 ص

في انتظار تأكيدك،
فريق المبيعات · DSCC`,
        };
      }
      return {
        subject: `Proposed meeting · ${lead.ref}`,
        body:
`Hello ${NAME(lead, "en")},

To discuss your inquiry (${lead.ref}) in more detail, we'd like to propose a short meeting on Microsoft Teams or a visit to your site. Would any of the following work for you?

• Sunday — 10:00 AM
• Monday — 2:00 PM
• Tuesday — 11:00 AM

Looking forward to your confirmation,
DSCC Sales Team`,
      };
    },
  },
  {
    id: "quote_ready",
    labelKey: "tpl_quote_ready",
    build: (lead, lang) => {
      if (lang === "ar") {
        return {
          subject: `عرضك جاهز · ${lead.ref}`,
          body:
`السلام عليكم ${NAME(lead, "ar")}،

يسعدنا إعلامك بأن عرض السعر الخاصّ بطلبك (${lead.ref}) قد اكتمل. سيصلك خلال ساعات على بريدك الإلكتروني.

نرحّب بمناقشة أي تعديلات بعد اطّلاعك،
فريق المبيعات · DSCC`,
        };
      }
      return {
        subject: `Your quote is ready · ${lead.ref}`,
        body:
`Hello ${NAME(lead, "en")},

We're pleased to let you know that the quote for your inquiry (${lead.ref}) is ready and will arrive in your inbox within a few hours.

Happy to discuss any adjustments after you review it,
DSCC Sales Team`,
      };
    },
  },
  {
    id: "quote_sent",
    labelKey: "tpl_quote_sent",
    build: (lead, lang) => {
      if (lang === "ar") {
        return {
          subject: `بانتظار رأيك بالعرض · ${lead.ref}`,
          body:
`السلام عليكم ${NAME(lead, "ar")}،

أردنا الاطمئنان بأن العرض المرفق بطلبك (${lead.ref}) قد وصلك. سعداء بالردّ على أي استفسار أو إجراء أي تعديل تقترحه.

تحيّاتنا،
فريق المبيعات · DSCC`,
        };
      }
      return {
        subject: `Awaiting your feedback on the quote · ${lead.ref}`,
        body:
`Hello ${NAME(lead, "en")},

Just checking that the quote we sent for your inquiry (${lead.ref}) reached you. We're happy to answer questions or make adjustments.

Best regards,
DSCC Sales Team`,
      };
    },
  },
  {
    id: "thank_you",
    labelKey: "tpl_thank_you",
    build: (lead, lang) => {
      if (lang === "ar") {
        return {
          subject: `شكراً لاختيارك DSCC · ${lead.ref}`,
          body:
`السلام عليكم ${NAME(lead, "ar")}،

نشكرك جزيل الشكر على اختيارك شركة المملكة المتنوّعة للمقاولات. سيقوم مدير المشروع بالتواصل معك خلال يومي عمل لبدء التنفيذ ومناقشة الجدول الزمني.

نتطلّع إلى شراكة ناجحة،
إدارة المشاريع · DSCC`,
        };
      }
      return {
        subject: `Thank you for choosing DSCC · ${lead.ref}`,
        body:
`Hello ${NAME(lead, "en")},

Thank you very much for choosing Diversified Saudi Contracting Company. Our project manager will reach out within two business days to kick off execution and align on the timeline.

Looking forward to a successful partnership,
DSCC Project Management`,
      };
    },
  },
];

export function buildWhatsAppUrl(phone: string, message: string): string {
  // Strip non-digits except leading +
  const cleaned = phone.replace(/[^\d+]/g, "").replace(/^00/, "+");
  const num = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(email: string, subject: string, body: string): string {
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}
