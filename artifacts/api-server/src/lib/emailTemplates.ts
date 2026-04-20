import type { Lead } from "./leadStore";

const BRAND_COLOR = "#992651";
const BRAND_DARK = "#6e1a3a";

function escapeHtml(s: string | undefined | null): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string | undefined | null): string {
  if (!value) return "";
  return `<tr><td style="padding:6px 12px;color:#666;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(
    label,
  )}</td><td style="padding:6px 12px;color:#111;font-size:14px">${escapeHtml(value)}</td></tr>`;
}

function shell(inner: string, dir: "ltr" | "rtl" = "rtl"): string {
  const align = dir === "rtl" ? "right" : "left";
  return `<!doctype html><html dir="${dir}" lang="${dir === "rtl" ? "ar" : "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f3f4;font-family:'Tahoma','Segoe UI',Arial,sans-serif;color:#222">
  <div style="max-width:600px;margin:0 auto;padding:24px 12px">
    <div style="background:${BRAND_COLOR};color:#fff;padding:18px 24px;border-radius:10px 10px 0 0;text-align:${align}">
      <div style="font-size:20px;font-weight:700;letter-spacing:.5px">DSCC</div>
      <div style="font-size:12px;opacity:.85">Diversified Saudi Contracting Company</div>
    </div>
    <div style="background:#fff;padding:24px;border:1px solid #e7e1e3;border-top:0;border-radius:0 0 10px 10px;text-align:${align}">
      ${inner}
    </div>
    <div style="text-align:center;color:#999;font-size:11px;margin-top:14px">
      © ${new Date().getFullYear()} DSCC · dsccsaudia.com
    </div>
  </div>
</body></html>`;
}

