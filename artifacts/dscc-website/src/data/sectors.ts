import type { BilingualString, Faq } from "./services";

export interface Sector {
  id: string;
  slug: string;
  name: BilingualString;
  tagline: BilingualString;
  overview: BilingualString;
  needs: BilingualString[];
  process: { title: BilingualString; desc: BilingualString }[];
  faqs: Faq[];
  serviceSlugs: string[];
  image: string;
}

export const sectors: Sector[] = [
  {
    id: "residential",
    slug: "residential",
    name: { en: "Residential", ar: "السكني" },
    tagline: { en: "Bespoke contracting for villas, palaces, and luxury compounds.", ar: "مقاولات مخصصة للفلل والقصور والمجمعات السكنية الفاخرة." },
    overview: {
      en: "DSCC delivers turnkey residential projects for high-net-worth families and developers across Saudi Arabia — from individual luxury villas to gated compound communities. Every project blends architectural integrity with modern smart-home engineering.",
      ar: "تقدم دي إس سي سي مشاريع سكنية متكاملة للعائلات والمطورين من ذوي الثروات العالية في جميع أنحاء المملكة العربية السعودية — من الفلل الفاخرة الفردية إلى مجتمعات المجمعات المسورة. يجمع كل مشروع بين النزاهة المعمارية وهندسة المنازل الذكية الحديثة.",
    },
    needs: [
      { en: "Discreet, white-glove project management", ar: "إدارة مشاريع متحفظة بأعلى المعايير" },
      { en: "Premium imported finishes and materials", ar: "تشطيبات ومواد مستوردة فاخرة" },
      { en: "Full smart-home and security integration", ar: "تكامل كامل للمنازل الذكية والأمن" },
      { en: "Outdoor living and pool engineering", ar: "هندسة المعيشة الخارجية والمسابح" },
    ],
    process: [
      { title: { en: "Discovery", ar: "الاكتشاف" }, desc: { en: "Owner brief and lifestyle audit.", ar: "موجز المالك وتدقيق نمط الحياة." } },
      { title: { en: "Design Coordination", ar: "تنسيق التصميم" }, desc: { en: "Working with your architect and ID team.", ar: "العمل مع المعماري وفريق التصميم الداخلي." } },
      { title: { en: "Procurement", ar: "المشتريات" }, desc: { en: "Global sourcing and value engineering.", ar: "توريد عالمي وهندسة قيمية." } },
      { title: { en: "Execution", ar: "التنفيذ" }, desc: { en: "Phased site execution with full QA.", ar: "تنفيذ موقعي على مراحل مع ضمان جودة كامل." } },
      { title: { en: "Handover & Care", ar: "التسليم والرعاية" }, desc: { en: "Snagging, training, and warranty programs.", ar: "تصحيح العيوب والتدريب وبرامج الضمان." } },
    ],
    faqs: [
      { q: { en: "Do you work with international architects?", ar: "هل تعملون مع المعماريين الدوليين؟" }, a: { en: "Yes, we partner with Italian, French, and British design houses regularly.", ar: "نعم، نعمل بانتظام مع دور التصميم الإيطالية والفرنسية والبريطانية." } },
      { q: { en: "What is your typical villa timeline?", ar: "ما هو الجدول الزمني المعتاد للفيلا؟" }, a: { en: "12-24 months for a 1,500-3,500 m² luxury villa, depending on scope.", ar: "12-24 شهراً لفيلا فاخرة بمساحة 1500-3500 م²، حسب النطاق." } },
    ],
    serviceSlugs: ["aluminum-steel-glazing", "windows-and-doors", "wall-floor-coverings", "hvac-systems", "lighting-switches-sockets", "smart-room-solutions", "swimming-pool-systems", "outdoor-landscape-solutions", "audio-video-systems", "bathroom-solutions"],
    image: "img/sector-residential.png",
  },
  {
    id: "commercial",
    slug: "commercial",
    name: { en: "Commercial", ar: "التجاري" },
    tagline: { en: "Office towers, retail, and corporate fit-outs.", ar: "أبراج المكاتب والتجزئة والتجهيزات المؤسسية." },
    overview: {
      en: "From CAT-A shells to bespoke C-suite floors, DSCC delivers commercial fit-out across Riyadh, Jeddah, and the Eastern Province with a focus on speed, certification readiness, and tenant satisfaction.",
      ar: "من قشور CAT-A إلى طوابق C-suite المخصصة، تقدم دي إس سي سي تجهيزات تجارية في جميع أنحاء الرياض وجدة والمنطقة الشرقية مع التركيز على السرعة وجاهزية الاعتماد ورضا المستأجرين.",
    },
    needs: [
      { en: "Aggressive program delivery", ar: "تسليم برنامج عدواني" },
      { en: "LEED / Mostadam certification support", ar: "دعم شهادات LEED / مستدام" },
      { en: "Tenant coordination and BMS integration", ar: "تنسيق المستأجرين وتكامل BMS" },
    ],
    process: [
      { title: { en: "Survey", ar: "المسح" }, desc: { en: "Existing conditions and program review.", ar: "مراجعة الأوضاع الحالية والبرنامج." } },
      { title: { en: "Design Build", ar: "التصميم والبناء" }, desc: { en: "Integrated MEP and ID engineering.", ar: "هندسة MEP والتصميم الداخلي المتكاملة." } },
      { title: { en: "Procurement", ar: "المشتريات" }, desc: { en: "Long-lead and FF&E sourcing.", ar: "توريد العناصر طويلة الأمد و FF&E." } },
      { title: { en: "Fit-Out", ar: "التجهيز" }, desc: { en: "Trade-coordinated execution.", ar: "تنفيذ منسق بين الحرفيين." } },
      { title: { en: "Commissioning", ar: "التشغيل" }, desc: { en: "TAB, Cx, and tenant handover.", ar: "TAB و Cx وتسليم المستأجرين." } },
    ],
    faqs: [
      { q: { en: "Can you deliver Cat-A in under 12 weeks?", ar: "هل يمكنكم تسليم Cat-A في أقل من 12 أسبوعاً؟" }, a: { en: "Yes for floors under 2,000 m², with materials pre-positioned.", ar: "نعم للطوابق التي تقل عن 2000 م²، مع توفير المواد مسبقاً." } },
    ],
    serviceSlugs: ["aluminum-steel-glazing", "hvac-systems", "electrical-systems", "fire-protection-systems", "building-automation-systems", "it-systems-networking", "security-systems", "indoor-outdoor-furniture", "lighting-switches-sockets", "audio-video-systems"],
    image: "img/sector-commercial.png",
  },
  {
    id: "hospitality",
    slug: "hospitality",
    name: { en: "Hospitality", ar: "الضيافة" },
    tagline: { en: "Turnkey delivery for 5-star hotels and resorts.", ar: "تسليم متكامل للفنادق والمنتجعات الخمس نجوم." },
    overview: {
      en: "DSCC is a trusted hospitality fit-out partner for branded operators across the Kingdom — from Red Sea resorts to NEOM staff villages and Riyadh urban hotels. We deliver brand-standard rooms, F&B venues, spas, and BOH on aggressive opening calendars.",
      ar: "دي إس سي سي شريك تجهيز ضيافة موثوق به للمشغلين العالميين في جميع أنحاء المملكة — من منتجعات البحر الأحمر إلى قرى موظفي نيوم وفنادق الرياض الحضرية. نقدم غرفاً وفقاً لمعايير العلامات التجارية ومرافق F&B والسبا و BOH وفقاً لجداول افتتاح عدوانية.",
    },
    needs: [
      { en: "Brand-standard mockup rooms", ar: "غرف نموذجية بمعايير العلامة" },
      { en: "Phased pre-opening delivery", ar: "تسليم مرحلي ما قبل الافتتاح" },
      { en: "OS&E and FF&E coordination", ar: "تنسيق OS&E و FF&E" },
      { en: "Smart room and PMS integration", ar: "تكامل الغرف الذكية و PMS" },
    ],
    process: [
      { title: { en: "Brand Alignment", ar: "محاذاة العلامة" }, desc: { en: "Brand technical services kickoff.", ar: "انطلاق الخدمات الفنية للعلامة." } },
      { title: { en: "Mockup Room", ar: "الغرفة النموذجية" }, desc: { en: "Full-dress mockup with brand sign-off.", ar: "غرفة نموذجية كاملة باعتماد العلامة." } },
      { title: { en: "Production", ar: "الإنتاج" }, desc: { en: "FF&E manufacture and OS&E procurement.", ar: "تصنيع FF&E ومشتريات OS&E." } },
      { title: { en: "Rollout", ar: "الطرح" }, desc: { en: "Floor-by-floor installation.", ar: "تركيب طابقاً بطابق." } },
      { title: { en: "Pre-Opening", ar: "ما قبل الافتتاح" }, desc: { en: "Snagging and operator handover.", ar: "تصحيح العيوب وتسليم المشغل." } },
    ],
    faqs: [
      { q: { en: "Which brands have you delivered for?", ar: "ما هي العلامات التي قمتم بالتسليم لها؟" }, a: { en: "Marriott, Hilton, IHG, Accor, Rotana, and Mövenpick portfolios.", ar: "محافظ ماريوت وهيلتون و IHG وأكور وروتانا وموفنبيك." } },
      { q: { en: "Can you handle remote site logistics?", ar: "هل يمكنكم التعامل مع لوجستيات المواقع النائية؟" }, a: { en: "Yes — Red Sea, NEOM, and AlUla remote project logistics handled in-house.", ar: "نعم — لوجستيات المشاريع النائية في البحر الأحمر ونيوم والعلا تتم داخلياً." } },
    ],
    serviceSlugs: ["smart-room-solutions", "indoor-outdoor-furniture", "kitchen-laundry-equipment", "hospitality-supplies", "decoration-artwork", "hospitality-signage-wayfinding", "linen-chute-solutions", "audio-video-systems", "bathroom-solutions", "wall-floor-coverings", "fitness-equipment", "swimming-pool-systems"],
    image: "img/sector-hospitality.png",
  },
  {
    id: "infrastructure",
    slug: "infrastructure",
    name: { en: "Infrastructure", ar: "البنية التحتية" },
    tagline: { en: "MEP and engineering for public realm and giga-projects.", ar: "MEP والهندسة للمجال العام والمشاريع العملاقة." },
    overview: {
      en: "DSCC supports giga-project EPC contractors and government clients with MEP engineering, signage, security, and specialty systems for transit, healthcare, education, and civic infrastructure.",
      ar: "تدعم دي إس سي سي مقاولي EPC للمشاريع العملاقة والعملاء الحكوميين بهندسة MEP واللافتات والأمن والأنظمة المتخصصة للنقل والرعاية الصحية والتعليم والبنية التحتية المدنية.",
    },
    needs: [
      { en: "Saudi vendor and SASO compliance", ar: "الامتثال للموردين السعوديين و SASO" },
      { en: "Scale fabrication and logistics", ar: "تصنيع ولوجستيات على نطاق واسع" },
      { en: "Long warranty and maintenance commitments", ar: "ضمانات وصيانة طويلة الأجل" },
    ],
    process: [
      { title: { en: "Tender", ar: "المناقصة" }, desc: { en: "Pre-qualification and proposal.", ar: "التأهيل المسبق والعرض." } },
      { title: { en: "Engineering", ar: "الهندسة" }, desc: { en: "Shop drawings and value engineering.", ar: "رسومات تنفيذية وهندسة قيمية." } },
      { title: { en: "Manufacture", ar: "التصنيع" }, desc: { en: "Local and imported production.", ar: "إنتاج محلي ومستورد." } },
      { title: { en: "Installation", ar: "التركيب" }, desc: { en: "Site logistics and execution.", ar: "لوجستيات الموقع والتنفيذ." } },
      { title: { en: "Operate & Maintain", ar: "التشغيل والصيانة" }, desc: { en: "Multi-year O&M contracts.", ar: "عقود O&M متعددة السنوات." } },
    ],
    faqs: [
      { q: { en: "Are you registered with major giga-project EPCs?", ar: "هل أنتم مسجلون لدى مقاولي EPC للمشاريع العملاقة؟" }, a: { en: "Yes, pre-qualified across NEOM, Red Sea, Diriyah, and Qiddiya supply chains.", ar: "نعم، مؤهلون مسبقاً عبر سلاسل توريد نيوم والبحر الأحمر والدرعية والقدية." } },
    ],
    serviceSlugs: ["hvac-systems", "fire-protection-systems", "electrical-systems", "water-supply-drainage", "boiler-systems", "security-systems", "it-systems-networking", "hospitality-signage-wayfinding", "outdoor-landscape-solutions"],
    image: "img/sector-infrastructure.png",
  },
];

export function getSectorBySlug(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug);
}
