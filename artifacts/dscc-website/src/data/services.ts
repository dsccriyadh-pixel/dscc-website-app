export interface BilingualString {
  en: string;
  ar: string;
}

export interface Faq {
  q: BilingualString;
  a: BilingualString;
}

export interface Service {
  id: string;
  slug: string;
  category: string;
  iconKey: string;
  name: BilingualString;
  tagline: BilingualString;
  overview: BilingualString;
  features: BilingualString[];
  useCases: BilingualString[];
  faqs: Faq[];
  sectors: string[];
}

export const serviceCategories: { key: string; name: BilingualString }[] = [
  { key: "Architecture & Envelope", name: { en: "Architecture & Envelope", ar: "العمارة والواجهات" } },
  { key: "MEP", name: { en: "MEP Engineering", ar: "الهندسة الميكانيكية والكهربائية" } },
  { key: "Smart & Tech", name: { en: "Smart & Technology", ar: "التقنيات الذكية" } },
  { key: "Hospitality", name: { en: "Hospitality Solutions", ar: "حلول الضيافة" } },
  { key: "Outdoor & Lifestyle", name: { en: "Outdoor & Lifestyle", ar: "الخارج وأسلوب الحياة" } },
];

const allSectors = ["residential", "commercial", "hospitality", "infrastructure"];

