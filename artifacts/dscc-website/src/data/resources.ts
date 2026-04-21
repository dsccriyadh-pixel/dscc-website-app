import type { BilingualString } from "./services";

export interface Resource {
  id: string;
  slug: string;
  title: BilingualString;
  excerpt: BilingualString;
  body: BilingualString;
  date: string;
  author: BilingualString;
  category: BilingualString;
  relatedServices: string[];
  image: string;
}

export const resources: Resource[] = [
  {
    id: "1",
    slug: "hvac-design-for-red-sea-humidity",
    title: { en: "HVAC Design for Red Sea Coastal Humidity", ar: "تصميم التكييف لرطوبة سواحل البحر الأحمر" },
    excerpt: { en: "How DSCC engineers HVAC systems that survive 90% relative humidity, salt air, and 45°C ambient temperatures across Red Sea hospitality projects.", ar: "كيف يصمم مهندسو دي إس سي سي أنظمة تكييف تتحمل رطوبة نسبية 90% وهواء مالح ودرجات حرارة محيطة 45°م في مشاريع ضيافة البحر الأحمر." },
    body: {
      en: "The Red Sea Project, Amaala, and the entire Tabuk coastal corridor present one of the world's most aggressive HVAC environments. Sustained relative humidity above 80%, ambient temperatures peaking at 45°C, and salt-laden marine air conspire to corrode coils, foul ducts, and degrade refrigerant lines within months on a poorly-engineered system.\n\nDSCC's coastal HVAC playbook starts with material selection. Every air-handling unit gets coastal-marine epoxy coil coatings, 316L stainless steel cabinet fasteners, and sacrificial zinc anodes on every refrigerant line set. We specify oversized condensate trays with UV sterilization to manage the constant moisture load, and we route fresh-air intakes well above the salt-spray zone.\n\nOn the design side, we engineer dedicated outdoor air systems (DOAS) with desiccant-wheel dehumidification rather than relying on a single overworked AHU. This approach decouples latent and sensible cooling, letting us hit 50% interior RH at 23°C while burning 20-30% less energy than a comparable single-coil approach. Energy recovery wheels and run-around coils further reduce the central plant load.\n\nFor villa pool houses and overwater pavilions, we add corrosion-monitoring sensors to BMS dashboards so operators see early-warning indicators. Coupled with 12-month coastal maintenance contracts, this engineering discipline is what lets DSCC issue 5-year coastal performance warranties on equipment that competitors will only warranty for 12 months.",
      ar: "يقدم مشروع البحر الأحمر وأمالا والممر الساحلي بأكمله في تبوك واحدة من أكثر بيئات التكييف عدوانية في العالم. الرطوبة النسبية المستمرة فوق 80%، ودرجات الحرارة المحيطة التي تصل ذروتها إلى 45°م، والهواء البحري المحمل بالملح يتآمر لتآكل الملفات وتلويث القنوات وتدهور خطوط التبريد في غضون أشهر على نظام مصمم بشكل سيء.\n\nيبدأ دليل التكييف الساحلي لـ دي إس سي سي باختيار المواد. تحصل كل وحدة معالجة هواء على طلاءات إيبوكسي بحرية ساحلية لملفاتها، ومثبتات خزانة من الفولاذ المقاوم للصدأ 316L، وأنودات زنك تضحية على كل مجموعة خطوط مبردات. نحدد صواني تكثيف كبيرة الحجم مع تعقيم بالأشعة فوق البنفسجية لإدارة الحمل الرطوبي المستمر، ونوجه مداخل الهواء النقي أعلى بكثير من منطقة رذاذ الملح.",
    },
    date: "2025-09-12",
    author: { en: "DSCC MEP Engineering Team", ar: "فريق هندسة MEP في دي إس سي سي" },
    category: { en: "Engineering", ar: "هندسة" },
    relatedServices: ["hvac-systems", "building-automation-systems"],
    image: "assets/uploads/media-uploader/cover041693834210.jpg",
  },
  {
    id: "2",
    slug: "vision-2030-hospitality-fitout-trends",
    title: { en: "Vision 2030: Hospitality Fit-Out Trends Reshaping the Kingdom", ar: "رؤية 2030: اتجاهات تجهيز الضيافة التي تعيد تشكيل المملكة" },
    excerpt: { en: "From NEOM hotels to Diriyah heritage retreats, here are the five fit-out trends DSCC is delivering on across Saudi Arabia in 2025-2026.", ar: "من فنادق نيوم إلى منتجعات تراث الدرعية، إليك خمسة اتجاهات تجهيز تقدمها دي إس سي سي في جميع أنحاء المملكة في 2025-2026." },
    body: {
      en: "Saudi Arabia's hospitality pipeline now exceeds 320,000 keys under development across NEOM, Red Sea, AlUla, Diriyah, and the major urban centers. Five fit-out trends are shaping how these projects come to life.\n\n1. Heritage-modern hybrids. Operators want guestrooms that feel rooted in Najdi, Hijazi, or Asiri vernacular while delivering 5-star comfort. DSCC has built mockup rooms with hand-carved gypsum, traditional palm-frond ceiling treatments, and contemporary smart-room platforms hidden behind heritage finishes.\n\n2. Smart room as standard. Brand technical services teams now specify scene-based lighting, voice control, and PMS-integrated do-not-disturb as table stakes. We deliver branded smart room platforms certified to Marriott, Hilton, IHG, Accor, and Rotana standards.\n\n3. Sustainability beyond LEED. Mostadam credits, locally-procured FF&E, and on-site water recycling are becoming non-negotiable. Our 'AlUla Heritage Resort' project achieved 100% local OS&E sourcing and 40% greywater reuse for irrigation.\n\n4. Outdoor living amplified. Resort guests now spend more time outdoors than indoors. Pool decks, beachfronts, and rooftop bars need salt-tolerant furniture, smart shading, and integrated misting systems engineered for 50°C summer days.\n\n5. F&B as the front door. Branded restaurants and chef-driven concepts often drive room rates. We've delivered turnkey F&B fit-out — kitchen lines, hood plenums, AV, and joinery — in under 14 weeks for fast-track openings.",
      ar: "تتجاوز خط أنابيب الضيافة في المملكة العربية السعودية الآن 320,000 مفتاح قيد التطوير عبر نيوم والبحر الأحمر والعلا والدرعية والمراكز الحضرية الرئيسية. تشكل خمسة اتجاهات تجهيز كيفية تحقيق هذه المشاريع.",
    },
    date: "2025-08-04",
    author: { en: "DSCC Hospitality Studio", ar: "استوديو الضيافة في دي إس سي سي" },
    category: { en: "Hospitality", ar: "الضيافة" },
    relatedServices: ["smart-room-solutions", "indoor-outdoor-furniture", "decoration-artwork", "hospitality-supplies"],
    image: "assets/uploads/media-uploader/hilton-swiss-palms1694250386.jpg",
  },
  {
    id: "3",
    slug: "smart-room-standards-ksa-5-star",
    title: { en: "Smart Room Standards for 5-Star Hotels in KSA", ar: "معايير الغرف الذكية للفنادق الخمس نجوم في المملكة" },
    excerpt: { en: "What 'smart' actually means when global brands certify your guestroom mockup in Riyadh.", ar: "ما الذي يعنيه 'الذكي' فعلياً عندما تعتمد العلامات العالمية غرفة نموذجية في الرياض." },
    body: {
      en: "The phrase 'smart room' is overused, but the brand technical services teams at Marriott, Hilton, IHG, and Accor have very specific definitions when they sign off a mockup room. Here's what we routinely deliver.\n\nFirst, lighting must be scene-based — not just dimmable. Welcome, Read, Movie, Romance, and Goodnight scenes are configured at room commissioning and triggered from a bedside panel, voice command, or the brand mobile app. We use DALI or Casambi backbones for fade fidelity.\n\nSecond, climate must be occupancy-aware. PIR or millimeter-wave sensors set back the HVAC by 3°C when the guest leaves the room and recover within 90 seconds when they re-enter. This typically cuts guestroom HVAC energy by 22-28% annually.\n\nThird, drapes and sheers should be motorized and mapped to scenes. Hidden tracks, near-silent motors, and opening/closing speed calibrated to feel cinematic — not industrial.\n\nFourth, the in-room TV must integrate with PMS for personalized welcome screens, billing, and room service ordering. We typically deploy Samsung or LG hospitality TVs with brand CMS overlays.\n\nFifth, do-not-disturb and make-up-room must be soft-button only — no door hangers. The signal flows to BMS, housekeeping mobile devices, and the guest service portal in real time. This single feature dramatically improves guest satisfaction scores.",
      ar: "عبارة 'غرفة ذكية' مستخدمة بكثرة، ولكن فرق الخدمات الفنية للعلامات التجارية في ماريوت وهيلتون و IHG وأكور لديها تعريفات محددة جداً عند اعتماد غرفة نموذجية.",
    },
    date: "2025-06-18",
    author: { en: "DSCC Smart Systems Practice", ar: "ممارسة الأنظمة الذكية في دي إس سي سي" },
    category: { en: "Smart & Tech", ar: "ذكي وتقني" },
    relatedServices: ["smart-room-solutions", "audio-video-systems", "building-automation-systems"],
    image: "assets/uploads/media-uploader/cover021693834064.jpg",
  },
  {
    id: "4",
    slug: "facade-glazing-saudi-extreme-heat",
    title: { en: "Façade Glazing Engineered for Saudi Extreme Heat", ar: "زجاج الواجهات المصمم لحرارة المملكة الشديدة" },
    excerpt: { en: "Solar gain control, glass selection, and thermal break strategies for Saudi facades that perform — and look incredible.", ar: "التحكم في الكسب الشمسي واختيار الزجاج واستراتيجيات الفواصل الحرارية للواجهات السعودية." },
    body: {
      en: "A glass tower in Riyadh in July faces 1,000+ W/m² of direct solar gain on the south and west facades. Engineering this exposure without turning the interior into an unhabitable greenhouse — or driving up cooling costs by 40% — requires a layered facade strategy.\n\nWe start with a low solar heat gain coefficient (SHGC) glass package. For Saudi commercial work, SHGC of 0.22-0.28 paired with a visible light transmittance of 50-65% gives clients daylight without thermal punishment. We typically specify a soft-coat low-E on surface 2 of an insulated glazing unit, with argon gas fill and a warm-edge spacer.\n\nNext, the aluminum framing must use polyamide thermal breaks rated to U-value 1.4 W/m²K or better. Without this, the frame becomes a thermal bridge that defeats the high-performance glass. For ultra-luxury work, we move to triple-glazed units with two low-E coatings, achieving overall U-values below 1.0.\n\nWe also engineer external shading — fritted patterns, projecting fins, or perforated screens — that dramatically reduce solar gain on south and west exposures. A well-designed external shading device can outperform a more expensive low-SHGC glass package while preserving views and daylight.\n\nFinally, we integrate facade performance with the BMS so operators can monitor surface temperatures, condensation risk, and thermal stress in real time. This data feeds maintenance schedules and validates warranty claims when needed.",
      ar: "يواجه برج زجاجي في الرياض في يوليو أكثر من 1000 واط/م² من الكسب الشمسي المباشر على الواجهات الجنوبية والغربية.",
    },
    date: "2025-05-02",
    author: { en: "DSCC Envelope Engineering", ar: "هندسة الأغلفة في دي إس سي سي" },
    category: { en: "Engineering", ar: "هندسة" },
    relatedServices: ["aluminum-steel-glazing", "windows-and-doors"],
    image: "img/hero-skyline.png",
  },
  {
    id: "5",
    slug: "civil-defense-fire-protection-saudi",
    title: { en: "Civil Defense Approvals: A Fire Protection Field Guide", ar: "موافقات الدفاع المدني: دليل ميداني للحماية من الحريق" },
    excerpt: { en: "How DSCC consultants secure GDCD/SCD approvals on the first submission for hotels, hospitals, and high-rises.", ar: "كيف يحصل استشاريو دي إس سي سي على موافقات الدفاع المدني السعودي من أول تقديم." },
    body: {
      en: "Every commercial, hospitality, healthcare, and residential project in Saudi Arabia above a defined occupancy threshold requires General Directorate of Civil Defense (GDCD) approval before occupancy. The approval window — and re-submission delays — can easily push a project's opening by 6-12 weeks if not handled correctly from day one.\n\nDSCC's fire protection consultants work to a single goal: first-submission approval. We achieve this with three disciplines.\n\nFirst, early code mapping. Within the first design week, we lock down NFPA 13/14/20/72/101, IFC, and SBC fire applicability for the project, document occupancy classifications, and align the architect's egress plan with code-mandated travel distances. This prevents costly redesign later.\n\nSecond, addressable systems with documented programming. Our addressable Honeywell, Notifier, and Siemens panels arrive on-site with full point lists, cause-and-effect matrices, and shop-tested programming. GDCD inspectors love clean documentation; we provide it before they ask.\n\nThird, integrated commissioning. Sprinkler hydraulics, fire pumps, smoke management, gas suppression, and panel I/O are commissioned as a single integrated test sequence — not as siloed disciplines. The witness test passes the first time because everything was tested against itself before the inspector arrived.",
      ar: "يتطلب كل مشروع تجاري وضيافة ورعاية صحية وسكني في المملكة العربية السعودية فوق حد إشغال محدد موافقة المديرية العامة للدفاع المدني (GDCD) قبل الإشغال.",
    },
    date: "2025-03-21",
    author: { en: "DSCC Fire Protection Practice", ar: "ممارسة الحماية من الحريق في دي إس سي سي" },
    category: { en: "Compliance", ar: "الامتثال" },
    relatedServices: ["fire-protection-systems", "security-systems"],
    image: "img/sector-infrastructure.png",
  },
];

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}