export function adminNotificationEmail(lead: Lead): { subject: string; html: string; text: string } {
  const sourceLabel: Record<string, string> = {
    quote: "طلب عرض سعر",
    contact: "نموذج تواصل",
    chatbot: "محادثة الروبوت (سارة)",
    newsletter: "نشرة بريدية",
    other: "أخرى",
  };
  const src = sourceLabel[lead.source] || lead.source;
  const inner = `
    <h2 style="margin:0 0 8px;color:${BRAND_DARK};font-size:18px">طلب جديد وارد · ${escapeHtml(src)}</h2>
    <p style="margin:0 0 16px;color:#555;font-size:13px">رقم المرجع: <strong>${escapeHtml(lead.ref)}</strong></p>
    <table style="width:100%;border-collapse:collapse;background:#fafafa;border-radius:8px;overflow:hidden">
      ${row("الاسم", lead.fullName)}
      ${row("الشركة", lead.company)}
      ${row("البريد", lead.email)}
      ${row("الهاتف", lead.phone)}
      ${row("المدينة", lead.city)}
      ${row("نوع المشروع", lead.projectType)}
      ${row("الخدمات", (lead.services || []).join("، "))}
      ${row("الميزانية", lead.budget)}
      ${row("الجدول الزمني", lead.timeline)}
      ${row("الرسالة", lead.message)}
      ${row("ملخّص الروبوت", lead.chatbotSummary)}
    </table>
    <div style="margin-top:18px">
      <a href="https://dsccsaudia.com/admin/leads/${encodeURIComponent(lead.id)}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;text-decoration:none;padding:10px 18px;border-radius:6px;font-size:13px;font-weight:600">فتح في لوحة التحكم</a>
    </div>
    <p style="margin:18px 0 0;color:#888;font-size:12px">يُنصح بالتواصل خلال أوّل ساعة لزيادة معدّل التحويل.</p>
  `;
  const subject = `[DSCC] طلب جديد · ${src} · ${lead.fullName || lead.company || "بدون اسم"} (${lead.ref})`;
  const text = [
    `طلب جديد وارد · ${src}`,
    `المرجع: ${lead.ref}`,
    lead.fullName ? `الاسم: ${lead.fullName}` : "",
    lead.company ? `الشركة: ${lead.company}` : "",
    lead.email ? `البريد: ${lead.email}` : "",
    lead.phone ? `الهاتف: ${lead.phone}` : "",
    lead.city ? `المدينة: ${lead.city}` : "",
    lead.projectType ? `نوع المشروع: ${lead.projectType}` : "",
    lead.message ? `الرسالة: ${lead.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return { subject, html: shell(inner, "rtl"), text };
}

export function clientAcknowledgementEmail(lead: Lead): { subject: string; html: string; text: string } {
  const hasArabic = /[\u0600-\u06FF]/.test(
    `${lead.fullName || ""} ${lead.company || ""} ${lead.message || ""} ${lead.city || ""}`,
  );
  const isAr = hasArabic || !lead.email; // default to AR for SA market unless content is purely English
  const name = escapeHtml(lead.fullName || (isAr ? "عميلنا الكريم" : "Valued client"));
  if (!isAr) {
    const innerEn = `
    <h2 style="margin:0 0 12px;color:${BRAND_DARK};font-size:20px">Thank you for reaching out, ${name}</h2>
    <p style="margin:0 0 12px;color:#333;font-size:14px;line-height:1.7">
      We've received your inquiry and the sales team at <strong>Diversified Saudi Contracting Company (DSCC)</strong>
      will review and contact you within <strong>24 business hours</strong>.
    </p>
    <div style="background:#faf3f6;border-left:4px solid ${BRAND_COLOR};padding:12px 16px;border-radius:6px;margin:16px 0">
      <div style="font-size:12px;color:#777;margin-bottom:4px">Your reference number</div>
      <div style="font-size:18px;font-weight:700;color:${BRAND_DARK};letter-spacing:.5px">${escapeHtml(lead.ref)}</div>
    </div>
    <p style="margin:12px 0;color:#444;font-size:13px;line-height:1.7">
      Please keep this reference for your records. For urgent matters:
    </p>
    <ul style="padding:0 18px;margin:0 0 16px;color:#333;font-size:13px;line-height:1.9">
      <li>Phone: <strong>+966 XX XXX XXXX</strong></li>
      <li>Email: <strong>info@dsccsaudia.com</strong></li>
      <li>Website: <strong>dsccsaudia.com</strong></li>
    </ul>
    <p style="margin:16px 0 0;color:#666;font-size:12px">We appreciate your trust and look forward to serving you.</p>
    `;
    const subjectEn = `We received your inquiry · DSCC · ${lead.ref}`;
    const textEn = `Thank you ${lead.fullName || ""}.\nYour reference: ${lead.ref}\nOur team will contact you within 24 business hours.\n\nDSCC · dsccsaudia.com`;
    return { subject: subjectEn, html: shell(innerEn, "ltr"), text: textEn };
  }
  const innerAr = `
    <h2 style="margin:0 0 12px;color:${BRAND_DARK};font-size:20px">شكراً لتواصلك معنا، ${name}</h2>
    <p style="margin:0 0 12px;color:#333;font-size:14px;line-height:1.7">
      وصلنا طلبك بنجاح وسيقوم فريق المبيعات لدى <strong>شركة المملكة المتنوّعة للمقاولات (DSCC)</strong>
      بمراجعته والتواصل معك خلال <strong>24 ساعة عمل</strong>.
    </p>
    <div style="background:#faf3f6;border-${isAr ? "right" : "left"}:4px solid ${BRAND_COLOR};padding:12px 16px;border-radius:6px;margin:16px 0">
      <div style="font-size:12px;color:#777;margin-bottom:4px">رقم مرجع طلبك</div>
      <div style="font-size:18px;font-weight:700;color:${BRAND_DARK};letter-spacing:.5px">${escapeHtml(lead.ref)}</div>
    </div>
    <p style="margin:12px 0;color:#444;font-size:13px;line-height:1.7">
      احتفظ بهذا الرقم للرجوع إليه عند الاتصال بنا. إن كان طلبك مستعجلاً يمكنك التواصل المباشر:
    </p>
    <ul style="padding:0 18px;margin:0 0 16px;color:#333;font-size:13px;line-height:1.9">
      <li>الهاتف: <strong dir="ltr">+966 XX XXX XXXX</strong></li>
      <li>البريد: <strong dir="ltr">info@dsccsaudia.com</strong></li>
      <li>الموقع: <strong>dsccsaudia.com</strong></li>
    </ul>
    <p style="margin:16px 0 0;color:#666;font-size:12px">نقدّر ثقتك ونتطلّع لخدمتك.</p>
  `;
  const subject = `تأكيد استلام طلبك · DSCC · ${lead.ref}`;
  const text = `شكراً لتواصلك ${lead.fullName || ""}.\nوصلنا طلبك ورقم المرجع: ${lead.ref}\nسنتواصل معك خلال 24 ساعة عمل.\n\nDSCC · dsccsaudia.com`;
  return { subject, html: shell(innerAr, "rtl"), text };
}
