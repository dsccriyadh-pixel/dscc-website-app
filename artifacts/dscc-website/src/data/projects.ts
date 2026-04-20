import type { BilingualString } from "./services";

export interface Project {
  id: string;
  slug: string;
  title: BilingualString;
  client: BilingualString;
  location: BilingualString;
  city: string;
  year: string;
  sectorId: string;
  scope: BilingualString;
  summary: BilingualString;
  highlights: BilingualString[];
  serviceSlugs: string[];
  image: string;
  gallery: string[];
}

export const projects: Project[] = [
  {
    id: "1",
    slug: "kafd-financial-tower",
    title: { en: "KAFD Financial Tower — Interior Fit-Out", ar: "برج KAFD المالي — تجهيز داخلي" },
    client: { en: "Confidential financial group", ar: "مجموعة مالية سرية" },
    location: { en: "King Abdullah Financial District, Riyadh", ar: "مركز الملك عبدالله المالي، الرياض" },
    city: "Riyadh",
    year: "2024",
    sectorId: "commercial",
    scope: { en: "Design, supply, install — turnkey 18-floor fit-out", ar: "تصميم، توريد، تركيب — تجهيز متكامل لـ 18 طابقاً" },
    summary: {
      en: "DSCC delivered the full interior fit-out of an 18-floor financial trading headquarters within KAFD, including LEED Gold MEP upgrades, custom joinery, and premium executive floors.",
      ar: "قامت دي إس سي سي بتسليم التجهيز الداخلي الكامل لمقر تداول مالي بـ 18 طابقاً داخل KAFD، بما في ذلك ترقيات MEP بمستوى LEED Gold والنجارة المخصصة وطوابق تنفيذية ممتازة.",
    },
    highlights: [
      { en: "18 floors delivered in 9 months", ar: "تسليم 18 طابقاً في 9 أشهر" },
      { en: "LEED Gold certification achieved", ar: "تم الحصول على شهادة LEED الذهبية" },
      { en: "1,200+ workstations", ar: "أكثر من 1200 محطة عمل" },
    ],
    serviceSlugs: ["aluminum-steel-glazing", "hvac-systems", "lighting-switches-sockets", "it-systems-networking", "security-systems"],
    image: "img/sector-commercial.png",
    gallery: ["img/sector-commercial.png", "img/hero-skyline.png"],
  },
  {
    id: "2",
    slug: "red-sea-resort-villas",
    title: { en: "Red Sea Coastal Villa Cluster", ar: "مجموعة فلل ساحلية في البحر الأحمر" },
    client: { en: "Confidential resort operator", ar: "مشغل منتجع سري" },
    location: { en: "Red Sea Project, Tabuk Region", ar: "مشروع البحر الأحمر، منطقة تبوك" },
    city: "Tabuk",
    year: "2025",
    sectorId: "hospitality",
    scope: { en: "MEP, FF&E, smart room, landscape — turnkey", ar: "MEP، FF&E، غرفة ذكية، مناظر طبيعية — متكامل" },
    summary: {
      en: "Turnkey delivery of 96 ultra-luxury overwater and beachfront villas including custom joinery, smart room platforms, infinity pools, and full landscape engineering.",
      ar: "تسليم متكامل لـ 96 فيلا فاخرة فوق الماء وعلى الواجهة البحرية تشمل النجارة المخصصة، منصات الغرف الذكية، المسابح اللانهائية، والهندسة الكاملة للمناظر الطبيعية.",
    },
    highlights: [
      { en: "96 villas across 3 island clusters", ar: "96 فيلا عبر 3 مجموعات جزر" },
      { en: "Marine-grade MEP for coastal exposure", ar: "MEP بدرجة بحرية للتعرض الساحلي" },
      { en: "Smart room with brand certification", ar: "غرفة ذكية باعتماد العلامة" },
    ],
    serviceSlugs: ["smart-room-solutions", "indoor-outdoor-furniture", "swimming-pool-systems", "outdoor-landscape-solutions", "bathroom-solutions", "audio-video-systems"],
    image: "img/sector-hospitality.png",
    gallery: ["img/sector-hospitality.png"],
  },
  {
    id: "3",
    slug: "neom-staff-village-facade",
    title: { en: "NEOM Staff Village Facade Package", ar: "حزمة واجهات قرية موظفي نيوم" },
    client: { en: "Tier-1 EPC contractor", ar: "مقاول EPC من الفئة الأولى" },
    location: { en: "NEOM, Tabuk Region", ar: "نيوم، منطقة تبوك" },
    city: "NEOM",
    year: "2024",
    sectorId: "infrastructure",
    scope: { en: "Design, fabrication, install — modular facade and glazing", ar: "تصميم، تصنيع، تركيب — واجهات معيارية وتزجيج" },
    summary: {
      en: "Modular aluminum and glazing facade package for 1,400 staff accommodation units, engineered for fast-track installation and Saudi desert thermal performance.",
      ar: "حزمة واجهات معيارية من الألمنيوم والتزجيج لـ 1400 وحدة سكن للموظفين، مصممة للتركيب السريع والأداء الحراري للصحراء السعودية.",
    },
    highlights: [
      { en: "1,400 units delivered in 14 months", ar: "تسليم 1400 وحدة في 14 شهراً" },
      { en: "Pre-fabricated modular system", ar: "نظام معياري مسبق الصنع" },
      { en: "U-value 1.4 W/m²K thermal performance", ar: "أداء حراري بقيمة U تبلغ 1.4 W/m²K" },
    ],
    serviceSlugs: ["aluminum-steel-glazing", "windows-and-doors"],
    image: "img/sector-infrastructure.png",
    gallery: ["img/sector-infrastructure.png"],
  },
  {
    id: "4",
    slug: "diriyah-boutique-hotel",
    title: { en: "Diriyah Boutique Hotel Fit-Out", ar: "تجهيز فندق الدرعية البوتيكي" },
    client: { en: "Heritage hospitality brand", ar: "علامة ضيافة تراثية" },
    location: { en: "Diriyah Gate, Riyadh", ar: "بوابة الدرعية، الرياض" },
    city: "Riyadh",
    year: "2024",
    sectorId: "hospitality",
    scope: { en: "Heritage-sensitive interior fit-out and MEP", ar: "تجهيز داخلي وMEP حساس للتراث" },
    summary: {
      en: "70-key boutique hotel within the Diriyah heritage precinct, blending Najdi architectural language with contemporary luxury finishes and full smart room platform.",
      ar: "فندق بوتيكي بـ 70 مفتاحاً داخل منطقة التراث في الدرعية، يمزج اللغة المعمارية النجدية مع التشطيبات الفاخرة المعاصرة ومنصة غرفة ذكية كاملة.",
    },
    highlights: [
      { en: "Heritage-compliant Najdi exterior", ar: "واجهة نجدية متوافقة مع التراث" },
      { en: "70 keys + spa + 3 F&B venues", ar: "70 مفتاحاً + سبا + 3 منافذ F&B" },
    ],
    serviceSlugs: ["smart-room-solutions", "kitchen-laundry-equipment", "decoration-artwork", "wall-floor-coverings", "audio-video-systems", "hospitality-signage-wayfinding"],
    image: "img/sector-hospitality.png",
    gallery: ["img/sector-hospitality.png"],
  },
  {
    id: "5",
    slug: "jeddah-corniche-mixed-use",
    title: { en: "Jeddah Corniche Mixed-Use Pavilion", ar: "جناح متعدد الاستخدامات في كورنيش جدة" },
    client: { en: "Western Region developer", ar: "مطور المنطقة الغربية" },
    location: { en: "Jeddah Corniche, Jeddah", ar: "كورنيش جدة، جدة" },
    city: "Jeddah",
    year: "2023",
    sectorId: "commercial",
    scope: { en: "Facade, MEP, retail fit-out", ar: "واجهة، MEP، تجهيز تجزئة" },
    summary: { en: "Premium retail and F&B pavilion with marine-grade glazing facade and full MEP delivery.", ar: "جناح تجزئة و F&B ممتاز بواجهة تزجيج بحرية و MEP كامل." },
    highlights: [{ en: "12,000 m² leasable area", ar: "12000 م² مساحة قابلة للتأجير" }, { en: "Marine-grade facade", ar: "واجهة بحرية" }],
    serviceSlugs: ["aluminum-steel-glazing", "hvac-systems", "electrical-systems", "lighting-switches-sockets"],
    image: "img/sector-commercial.png",
    gallery: ["img/sector-commercial.png"],
  },
  {
    id: "6",
    slug: "riyadh-palace-residence",
    title: { en: "Riyadh Royal Family Palace", ar: "قصر عائلي في الرياض" },
    client: { en: "Private royal client", ar: "عميل خاص" },
    location: { en: "Northern Riyadh", ar: "شمال الرياض" },
    city: "Riyadh",
    year: "2025",
    sectorId: "residential",
    scope: { en: "Full turnkey palace finishing", ar: "تشطيب قصر متكامل" },
    summary: { en: "8,000 m² palace including imported Italian marble, Lalique chandeliers, custom joinery, full smart-home platform, and Olympic-size pool.", ar: "قصر بمساحة 8000 م² يشمل رخاماً إيطالياً مستورداً وثرياتLalique ونجارة مخصصة ومنصة منزل ذكية كاملة ومسبحاً بحجم أولمبي." },
    highlights: [{ en: "8,000 m² across 3 wings", ar: "8000 م² عبر 3 أجنحة" }, { en: "Imported Italian Calacatta marble", ar: "رخام كالاكاتا إيطالي مستورد" }, { en: "Olympic-size indoor pool", ar: "مسبح داخلي بحجم أولمبي" }],
    serviceSlugs: ["wall-floor-coverings", "windows-and-doors", "aluminum-steel-glazing", "smart-room-solutions", "lighting-switches-sockets", "swimming-pool-systems", "audio-video-systems", "bathroom-solutions"],
    image: "img/sector-residential.png",
    gallery: ["img/sector-residential.png"],
  },
  {
    id: "7",
    slug: "alula-resort-spa",
    title: { en: "AlUla Heritage Resort & Spa", ar: "منتجع وسبا تراث العلا" },
    client: { en: "Luxury resort operator", ar: "مشغل منتجع فاخر" },
    location: { en: "AlUla, Madinah Region", ar: "العلا، منطقة المدينة" },
    city: "AlUla",
    year: "2025",
    sectorId: "hospitality",
    scope: { en: "Spa, F&B, OS&E, FF&E", ar: "سبا، F&B، OS&E، FF&E" },
    summary: { en: "Sustainable desert resort with spa, three F&B venues, and complete OS&E procurement aligned to AlUla heritage standards.", ar: "منتجع صحراوي مستدام مع سبا وثلاث منافذ F&B وشراء OS&E كامل يتماشى مع معايير تراث العلا." },
    highlights: [{ en: "Sustainable desert architecture", ar: "عمارة صحراوية مستدامة" }, { en: "100% locally-procured OS&E", ar: "OS&E مشترى محلياً 100%" }],
    serviceSlugs: ["hospitality-supplies", "decoration-artwork", "kitchen-laundry-equipment", "fitness-equipment", "outdoor-landscape-solutions"],
    image: "img/sector-hospitality.png",
    gallery: ["img/sector-hospitality.png"],
  },
  {
    id: "8",
    slug: "dammam-medical-tower",
    title: { en: "Dammam Specialty Medical Tower", ar: "برج طبي تخصصي في الدمام" },
    client: { en: "Eastern Province health group", ar: "مجموعة صحية في المنطقة الشرقية" },
    location: { en: "Dammam, Eastern Province", ar: "الدمام، المنطقة الشرقية" },
    city: "Dammam",
    year: "2024",
    sectorId: "infrastructure",
    scope: { en: "MEP, fire, special equipment", ar: "MEP، حريق، معدات خاصة" },
    summary: { en: "300-bed specialty medical tower MEP engineering including imaging shielding, medical gases, isolation rooms, and Civil Defense-certified fire protection.", ar: "هندسة MEP لبرج طبي تخصصي بـ 300 سرير تشمل حماية التصوير والغازات الطبية وغرف العزل والحماية من الحرائق المعتمدة من الدفاع المدني." },
    highlights: [{ en: "300 beds + ICU + 8 ORs", ar: "300 سرير + ICU + 8 غرف عمليات" }, { en: "Joint Commission International ready", ar: "جاهز للجنة المشتركة الدولية" }],
    serviceSlugs: ["hvac-systems", "fire-protection-systems", "electrical-systems", "water-supply-drainage", "special-equipment", "security-systems"],
    image: "img/sector-infrastructure.png",
    gallery: ["img/sector-infrastructure.png"],
  },
  {
    id: "9",
    slug: "khobar-corporate-hq",
    title: { en: "Khobar Energy Corporate Headquarters", ar: "المقر الرئيسي لشركة طاقة في الخبر" },
    client: { en: "Saudi energy major", ar: "شركة طاقة سعودية كبرى" },
    location: { en: "Khobar, Eastern Province", ar: "الخبر، المنطقة الشرقية" },
    city: "Khobar",
    year: "2023",
    sectorId: "commercial",
    scope: { en: "C-suite floors, AV, security, smart office", ar: "طوابق C-suite، AV، أمن، مكتب ذكي" },
    summary: { en: "Bespoke executive floor program for a Saudi energy major including conference theatre, executive dining, and SCIF-grade security room.", ar: "برنامج طوابق تنفيذية مخصصة لشركة طاقة سعودية كبرى يشمل مسرح المؤتمرات، تناول الطعام التنفيذي، وغرفة أمن بدرجة SCIF." },
    highlights: [{ en: "5,500 m² executive floors", ar: "5500 م² طوابق تنفيذية" }, { en: "Reference Crestron AV system", ar: "نظام Crestron AV مرجعي" }],
    serviceSlugs: ["audio-video-systems", "indoor-outdoor-furniture", "security-systems", "wall-floor-coverings", "lighting-switches-sockets"],
    image: "img/sector-commercial.png",
    gallery: ["img/sector-commercial.png"],
  },
  {
    id: "10",
    slug: "qiddiya-entertainment-pavilion",
    title: { en: "Qiddiya Entertainment Anchor", ar: "مرساة الترفيه في القدية" },
    client: { en: "Qiddiya entertainment brand", ar: "علامة ترفيه القدية" },
    location: { en: "Qiddiya, Riyadh", ar: "القدية، الرياض" },
    city: "Riyadh",
    year: "2025",
    sectorId: "infrastructure",
    scope: { en: "Wayfinding, AV, F&B kitchens, special equipment", ar: "إرشاد الاتجاهات، AV، مطابخ F&B، معدات خاصة" },
    summary: { en: "Multi-venue entertainment anchor with bilingual wayfinding, themed F&B kitchens, immersive AV, and specialty themed-attractions equipment.", ar: "مرساة ترفيه متعددة الأماكن مع إرشاد اتجاهات ثنائي اللغة، مطابخ F&B بطابع، AV غامر، ومعدات معالم متخصصة." },
    highlights: [{ en: "8 themed F&B venues", ar: "8 منافذ F&B بطابع" }, { en: "Bilingual wayfinding throughout", ar: "إرشاد اتجاهات ثنائي اللغة في جميع الأنحاء" }],
    serviceSlugs: ["hospitality-signage-wayfinding", "audio-video-systems", "kitchen-laundry-equipment", "special-equipment", "decoration-artwork"],
    image: "img/sector-infrastructure.png",
    gallery: ["img/sector-infrastructure.png"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