export const services: Service[] = [
  {
    id: "1",
    slug: "aluminum-steel-glazing",
    category: "Architecture & Envelope",
    iconKey: "Building2",
    name: { en: "Aluminum & Steel Glazing", ar: "زجاج الألمنيوم والصلب" },
    tagline: { en: "Premium architectural facades engineered for the Saudi climate.", ar: "واجهات معمارية راقية مصممة للمناخ السعودي." },
    overview: {
      en: "DSCC delivers high-performance aluminum and steel glazing systems for towers, hotels, villas, and public infrastructure. Our facades combine thermal efficiency, acoustic comfort, and architectural drama, engineered to withstand extreme GCC heat and dust.",
      ar: "تقدم دي إس سي سي أنظمة زجاج عالية الأداء من الألمنيوم والصلب للأبراج والفنادق والفلل ومرافق البنية التحتية العامة. تجمع واجهاتنا بين الكفاءة الحرارية والراحة الصوتية والتأثير المعماري اللافت، وهي مصممة لتحمل الحرارة والغبار القاسيين في دول الخليج.",
    },
    features: [
      { en: "Curtain wall, structural and unitized facade systems", ar: "أنظمة الحوائط الستائرية والإنشائية والموحدة" },
      { en: "Triple-glazed thermal performance up to U-value 1.0", ar: "زجاج ثلاثي بأداء حراري حتى قيمة U تصل إلى 1.0" },
      { en: "Acoustic glazing rated up to 45 dB attenuation", ar: "زجاج صوتي بتخفيف يصل إلى 45 ديسيبل" },
      { en: "Custom anodized & PVDF aluminum finishes", ar: "تشطيبات ألمنيوم مؤكسد و PVDF مخصصة" },
      { en: "Hurricane and sandstorm resistant assemblies", ar: "تجميعات مقاومة للأعاصير والعواصف الرملية" },
    ],
    useCases: [
      { en: "Commercial towers and corporate HQs", ar: "الأبراج التجارية والمقرات الرئيسية للشركات" },
      { en: "5-star hotel and resort envelopes", ar: "واجهات الفنادق والمنتجعات الراقية" },
      { en: "Luxury villa and palace skylights", ar: "فتحات سقفية الفلل والقصور الراقية" },
    ],
    faqs: [
      { q: { en: "What materials and certifications do you use?", ar: "ما هي المواد والشهادات التي تستخدمونها؟" }, a: { en: "We use aerospace-grade aluminum alloys and structural steel certified to EN, ASTM, and SASO standards.", ar: "نستخدم سبائك الألمنيوم بدرجة الطيران والفولاذ الإنشائي المعتمد وفقاً لمعايير EN و ASTM و SASO." } },
      { q: { en: "Can you handle design-build delivery?", ar: "هل يمكنكم تقديم التصميم والتنفيذ معاً؟" }, a: { en: "Yes — our in-house design team works alongside fabrication and installation crews for full turnkey delivery.", ar: "نعم — يعمل فريق التصميم الداخلي لدينا جنباً إلى جنب مع فريق التصنيع والتركيب لتسليم متكامل." } },
      { q: { en: "Do you provide post-handover maintenance?", ar: "هل تقدمون صيانة بعد التسليم؟" }, a: { en: "Yes, we offer 1-, 3-, and 5-year facade maintenance programs across the Kingdom.", ar: "نعم، نقدم برامج صيانة واجهات لمدة سنة وثلاث وخمس سنوات في جميع أنحاء المملكة." } },
      { q: { en: "What is your typical lead time?", ar: "ما هو الوقت المعتاد للتسليم؟" }, a: { en: "10-16 weeks depending on facade complexity and quantity.", ar: "من 10 إلى 16 أسبوعاً حسب تعقيد الواجهة والكمية." } },
    ],
    sectors: allSectors,
  },
  {
    id: "2",
    slug: "indoor-outdoor-furniture",
    category: "Hospitality",
    iconKey: "Sofa",
    name: { en: "Indoor & Outdoor Furniture", ar: "الأثاث الداخلي والخارجي" },
    tagline: { en: "Bespoke furniture for hotels, residences, and public spaces.", ar: "أثاث مخصص للفنادق والمساكن والمساحات العامة." },
    overview: {
      en: "From custom hotel guestroom packages to landscape lounge furniture, DSCC sources, designs, and installs furniture programs that perform in luxury environments and Saudi outdoor conditions alike.",
      ar: "من حزم غرف الفنادق المخصصة إلى أثاث الصالات الخارجية، تقوم دي إس سي سي بتوريد وتصميم وتركيب برامج الأثاث التي تعمل في البيئات الراقية وظروف السعودية الخارجية على حد سواء.",
    },
    features: [
      { en: "FF&E packages and case goods for hotels", ar: "حزم FF&E والأثاث الجاهز للفنادق" },
      { en: "UV- and salt-resistant outdoor seating", ar: "مقاعد خارجية مقاومة للأشعة فوق البنفسجية والملح" },
      { en: "European tannery leathers and certified upholstery", ar: "جلود من المدابغ الأوروبية وتنجيد معتمد" },
      { en: "On-site upholstery and finishing studio", ar: "ورشة تنجيد وتشطيب في الموقع" },
    ],
    useCases: [
      { en: "Hotel guestrooms and suites", ar: "غرف وأجنحة الفنادق" },
      { en: "Resort pool decks and beachfronts", ar: "أسطح المسابح والواجهات البحرية للمنتجعات" },
      { en: "Corporate breakout and boardrooms", ar: "غرف الاجتماعات وقاعات الاستراحة للشركات" },
    ],
    faqs: [
      { q: { en: "Do you supply mockup rooms?", ar: "هل توفرون غرف نموذجية؟" }, a: { en: "Yes — fully dressed mockup rooms within 6 weeks of approved design.", ar: "نعم — غرف نموذجية مفروشة بالكامل خلال 6 أسابيع من الموافقة على التصميم." } },
      { q: { en: "Can we change finishes after sign-off?", ar: "هل يمكن تغيير التشطيبات بعد الاعتماد؟" }, a: { en: "Limited changes within fabrication tolerances; we coordinate via formal change orders.", ar: "تغييرات محدودة ضمن نطاق التصنيع؛ نقوم بالتنسيق عبر أوامر تغيير رسمية." } },
    ],
    sectors: ["hospitality", "commercial", "residential"],
  },
  {
    id: "3",
    slug: "windows-and-doors",
    category: "Architecture & Envelope",
    iconKey: "DoorOpen",
    name: { en: "Windows & Doors", ar: "النوافذ والأبواب" },
    tagline: { en: "Engineered openings with luxury hardware.", ar: "فتحات هندسية بأجهزة راقية." },
    overview: { en: "Premium aluminum, timber, and steel windows and doors with German hardware, sound and thermal performance, and architectural-grade finishes.", ar: "نوافذ وأبواب راقية من الألمنيوم والخشب والصلب مع أجهزة ألمانية وأداء صوتي وحراري وتشطيبات معمارية." },
    features: [
      { en: "Lift-and-slide and pivot doors up to 4m height", ar: "أبواب رفع وانزلاق ومحورية بارتفاع يصل إلى 4 أمتار" },
      { en: "Sound rated to 42 dB Rw", ar: "تصنيف صوتي حتى 42 ديسيبل" },
      { en: "Hidden frame and minimal-sightline systems", ar: "أنظمة بإطار مخفي وخطوط رؤية ضيقة" },
      { en: "Smart locking and access control ready", ar: "جاهزة للأقفال الذكية والتحكم في الوصول" },
    ],
    useCases: [
      { en: "Luxury villas and palaces", ar: "الفلل والقصور الراقية" },
      { en: "Hotel guestroom doors", ar: "أبواب غرف الفنادق" },
      { en: "Office and retail entrances", ar: "مداخل المكاتب والتجزئة" },
    ],
    faqs: [
      { q: { en: "Are your systems Saudi Building Code compliant?", ar: "هل أنظمتكم متوافقة مع كود البناء السعودي؟" }, a: { en: "Yes, all systems are SBC compliant and fire-rated where required.", ar: "نعم، جميع الأنظمة متوافقة مع كود البناء السعودي ومصنفة ضد الحريق حيثما لزم الأمر." } },
    ],
    sectors: allSectors,
  },
  {
    id: "4",
    slug: "lighting-switches-sockets",
    category: "MEP",
    iconKey: "Lightbulb",
    name: { en: "Lighting, Switches & Sockets", ar: "الإضاءة والمفاتيح والمقابس" },
    tagline: { en: "Architectural lighting and premium wiring devices.", ar: "إضاءة معمارية وأجهزة توصيل ممتازة." },
    overview: { en: "Architectural lighting design and supply paired with premium European wiring devices for residential, hospitality, and commercial environments.", ar: "تصميم وتوريد الإضاءة المعمارية مع أجهزة توصيل أوروبية ممتازة للبيئات السكنية والضيافة والتجارية." },
    features: [
      { en: "Lighting design with photometric modeling", ar: "تصميم إضاءة مع نمذجة فوتومترية" },
      { en: "DALI, KNX, and Casambi compatible", ar: "متوافق مع DALI و KNX و Casambi" },
      { en: "Schneider, Legrand, ABB devices", ar: "أجهزة شنايدر وليجراند و ABB" },
    ],
    useCases: [
      { en: "Hotel mood lighting scenes", ar: "مشاهد إضاءة الفنادق" },
      { en: "Villa landscape lighting", ar: "إضاءة المناظر الطبيعية للفيلات" },
    ],
    faqs: [
      { q: { en: "Can you integrate with our existing BMS?", ar: "هل يمكن التكامل مع نظام إدارة المباني الحالي؟" }, a: { en: "Yes via BACnet, KNX, or Modbus gateways.", ar: "نعم عبر بوابات BACnet أو KNX أو Modbus." } },
    ],
    sectors: allSectors,
  },
  {
    id: "5",
    slug: "wall-floor-coverings",
    category: "Architecture & Envelope",
    iconKey: "LayoutPanelTop",
    name: { en: "Wall & Floor Coverings", ar: "تغطيات الجدران والأرضيات" },
    tagline: { en: "Marble, stone, wood, and tile across Saudi luxury interiors.", ar: "الرخام والحجر والخشب والبلاط في الديكورات السعودية الراقية." },
    overview: { en: "End-to-end supply and installation of architectural marble, natural stone, engineered wood, and large-format tile from quarries and mills across Italy, Turkey, and Spain.", ar: "توريد وتركيب شامل للرخام المعماري والحجر الطبيعي والخشب الهندسي والبلاط كبير الحجم من المحاجر والمصانع في إيطاليا وتركيا وإسبانيا." },
    features: [
      { en: "Stone slab matching and book-matching", ar: "مطابقة ألواح الحجر والمطابقة المتماثلة" },
      { en: "Underfloor heating compatible", ar: "متوافق مع التدفئة تحت الأرضية" },
      { en: "Slip-resistant pool deck systems", ar: "أنظمة أسطح مسابح مقاومة للانزلاق" },
    ],
    useCases: [
      { en: "Hotel lobbies and ballrooms", ar: "ردهات الفنادق وقاعات الحفلات" },
      { en: "Palace floors and walls", ar: "أرضيات وجدران القصور" },
    ],
    faqs: [
      { q: { en: "Do you handle stone selection trips?", ar: "هل تنظمون رحلات اختيار الحجر؟" }, a: { en: "Yes, we organize quarry visits in Italy, Turkey, and Spain for owners and designers.", ar: "نعم، ننظم زيارات للمحاجر في إيطاليا وتركيا وإسبانيا للملاك والمصممين." } },
    ],
    sectors: ["hospitality", "residential", "commercial"],
  },
  {
    id: "6",
    slug: "hvac-systems",
    category: "MEP",
    iconKey: "Wind",
    name: { en: "HVAC Systems", ar: "أنظمة التكييف والتهوية" },
    tagline: { en: "Climate engineering for the Saudi extreme.", ar: "هندسة المناخ للظروف السعودية القاسية." },
    overview: { en: "VRF, chilled-water, and district cooling tie-ins for residential, hospitality, commercial, and infrastructure projects, engineered for Saudi temperatures and Red Sea humidity.", ar: "أنظمة VRF والمياه المبردة وروابط التبريد المركزي للمشاريع السكنية والضيافة والتجارية والبنية التحتية، مصممة لدرجات حرارة المملكة ورطوبة البحر الأحمر." },
    features: [
      { en: "VRF systems by Daikin, Mitsubishi, LG", ar: "أنظمة VRF من دايكين وميتسوبيشي وإل جي" },
      { en: "Air-cooled and water-cooled chillers", ar: "مبردات تبريد بالهواء والماء" },
      { en: "Fresh air handling with energy recovery", ar: "معالجة الهواء النقي مع استرداد الطاقة" },
      { en: "BMS-integrated controls", ar: "ضوابط متكاملة مع نظام إدارة المباني" },
    ],
    useCases: [
      { en: "Hotel central plants", ar: "محطات الفنادق المركزية" },
      { en: "Office tower VAV systems", ar: "أنظمة VAV لأبراج المكاتب" },
      { en: "Villa multi-split installations", ar: "تركيبات متعددة المنافذ للفلل" },
    ],
    faqs: [
      { q: { en: "Do you provide commissioning and TAB?", ar: "هل تقدمون التشغيل والاختبار والموازنة؟" }, a: { en: "Yes, full TAB and Cx services with documented reports.", ar: "نعم، خدمات TAB و Cx الكاملة مع تقارير موثقة." } },
      { q: { en: "How do you handle Red Sea coastal corrosion?", ar: "كيف تتعاملون مع التآكل الساحلي للبحر الأحمر؟" }, a: { en: "Marine-grade coatings, stainless fasteners, and sacrificial anodes on all coastal installs.", ar: "طلاءات بحرية ومثبتات ستانلس ستيل وأنودات تضحية على جميع التركيبات الساحلية." } },
    ],
    sectors: allSectors,
  },
  {
    id: "7",
    slug: "audio-video-systems",
    category: "Smart & Tech",
    iconKey: "Volume2",
    name: { en: "Audio / Video Systems", ar: "أنظمة الصوت والفيديو" },
    tagline: { en: "Reference AV for ballrooms, boardrooms, and home cinemas.", ar: "أنظمة AV مرجعية لقاعات الحفلات وغرف الاجتماعات والسينما المنزلية." },
    overview: { en: "Crestron, Lutron, Bose, and Dolby-grade AV design and installation for boardrooms, ballrooms, mosques, cinemas, and luxury home theatres.", ar: "تصميم وتركيب أنظمة AV من فئة كريستون ولوترون وبوز ودولبي لقاعات الاجتماعات والحفلات والمساجد والسينما والمسارح المنزلية الراقية." },
    features: [
      { en: "4K and 8K video distribution", ar: "توزيع فيديو 4K و 8K" },
      { en: "Dolby Atmos installations", ar: "تركيبات دولبي أتموس" },
      { en: "Conference and BYOD systems", ar: "أنظمة المؤتمرات و BYOD" },
    ],
    useCases: [
      { en: "Hotel ballrooms", ar: "قاعات الفنادق" },
      { en: "Corporate boardrooms", ar: "غرف اجتماعات الشركات" },
      { en: "Private home cinemas", ar: "السينما المنزلية الخاصة" },
    ],
    faqs: [
      { q: { en: "Do you provide post-handover support?", ar: "هل تقدمون الدعم بعد التسليم؟" }, a: { en: "Yes, 24/7 remote and onsite support packages.", ar: "نعم، حزم دعم عن بُعد وفي الموقع على مدار الساعة." } },
    ],
    sectors: ["hospitality", "commercial", "residential"],
  },
  {
    id: "8",
    slug: "building-automation-systems",
    category: "Smart & Tech",
    iconKey: "Cpu",
    name: { en: "Building Automation Systems", ar: "أنظمة أتمتة المباني" },
    tagline: { en: "Unified BMS for energy-efficient buildings.", ar: "نظام إدارة مبانٍ موحد للمباني الموفرة للطاقة." },
    overview: { en: "Open-protocol BMS platforms (BACnet, Modbus, KNX) integrating HVAC, lighting, access, fire, and energy across single or multi-site portfolios.", ar: "منصات BMS مفتوحة البروتوكول (BACnet, Modbus, KNX) تدمج التكييف والإضاءة والوصول والحريق والطاقة عبر محافظ أحادية أو متعددة المواقع." },
    features: [
      { en: "Energy dashboards and benchmarking", ar: "لوحات معلومات الطاقة والمقارنات" },
      { en: "Tenant billing and metering", ar: "فوترة المستأجرين والقياس" },
      { en: "LEED and Mostadam-aligned analytics", ar: "تحليلات متوافقة مع LEED ومستدام" },
    ],
    useCases: [
      { en: "Office tower portfolios", ar: "محافظ أبراج المكاتب" },
      { en: "Hotel chains", ar: "سلاسل الفنادق" },
    ],
    faqs: [
      { q: { en: "Which BMS brands do you deploy?", ar: "ما هي العلامات التجارية لـ BMS التي تنشرونها؟" }, a: { en: "Honeywell, Siemens Desigo, Schneider EcoStruxure, and Johnson Controls Metasys.", ar: "هانيويل، سيمنز ديسيغو، شنايدر إيكوستراكشر، جونسون كنترولز ميتاسيس." } },
    ],
    sectors: ["commercial", "hospitality", "infrastructure"],
  },
  {
    id: "9",
    slug: "smart-room-solutions",
    category: "Smart & Tech",
    iconKey: "Smartphone",
    name: { en: "Smart Room Solutions", ar: "حلول الغرف الذكية" },
    tagline: { en: "Branded guest experiences for 5-star hospitality.", ar: "تجارب ضيافة مميزة للفنادق الخمس نجوم." },
    overview: { en: "Branded smart room platforms unifying lighting, drapes, climate, TV, and DND/MUR with PMS integration for major hotel brands.", ar: "منصات غرف ذكية مميزة توحد الإضاءة والستائر والمناخ والتلفزيون و DND/MUR مع تكامل PMS لكبرى علامات الفنادق التجارية." },
    features: [
      { en: "Marriott, Hilton, IHG, Accor brand standards", ar: "معايير علامات ماريوت، هيلتون، IHG، أكور" },
      { en: "Voice and tablet controls", ar: "تحكم صوتي وعبر الأجهزة اللوحية" },
      { en: "PMS, lock, and minibar integration", ar: "تكامل PMS والأقفال والميني بار" },
    ],
    useCases: [
      { en: "5-star hotel guestrooms", ar: "غرف الفنادق الخمس نجوم" },
      { en: "Branded serviced residences", ar: "المساكن الفندقية المميزة" },
    ],
    faqs: [
      { q: { en: "Do you certify to brand standards?", ar: "هل تشهدون وفقاً لمعايير العلامة التجارية؟" }, a: { en: "Yes — every room mockup is signed off by the brand technical services team.", ar: "نعم — يتم اعتماد كل غرفة نموذجية من قبل فريق الخدمات الفنية للعلامة التجارية." } },
    ],
    sectors: ["hospitality"],
  },
  {
    id: "10",
    slug: "kitchen-laundry-equipment",
    category: "Hospitality",
    iconKey: "ChefHat",
    name: { en: "Kitchen & Laundry Equipment", ar: "معدات المطابخ والمغاسل" },
    tagline: { en: "Commercial kitchen and laundry turnkey supply.", ar: "توريد متكامل لمعدات المطابخ والمغاسل التجارية." },
    overview: { en: "Hood, cooking, refrigeration, dishwashing, and laundry systems from Rational, Hobart, Electrolux Professional, and Miele Professional.", ar: "أنظمة الشفاطات والطبخ والتبريد وغسل الأطباق والمغاسل من راشيونال وهوبارت وإلكترولوكس وميلي." },
    features: [
      { en: "HACCP-compliant kitchen layouts", ar: "تخطيطات مطابخ متوافقة مع HACCP" },
      { en: "Energy-efficient cooking lines", ar: "خطوط طبخ موفرة للطاقة" },
    ],
    useCases: [
      { en: "Hotel central kitchens", ar: "مطابخ الفنادق المركزية" },
      { en: "Hospital catering", ar: "تغذية المستشفيات" },
    ],
    faqs: [
      { q: { en: "Do you provide chef-led commissioning?", ar: "هل تقدمون التشغيل بقيادة الطهاة؟" }, a: { en: "Yes — opening chefs validate every line before handover.", ar: "نعم — يتحقق الطهاة من كل خط قبل التسليم." } },
    ],
    sectors: ["hospitality", "commercial"],
  },
  {
    id: "11",
    slug: "security-systems",
    category: "Smart & Tech",
    iconKey: "Shield",
    name: { en: "Security Systems", ar: "أنظمة الأمن" },
    tagline: { en: "Integrated CCTV, access, and intrusion detection.", ar: "كاميرات مراقبة وأنظمة وصول وكشف اقتحام متكاملة." },
    overview: { en: "PSIM-integrated CCTV, access control, intrusion, and ANPR for hospitality, commercial, and critical infrastructure clients.", ar: "كاميرات مراقبة وأنظمة تحكم في الوصول والاقتحام و ANPR متكاملة مع PSIM لعملاء الضيافة والتجارة والبنية التحتية الحرجة." },
    features: [
      { en: "8K AI cameras with analytics", ar: "كاميرات 8K بالذكاء الاصطناعي مع تحليلات" },
      { en: "MOI-compliant retention and reporting", ar: "احتفاظ وتقارير متوافقة مع وزارة الداخلية" },
    ],
    useCases: [
      { en: "Hotel back-of-house", ar: "خلف الكواليس في الفنادق" },
      { en: "Commercial perimeters", ar: "محيط المنشآت التجارية" },
    ],
    faqs: [
      { q: { en: "Are systems MOI-approved?", ar: "هل الأنظمة معتمدة من وزارة الداخلية؟" }, a: { en: "Yes, fully compliant with Saudi MOI security standards.", ar: "نعم، متوافق تماماً مع معايير وزارة الداخلية السعودية." } },
    ],
    sectors: allSectors,
  },
  {
    id: "12",
    slug: "fire-protection-systems",
    category: "MEP",
    iconKey: "Flame",
    name: { en: "Fire Protection Systems", ar: "أنظمة الحماية من الحريق" },
    tagline: { en: "Civil Defense-certified fire detection and suppression.", ar: "كشف وإخماد حرائق معتمد من الدفاع المدني." },
    overview: { en: "NFPA and Saudi Civil Defense compliant addressable fire alarm, sprinkler, gas suppression, and kitchen suppression systems.", ar: "أنظمة إنذار حريق عنواني ورشاشات وإخماد بالغاز وإخماد المطابخ متوافقة مع NFPA والدفاع المدني السعودي." },
    features: [
      { en: "Addressable Honeywell, Notifier, Siemens panels", ar: "لوحات عنوانية من هانيويل ونوتيفاير وسيمنز" },
      { en: "FM-200 and Novec 1230 suppression", ar: "أنظمة إخماد FM-200 و Novec 1230" },
      { en: "Wet, dry, and pre-action sprinkler systems", ar: "أنظمة رشاشات رطبة وجافة وما قبل الفعل" },
    ],
    useCases: [
      { en: "Hospital and hotel atriums", ar: "ردهات المستشفيات والفنادق" },
      { en: "Data center clean agent", ar: "وكلاء نظيفون لمراكز البيانات" },
    ],
    faqs: [
      { q: { en: "Do you secure Civil Defense approvals?", ar: "هل تحصلون على موافقات الدفاع المدني؟" }, a: { en: "Yes, our consultants secure full GDCD/SCD approvals.", ar: "نعم، يحصل استشاريونا على الموافقات الكاملة من الدفاع المدني." } },
    ],
    sectors: allSectors,
  },
  {
    id: "13",
    slug: "electrical-systems",
    category: "MEP",
    iconKey: "Zap",
    name: { en: "Electrical Systems", ar: "الأنظمة الكهربائية" },
    tagline: { en: "MV/LV power and emergency systems.", ar: "أنظمة الطاقة المتوسطة/المنخفضة الجهد والطوارئ." },
    overview: { en: "Medium and low voltage distribution, emergency power, UPS, and lightning protection engineered to SEC and IEC standards.", ar: "توزيع الجهد المتوسط والمنخفض، الطاقة الاحتياطية، UPS، والحماية من الصواعق وفقاً لمعايير SEC و IEC." },
    features: [
      { en: "MV switchgear up to 33kV", ar: "مفاتيح متوسطة الجهد حتى 33 كيلو فولت" },
      { en: "Diesel generators and ATS", ar: "مولدات ديزل و ATS" },
      { en: "Earthing and lightning protection", ar: "التأريض والحماية من الصواعق" },
    ],
    useCases: [
      { en: "Hospital essential power", ar: "الطاقة الأساسية للمستشفيات" },
      { en: "Tower MV substations", ar: "محطات فرعية للأبراج" },
    ],
    faqs: [
      { q: { en: "Are you SEC-licensed contractors?", ar: "هل أنتم مقاولون مرخصون من SEC؟" }, a: { en: "Yes, fully SEC-licensed for HV/MV/LV work.", ar: "نعم، مرخصون بالكامل من SEC لأعمال الجهد العالي والمتوسط والمنخفض." } },
    ],
    sectors: allSectors,
  },
  {
    id: "14",
    slug: "bathroom-solutions",
    category: "Hospitality",
    iconKey: "ShowerHead",
    name: { en: "Bathroom Solutions", ar: "حلول الحمامات" },
    tagline: { en: "Designer bathware from European brands.", ar: "أدوات حمام مصممة من علامات تجارية أوروبية." },
    overview: { en: "Complete bathroom packages including ceramics, brassware, glass partitions, and mirrors from Duravit, Hansgrohe, Gessi, and Antoniolupi.", ar: "حزم حمامات كاملة تشمل الأدوات الصحية والصنابير والقواطع الزجاجية والمرايا من ديورافيت وهانسجروهي وجيسي وأنطونيوليبي." },
    features: [
      { en: "Hotel guest bathroom packages", ar: "حزم حمامات نزلاء الفنادق" },
      { en: "Custom vanities and stone tops", ar: "خزائن مخصصة وأسطح حجرية" },
    ],
    useCases: [
      { en: "Hotel rooms and spa wet areas", ar: "غرف الفنادق ومناطق السبا الرطبة" },
      { en: "Villa primary suites", ar: "أجنحة الفلل الرئيسية" },
    ],
    faqs: [{ q: { en: "Do you handle waterproofing?", ar: "هل تتعاملون مع العزل المائي؟" }, a: { en: "Yes, full tanking and warranty on all wet areas.", ar: "نعم، عزل كامل وضمان على جميع المناطق الرطبة." } }],
    sectors: ["hospitality", "residential", "commercial"],
  },
  {
    id: "15",
    slug: "water-supply-drainage",
    category: "MEP",
    iconKey: "Droplets",
    name: { en: "Water Supply & Drainage", ar: "إمدادات المياه والصرف" },
    tagline: { en: "Plumbing engineering for resilient buildings.", ar: "هندسة سباكة للمباني المرنة." },
    overview: { en: "Domestic and irrigation water, hot water generation, drainage, grey-water reuse, and pump room engineering.", ar: "المياه المنزلية والري، توليد المياه الساخنة، الصرف، إعادة استخدام المياه الرمادية، وهندسة غرف المضخات." },
    features: [{ en: "Booster pump packages", ar: "حزم مضخات تعزيز" }, { en: "Greywater reuse for irrigation", ar: "إعادة استخدام المياه الرمادية للري" }],
    useCases: [{ en: "High-rise risers", ar: "أنابيب الصعود في الأبراج" }, { en: "Resort irrigation networks", ar: "شبكات ري المنتجعات" }],
    faqs: [{ q: { en: "Do you support Mostadam credits?", ar: "هل تدعمون اعتمادات مستدام؟" }, a: { en: "Yes, designs target Mostadam water efficiency credits.", ar: "نعم، تستهدف التصاميم اعتمادات كفاءة المياه في مستدام." } }],
    sectors: allSectors,
  },
  {
    id: "16",
    slug: "boiler-systems",
    category: "MEP",
    iconKey: "Thermometer",
    name: { en: "Boiler Systems", ar: "أنظمة الغلايات" },
    tagline: { en: "Domestic hot water and steam plants.", ar: "محطات المياه الساخنة المنزلية والبخار." },
    overview: { en: "Gas-fired, electric, and heat-recovery boiler plants for hotels, hospitals, laundries, and industrial kitchens.", ar: "محطات غلايات تعمل بالغاز والكهرباء واستعادة الحرارة للفنادق والمستشفيات والمغاسل والمطابخ الصناعية." },
    features: [{ en: "Condensing boilers up to 1MW", ar: "غلايات مكثفة حتى 1 ميغاوات" }, { en: "Steam plants for laundries", ar: "محطات بخار للمغاسل" }],
    useCases: [{ en: "Hotel central plant rooms", ar: "غرف محطات الفنادق المركزية" }],
    faqs: [{ q: { en: "Do you handle steam piping?", ar: "هل تتعاملون مع أنابيب البخار؟" }, a: { en: "Yes, full ASME B31 compliant fabrication.", ar: "نعم، تصنيع كامل متوافق مع ASME B31." } }],
    sectors: ["hospitality", "infrastructure", "commercial"],
  },
  {
    id: "17",
    slug: "special-equipment",
    category: "Hospitality",
    iconKey: "Box",
    name: { en: "Special Equipment", ar: "المعدات الخاصة" },
    tagline: { en: "Niche equipment from spa to medical to broadcast.", ar: "معدات متخصصة من السبا إلى الطبية إلى البث." },
    overview: { en: "Spa, wellness, medical, broadcast, and back-of-house specialty equipment sourced and installed turnkey.", ar: "معدات متخصصة للسبا والصحة والطبية والبث وخلف الكواليس يتم توريدها وتركيبها بشكل متكامل." },
    features: [{ en: "Hammam and snow rooms", ar: "حمامات تركية وغرف ثلج" }, { en: "Medical imaging shielding", ar: "حماية التصوير الطبي" }],
    useCases: [{ en: "Spa and wellness centers", ar: "مراكز السبا والعافية" }],
    faqs: [{ q: { en: "Can you source niche brands?", ar: "هل يمكنكم توريد العلامات المتخصصة؟" }, a: { en: "Yes, our procurement network spans Europe, US, and Asia.", ar: "نعم، شبكة المشتريات لدينا تمتد عبر أوروبا وأمريكا وآسيا." } }],
    sectors: ["hospitality", "commercial"],
  },
  {
    id: "18",
    slug: "swimming-pool-systems",
    category: "Outdoor & Lifestyle",
    iconKey: "Waves",
    name: { en: "Swimming Pool Systems", ar: "أنظمة المسابح" },
    tagline: { en: "Pools, water features, and aquatic engineering.", ar: "مسابح وميزات مائية وهندسة مائية." },
    overview: { en: "Indoor, outdoor, infinity, and competition pools with full water treatment, heating, and lighting packages.", ar: "مسابح داخلية وخارجية ولا نهائية وتنافسية مع حزم كاملة لمعالجة المياه والتدفئة والإضاءة." },
    features: [{ en: "Infinity-edge engineering", ar: "هندسة الحافة اللانهائية" }, { en: "UV and ozone water treatment", ar: "معالجة المياه بالأشعة فوق البنفسجية والأوزون" }],
    useCases: [{ en: "Resort pools and lagoons", ar: "مسابح المنتجعات والبحيرات" }, { en: "Private villa pools", ar: "مسابح الفلل الخاصة" }],
    faqs: [{ q: { en: "Do you handle pool maintenance?", ar: "هل تتعاملون مع صيانة المسابح؟" }, a: { en: "Yes, annual maintenance contracts available.", ar: "نعم، عقود صيانة سنوية متاحة." } }],
    sectors: ["hospitality", "residential"],
  },
  {
    id: "19",
    slug: "it-systems-networking",
    category: "Smart & Tech",
    iconKey: "Network",
    name: { en: "IT Systems & Networking", ar: "أنظمة تقنية المعلومات والشبكات" },
    tagline: { en: "Structured cabling, Wi-Fi, and network infrastructure.", ar: "كابلات منظمة وواي فاي وبنية تحتية للشبكات." },
    overview: { en: "Structured cabling, enterprise Wi-Fi 6E, server rooms, and SD-WAN for hotels, offices, and campuses.", ar: "كابلات منظمة، واي فاي 6E للمؤسسات، غرف الخوادم، و SD-WAN للفنادق والمكاتب والحرم الجامعية." },
    features: [{ en: "Cat6A and OS2 fiber backbones", ar: "ركائز Cat6A وألياف OS2" }, { en: "Aruba, Cisco, Ruckus Wi-Fi", ar: "شبكات واي فاي أروبا وسيسكو وروكوس" }],
    useCases: [{ en: "Hotel guest Wi-Fi", ar: "واي فاي نزلاء الفنادق" }, { en: "Corporate campus networks", ar: "شبكات الحرم الجامعية للشركات" }],
    faqs: [{ q: { en: "Are you Cisco Gold partners?", ar: "هل أنتم شركاء سيسكو الذهبيون؟" }, a: { en: "Yes, certified Cisco and Aruba implementation partners.", ar: "نعم، شركاء تنفيذ معتمدون من سيسكو وأروبا." } }],
    sectors: allSectors,
  },
  {
    id: "20",
    slug: "fitness-equipment",
    category: "Hospitality",
    iconKey: "Dumbbell",
    name: { en: "Fitness Equipment", ar: "معدات اللياقة البدنية" },
    tagline: { en: "Technogym and Life Fitness commercial supply.", ar: "توريد تجاري من تكنوجيم ولايف فيتنس." },
    overview: { en: "Commercial gym fit-out for hotels, residential clubs, and corporate wellness — Technogym, Life Fitness, Matrix.", ar: "تجهيز صالات رياضية تجارية للفنادق والنوادي السكنية والصحة المؤسسية — تكنوجيم ولايف فيتنس وماتريكس." },
    features: [{ en: "Cardio, strength, and functional zones", ar: "مناطق كارديو وقوة ووظيفية" }, { en: "Connected wellness platforms", ar: "منصات صحة متصلة" }],
    useCases: [{ en: "Hotel gyms", ar: "صالات الفنادق الرياضية" }, { en: "Compound clubs", ar: "نوادي المجمعات السكنية" }],
    faqs: [{ q: { en: "Do you provide installation training?", ar: "هل تقدمون تدريباً على التركيب؟" }, a: { en: "Yes, equipment orientation for staff is included.", ar: "نعم، توجيه المعدات للموظفين مشمول." } }],
    sectors: ["hospitality", "residential", "commercial"],
  },
  {
    id: "21",
    slug: "outdoor-landscape-solutions",
    category: "Outdoor & Lifestyle",
    iconKey: "TreePine",
    name: { en: "Outdoor & Landscape Solutions", ar: "حلول الخارج والمناظر الطبيعية" },
    tagline: { en: "Hardscape, planting, and outdoor lighting.", ar: "تشطيب صلب وزراعة وإضاءة خارجية." },
    overview: { en: "Landscape design and installation for resorts, residences, and public realm — irrigation, planting, hardscape, and architectural lighting.", ar: "تصميم وتركيب المناظر الطبيعية للمنتجعات والمساكن والمجال العام — الري والزراعة والتشطيب الصلب والإضاءة المعمارية." },
    features: [{ en: "Drought-tolerant native planting", ar: "زراعة محلية مقاومة للجفاف" }, { en: "Smart irrigation controls", ar: "ضوابط ري ذكية" }],
    useCases: [{ en: "Resort grounds", ar: "أراضي المنتجعات" }, { en: "Compound landscaping", ar: "تنسيق المجمعات السكنية" }],
    faqs: [{ q: { en: "Do you do plant maintenance?", ar: "هل تقومون بصيانة النباتات؟" }, a: { en: "Yes, full landscape maintenance contracts available.", ar: "نعم، عقود صيانة كاملة للمناظر الطبيعية متاحة." } }],
    sectors: ["hospitality", "residential", "infrastructure"],
  },
  {
    id: "22",
    slug: "hospitality-supplies",
    category: "Hospitality",
    iconKey: "Package",
    name: { en: "Hospitality Supplies", ar: "إمدادات الضيافة" },
    tagline: { en: "OS&E packages from china to glassware to linens.", ar: "حزم OS&E من الأواني إلى الزجاجيات إلى المفروشات." },
    overview: { en: "Operating supplies and equipment (OS&E) packages — china, glass, silver, linen, amenities, uniforms — for hotel openings.", ar: "حزم لوازم التشغيل والمعدات (OS&E) — الأواني والزجاج والفضيات والمفروشات والوسائل والزي الرسمي — لافتتاحات الفنادق." },
    features: [{ en: "Brand-standard amenity kits", ar: "أطقم وسائل بمعايير العلامة" }, { en: "Linen and uniform programs", ar: "برامج المفروشات والزي الموحد" }],
    useCases: [{ en: "Hotel pre-opening packages", ar: "حزم ما قبل افتتاح الفنادق" }],
    faqs: [{ q: { en: "Can you brand-stamp items?", ar: "هل يمكن وضع علامات تجارية على العناصر؟" }, a: { en: "Yes, full custom branding via embroidery, etching, and printing.", ar: "نعم، علامات مخصصة كاملة عبر التطريز والنقش والطباعة." } }],
    sectors: ["hospitality"],
  },
  {
    id: "23",
    slug: "linen-chute-solutions",
    category: "Hospitality",
    iconKey: "ArrowDownToLine",
    name: { en: "Linen Chute Solutions", ar: "حلول مزالق المفروشات" },
    tagline: { en: "Stainless steel laundry and waste chute systems.", ar: "أنظمة مزالق غسيل ونفايات من الستانلس ستيل." },
    overview: { en: "Engineered stainless steel linen and waste chutes with fire-rated discharge doors and odor control for hotels and hospitals.", ar: "مزالق مفروشات ونفايات مهندسة من الستانلس ستيل مع أبواب تفريغ مقاومة للحريق والتحكم في الروائح للفنادق والمستشفيات." },
    features: [{ en: "Fire-rated discharge doors", ar: "أبواب تفريغ مقاومة للحريق" }, { en: "Sanitizing UV at base", ar: "تعقيم بالأشعة فوق البنفسجية في القاعدة" }],
    useCases: [{ en: "Hotel BOH efficiency", ar: "كفاءة خلف الكواليس في الفنادق" }, { en: "Hospital sanitation", ar: "صحة المستشفيات" }],
    faqs: [{ q: { en: "What is the typical install time?", ar: "ما هو وقت التركيب المعتاد؟" }, a: { en: "4-6 weeks per shaft, including civil works.", ar: "4-6 أسابيع لكل عمود، بما في ذلك الأعمال المدنية." } }],
    sectors: ["hospitality"],
  },
  {
    id: "24",
    slug: "decoration-artwork",
    category: "Hospitality",
    iconKey: "Palette",
    name: { en: "Decoration & Artwork", ar: "الديكور والأعمال الفنية" },
    tagline: { en: "Curated art programs and bespoke decoration.", ar: "برامج فنية منتقاة وديكورات مخصصة." },
    overview: { en: "Curated art programs, sculptural installations, and bespoke decoration packages from regional and international artists.", ar: "برامج فنية منتقاة، تركيبات نحتية، وحزم ديكور مخصصة من فنانين إقليميين ودوليين." },
    features: [{ en: "Saudi heritage artwork", ar: "أعمال فنية من التراث السعودي" }, { en: "Custom sculpture commissions", ar: "تكليفات نحت مخصصة" }],
    useCases: [{ en: "Hotel public spaces", ar: "مساحات الفنادق العامة" }, { en: "Corporate lobbies", ar: "ردهات الشركات" }],
    faqs: [{ q: { en: "Do you offer art consultancy?", ar: "هل تقدمون استشارات فنية؟" }, a: { en: "Yes, full curatorial services aligned with brand and culture.", ar: "نعم، خدمات تنسيق فني كاملة تتماشى مع العلامة التجارية والثقافة." } }],
    sectors: ["hospitality", "commercial", "residential"],
  },
  {
    id: "25",
    slug: "hospitality-signage-wayfinding",
    category: "Hospitality",
    iconKey: "Signpost",
    name: { en: "Hospitality Signage & Wayfinding", ar: "اللافتات وإرشاد الاتجاهات للضيافة" },
    tagline: { en: "Brand-aligned signage from arrival to suite.", ar: "لافتات متوافقة مع العلامة التجارية من الوصول إلى الجناح." },
    overview: { en: "Complete bilingual signage and wayfinding systems for hotels, mixed-use, and infrastructure — exterior monuments to interior room IDs.", ar: "أنظمة لافتات وإرشاد ثنائية اللغة كاملة للفنادق والمشاريع المختلطة والبنية التحتية — من المعالم الخارجية إلى تعريفات الغرف الداخلية." },
    features: [{ en: "Bilingual EN/AR layouts", ar: "تخطيطات ثنائية اللغة بالإنجليزية والعربية" }, { en: "ADA and tactile braille", ar: "ADA وبرايل اللمسي" }],
    useCases: [{ en: "Hotel guest journey", ar: "رحلة نزلاء الفنادق" }, { en: "Mall and metro stations", ar: "محطات المراكز التجارية والمترو" }],
    faqs: [{ q: { en: "Do you supply digital signage?", ar: "هل توفرون لافتات رقمية؟" }, a: { en: "Yes, with CMS-driven content management.", ar: "نعم، مع إدارة محتوى مدفوعة بنظام إدارة المحتوى." } }],
    sectors: ["hospitality", "commercial", "infrastructure"],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
