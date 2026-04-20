#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const NOTIF_FILE = path.join(DATA_DIR, "notifications.json");

function rid(prefix = "") {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function isoMinusHours(h) {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

function isoMinusDays(d) {
  return new Date(Date.now() - d * 86400 * 1000).toISOString();
}

const SEED = [
  {
    fullName: "أحمد العتيبي",
    company: "مجموعة الفيصل العقارية",
    email: "ahmed.alotaibi@example.sa",
    phone: "+966 50 123 4567",
    city: "الرياض",
    source: "quote",
    status: "new",
    priority: "high",
    projectType: "بناء فلل سكنية",
    services: ["الإنشاءات السكنية", "التشطيبات الداخلية"],
    budget: "5,000,000 - 10,000,000 ر.س",
    timeline: "خلال 3 أشهر",
    message: "نرغب ببناء مجمّع 6 فلل بمساحة إجمالية 4500م² شمال الرياض. لدينا التصاميم المعتمدة ونحتاج عرض سعر شامل.",
    createdAt: isoMinusHours(2),
  },
  {
    fullName: "Fatimah Al-Zahrani",
    company: "Aramco Contractors LLC",
    email: "fatimah.z@example.com",
    phone: "+966 55 987 6543",
    city: "الدمام",
    source: "quote",
    status: "contacted",
    priority: "urgent",
    projectType: "مشروع صناعي",
    services: ["الإنشاءات الصناعية", "البنية التحتية"],
    budget: "15,000,000+ ر.س",
    timeline: "عاجل - شهر",
    message: "تطوير منشأة صناعية بمساحة 12000م² تتضمن مستودعات، مكاتب إدارية، ومناطق تحميل.",
    createdAt: isoMinusHours(8),
  },
  {
    fullName: "محمد القحطاني",
    company: "",
    email: "m.alqahtani@example.sa",
    phone: "+966 53 444 8899",
    city: "جدة",
    source: "chatbot",
    status: "qualified",
    priority: "normal",
    projectType: "ترميم منزل",
    services: ["الترميم والصيانة", "التشطيبات"],
    budget: "300,000 - 500,000 ر.س",
    timeline: "خلال شهرين",
    chatbotSummary: "العميل يملك منزلاً قديماً بمساحة 350م² في حي الشاطئ، يحتاج ترميم شامل يشمل السباكة والكهرباء والتشطيبات.",
    intent: "ترميم سكني",
    recommendedServices: ["الترميم والصيانة", "أنظمة MEP"],
    message: "محادثة مع سارة - يحتاج زيارة موقع لتقييم دقيق.",
    createdAt: isoMinusHours(20),
  },
  {
    fullName: "Sarah Mansour",
    company: "Mansour Investment Group",
    email: "sarah.m@example.com",
    phone: "+966 56 222 1133",
    city: "الرياض",
    source: "contact",
    status: "quotation_sent",
    priority: "high",
    projectType: "مكاتب إدارية",
    services: ["الإنشاءات التجارية", "أنظمة MEP", "التشطيبات الداخلية"],
    budget: "8,000,000 ر.س",
    timeline: "Q3 2026",
    message: "Looking for a turnkey solution for a 6-floor office building in King Fahd district. Sustainability certifications preferred.",
    createdAt: isoMinusDays(2),
  },
  {
    fullName: "خالد السبيعي",
    company: "شركة السبيعي للتطوير",
    email: "khalid@subaie-dev.sa",
    phone: "+966 54 777 2200",
    city: "مكة المكرمة",
    source: "quote",
    status: "negotiation",
    priority: "high",
    projectType: "مجمّع تجاري",
    services: ["الإنشاءات التجارية", "البنية التحتية"],
    budget: "20,000,000 ر.س",
    timeline: "12 شهراً",
    message: "تطوير مجمّع تجاري بمساحة 8000م² بطابقين تجاريين وموقف سيارات تحت الأرض.",
    createdAt: isoMinusDays(4),
  },
  {
    fullName: "نورة الشمري",
    company: "",
    email: "noura.shamri@example.sa",
    phone: "+966 50 333 4455",
    city: "الرياض",
    source: "contact",
    status: "new",
    priority: "normal",
    projectType: "استشارة هندسية",
    services: ["الاستشارات الهندسية"],
    message: "أحتاج استشارة لتقييم هيكلي لمبنى قديم قبل إعادة التطوير. هل يمكن جدولة زيارة؟",
    createdAt: isoMinusHours(5),
  },
  {
    fullName: "Omar Hassan",
    company: "Tech Park Riyadh",
    email: "omar.h@techpark.sa",
    phone: "+966 55 666 7788",
    city: "الرياض",
    source: "chatbot",
    status: "qualified",
    priority: "urgent",
    projectType: "مركز بيانات",
    services: ["الإنشاءات الصناعية", "أنظمة MEP", "البنية التحتية"],
    budget: "30,000,000+ ر.س",
    timeline: "6 أشهر",
    chatbotSummary: "العميل يطلب بناء مركز بيانات Tier-3 بمساحة 2500م² مع أنظمة تبريد متقدمة وغرف خوادم وUPS.",
    intent: "مركز بيانات",
    recommendedServices: ["الإنشاءات الصناعية", "أنظمة MEP المتقدمة"],
    message: "استشارة استراتيجية + عرض فني وتجاري.",
    createdAt: isoMinusDays(1),
  },
  {
    fullName: "ريم العنزي",
    email: "reem.anazi@example.sa",
    phone: "+966 53 111 9988",
    city: "الخبر",
    source: "newsletter",
    status: "new",
    priority: "low",
    message: "اشتراك في النشرة البريدية للحصول على آخر مشاريع الشركة.",
    createdAt: isoMinusHours(36),
  },
  {
    fullName: "عبدالله المالكي",
    company: "مؤسسة المالكي للمقاولات",
    email: "a.malki@example.sa",
    phone: "+966 50 555 6677",
    city: "أبها",
    source: "quote",
    status: "won",
    priority: "high",
    projectType: "فندق سياحي",
    services: ["الإنشاءات التجارية", "التشطيبات الفاخرة"],
    budget: "45,000,000 ر.س",
    timeline: "18 شهراً",
    message: "فندق 5 نجوم بـ 120 غرفة في أبها — العقد موقّع، بدء التنفيذ الشهر القادم.",
    createdAt: isoMinusDays(15),
  },
  {
    fullName: "Lina Ibrahim",
    company: "Green Future Co.",
    email: "lina@greenfuture.sa",
    phone: "+966 55 333 9911",
    city: "جدة",
    source: "contact",
    status: "lost",
    priority: "normal",
    projectType: "مشروع طاقة شمسية",
    services: ["البنية التحتية", "الإنشاءات الصناعية"],
    message: "Project went to another contractor due to scheduling conflict.",
    createdAt: isoMinusDays(20),
  },
];

function buildLead(s) {
  const id = rid("L_");
  return {
    id,
    ref: rid("DSCC-").toUpperCase(),
    source: s.source,
    status: s.status,
    priority: s.priority,
    createdAt: s.createdAt,
    updatedAt: s.createdAt,
    fullName: s.fullName,
    company: s.company || undefined,
    email: s.email,
    phone: s.phone,
    city: s.city,
    projectType: s.projectType,
    services: s.services,
    budget: s.budget,
    timeline: s.timeline,
    message: s.message,
    chatbotSummary: s.chatbotSummary,
    intent: s.intent,
    recommendedServices: s.recommendedServices,
    notes: [],
    raw: { seeded: true },
  };
}

function buildNotification(lead) {
  const sourceLabelAr = {
    quote: "طلب عرض سعر",
    contact: "نموذج تواصل",
    chatbot: "محادثة الروبوت",
    newsletter: "نشرة بريدية",
    other: "طلب عام",
  };
  const sourceLabelEn = {
    quote: "Quote request",
    contact: "Contact message",
    chatbot: "Chatbot lead",
    newsletter: "Newsletter signup",
    other: "Inquiry",
  };
  const who = lead.fullName || lead.company || "بدون اسم";
  return {
    id: rid("N_"),
    type: "lead_new",
    titleAr: `${sourceLabelAr[lead.source]} · ${who}`,
    titleEn: `${sourceLabelEn[lead.source]} · ${who}`,
    bodyAr: lead.message || lead.chatbotSummary || `مرجع: ${lead.ref}`,
    bodyEn: lead.message || lead.chatbotSummary || `Ref: ${lead.ref}`,
    leadId: lead.id,
    leadRef: lead.ref,
    meta: { source: lead.source, city: lead.city, services: lead.services },
    read: lead.status !== "new",
    createdAt: lead.createdAt,
  };
}

async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  let existing = [];
  try {
    existing = JSON.parse(await fs.readFile(LEADS_FILE, "utf8"));
  } catch {}

  const seeded = SEED.map(buildLead);
  // Sort newest first
  seeded.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  // Merge: add seeded only if no seeded leads already present
  const hasSeeded = existing.some((l) => l.raw && l.raw.seeded);
  const finalLeads = hasSeeded ? existing : [...seeded, ...existing];

  await fs.writeFile(LEADS_FILE, JSON.stringify(finalLeads, null, 2), "utf8");
  console.log(`Wrote ${finalLeads.length} leads to ${LEADS_FILE} (seeded ${hasSeeded ? 0 : seeded.length})`);

  // Notifications
  let existingNotifs = [];
  try {
    existingNotifs = JSON.parse(await fs.readFile(NOTIF_FILE, "utf8"));
  } catch {}
  const hasSeededNotifs = existingNotifs.some((n) => n.meta && n.meta.seeded);
  if (!hasSeededNotifs) {
    const seededNotifs = seeded.map(buildNotification).map((n) => ({ ...n, meta: { ...n.meta, seeded: true } }));
    seededNotifs.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    const finalNotifs = [...seededNotifs, ...existingNotifs];
    await fs.writeFile(NOTIF_FILE, JSON.stringify(finalNotifs, null, 2), "utf8");
    console.log(`Wrote ${finalNotifs.length} notifications (seeded ${seededNotifs.length})`);
  } else {
    console.log("Notifications already seeded; skipping.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
