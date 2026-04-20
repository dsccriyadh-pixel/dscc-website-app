// AUTO-GENERATED from dsccsaudia.com source extraction (zero-creativity).
  // English text is verbatim from source. Arabic is intentionally identical to English
  // pending review by an Arabic translator (see public/extract/source-mapping-report.md).

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
    sourceUrl?: string;
    icon?: string;
    category: string;
    name: BilingualString;
    tagline: BilingualString;
    overview: BilingualString;
    features: BilingualString[];
    useCases: BilingualString[];
    faqs: Faq[];
    sectors: string[];
  }

  export const serviceCategories: { key: string; name: BilingualString }[] = [
    { key: "Architecture & Envelope", name: { en: "Architecture & Envelope", ar: "Architecture & Envelope" } },
    { key: "MEP",                     name: { en: "MEP Engineering",         ar: "MEP Engineering" } },
    { key: "Smart & Tech",            name: { en: "Smart & Technology",      ar: "Smart & Technology" } },
    { key: "Hospitality",             name: { en: "Hospitality Solutions",   ar: "Hospitality Solutions" } },
    { key: "Outdoor & Lifestyle",     name: { en: "Outdoor & Lifestyle",     ar: "Outdoor & Lifestyle" } },
  ];

  export const services: Service[] = [
    {
      id: "1",
      slug: "aluminum-steel-glazing",
      sourceUrl: "https://dsccsaudia.com/service/aluminum-steel-glazing",
      icon: "/assets/uploads/media-uploader/aluminum-steel-glazing1693906879.svg",
      category: "Architecture & Envelope",
      name: { en: `Aluminum & Steel Glazing`, ar: `واجهات زجاجية وأعمال ألمنيوم` },
      tagline: { en: `Aluminum & Steel Glazing`, ar: `Aluminum & Steel Glazing` },
      overview: { en: `At DSCC, we take pride in offering top-notch Aluminum & Steel Glazing services that combine aesthetics, durability, and functionality. With years of expertise and a commitment to excellence, we are your trusted partner for all your glazing needs. Our team of skilled professionals specializes in Aluminum & Steel Glazing, providing a wide range of solutions for both residential and commercial spaces. Whether you're looking to enhance the beauty of your home or add a touch of sophistication to your business premises, our services are tailored to meet your specific requirements.`, ar: `At DSCC, we take pride in offering top-notch Aluminum & Steel Glazing services that combine aesthetics, durability, and functionality. With years of expertise and a commitment to excellence, we are your trusted partner for all your glazing needs. Our team of skilled professionals specializes in Aluminum & Steel Glazing, providing a wide range of solutions for both residential and commercial spaces. Whether you're looking to enhance the beauty of your home or add a touch of sophistication to your business premises, our services are tailored to meet your specific requirements.` },
      features: [
  
      ],
      useCases: [
        { en: `Tailored Solutions: We understand that each facility has unique needs. Our solutions are customized to fit your space, ensuring seamless integration and optimal functionality.`, ar: `Tailored Solutions: We understand that each facility has unique needs. Our solutions are customized to fit your space, ensuring seamless integration and optimal functionality.` },
      { en: `Hygiene and Safety: Maintaining a clean and safe environment is our priority. Our linen chutes are designed to promote hygiene and prevent cross-contamination.`, ar: `Hygiene and Safety: Maintaining a clean and safe environment is our priority. Our linen chutes are designed to promote hygiene and prevent cross-contamination.` },
      { en: `Efficiency: Our solutions streamline waste disposal processes, saving time and effort for your staff or residents.`, ar: `Efficiency: Our solutions streamline waste disposal processes, saving time and effort for your staff or residents.` },
      { en: `Experience: With a track record of successful installations and maintenance, our team brings a wealth of experience to every project.`, ar: `Experience: With a track record of successful installations and maintenance, our team brings a wealth of experience to every project.` },
      { en: `Customer-Centric Approach: We value your satisfaction and work closely with you to deliver solutions that align with your goals and preferences.`, ar: `Customer-Centric Approach: We value your satisfaction and work closely with you to deliver solutions that align with your goals and preferences.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "2",
      slug: "indoor-and-outdoor-furniture",
      sourceUrl: "https://dsccsaudia.com/service/indoor-and-outdoor-furniture",
      icon: "/assets/uploads/media-uploader/indoor-and-outdoor-furniture1694200160.svg",
      category: "Hospitality",
      name: { en: `Indoor and Outdoor Furniture`, ar: `أثاث داخلي وخارجي` },
      tagline: { en: `Indoor and Outdoor Furniture`, ar: `Indoor and Outdoor Furniture` },
      overview: { en: `Welcome to DSCC Indoor and Outdoor Furniture Services, where we specialize in enhancing the comfort, functionality, and aesthetics of your living spaces through expertly crafted furniture solutions. Our experienced team is dedicated to providing high-quality indoor and outdoor furniture that reflects your unique style while ensuring durability and elegance.`, ar: `Welcome to DSCC Indoor and Outdoor Furniture Services, where we specialize in enhancing the comfort, functionality, and aesthetics of your living spaces through expertly crafted furniture solutions. Our experienced team is dedicated to providing high-quality indoor and outdoor furniture that reflects your unique style while ensuring durability and elegance.` },
      features: [
        { en: `Indoor Furniture: From sofas and dining tables to storage solutions and custom cabinetry, we offer a wide range of indoor furniture options that cater to your functional and design needs.`, ar: `Indoor Furniture: From sofas and dining tables to storage solutions and custom cabinetry, we offer a wide range of indoor furniture options that cater to your functional and design needs.` },
      { en: `Outdoor Furniture: Enhance your outdoor living spaces with our durable and weather-resistant outdoor furniture. We provide seating, tables, and accessories that elevate your patio, deck, or garden area.`, ar: `Outdoor Furniture: Enhance your outdoor living spaces with our durable and weather-resistant outdoor furniture. We provide seating, tables, and accessories that elevate your patio, deck, or garden area.` },
      { en: `Custom Furniture Design: Our experts work closely with you to understand your preferences and requirements. We offer custom furniture design services, allowing you to create bespoke pieces that perfectly fit your space and style.`, ar: `Custom Furniture Design: Our experts work closely with you to understand your preferences and requirements. We offer custom furniture design services, allowing you to create bespoke pieces that perfectly fit your space and style.` }
      ],
      useCases: [
        { en: `Artisanal Craftsmanship: Our furniture is crafted with meticulous attention to detail, ensuring that every piece is of the highest quality and built to last.`, ar: `Artisanal Craftsmanship: Our furniture is crafted with meticulous attention to detail, ensuring that every piece is of the highest quality and built to last.` },
      { en: `Tailored Solutions: We understand that every space is unique. Our solutions are customized to fit your space, preferences, and functional needs.`, ar: `Tailored Solutions: We understand that every space is unique. Our solutions are customized to fit your space, preferences, and functional needs.` },
      { en: `Aesthetic Appeal: Our furniture pieces are designed to enhance the aesthetics of your interiors and outdoor areas, creating inviting and stylish spaces.`, ar: `Aesthetic Appeal: Our furniture pieces are designed to enhance the aesthetics of your interiors and outdoor areas, creating inviting and stylish spaces.` },
      { en: `Durability: We prioritize using high-quality materials and construction techniques to ensure the longevity and resilience of our furniture.`, ar: `Durability: We prioritize using high-quality materials and construction techniques to ensure the longevity and resilience of our furniture.` },
      { en: `Customer-Centric Approach: Your satisfaction and comfort are our primary focus. We collaborate closely with you to deliver furniture solutions that align with your vision.`, ar: `Customer-Centric Approach: Your satisfaction and comfort are our primary focus. We collaborate closely with you to deliver furniture solutions that align with your vision.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "3",
      slug: "window-and-door",
      sourceUrl: "https://dsccsaudia.com/service/window-&-door",
      icon: "/assets/uploads/media-uploader/doors1695226337.svg",
      category: "Architecture & Envelope",
      name: { en: `Window & Door`, ar: `أبواب ونوافذ` },
      tagline: { en: `Window & Door`, ar: `Window & Door` },
      overview: { en: `Welcome to DSCC Window & Door Services, where we specialize in enhancing the aesthetics, functionality, and security of your residential or commercial spaces through expert window and door solutions. Our experienced team is dedicated to creating welcoming entrances and stunning views while prioritizing energy efficiency and durability. With an eye for design and a commitment to quality, our skilled technicians bring years of expertise to every project. Whether you're seeking to upgrade your windows and doors for better insulation, security, or aesthetics, we have the knowledge to bring your vision to life.`, ar: `Welcome to DSCC Window & Door Services, where we specialize in enhancing the aesthetics, functionality, and security of your residential or commercial spaces through expert window and door solutions. Our experienced team is dedicated to creating welcoming entrances and stunning views while prioritizing energy efficiency and durability. With an eye for design and a commitment to quality, our skilled technicians bring years of expertise to every project. Whether you're seeking to upgrade your windows and doors for better insulation, security, or aesthetics, we have the knowledge to bring your vision to life.` },
      features: [
  
      ],
      useCases: [
        { en: `Technical Excellence: Our technicians are experienced in installing and replacing a variety of windows and doors, ensuring professional and reliable services.`, ar: `Technical Excellence: Our technicians are experienced in installing and replacing a variety of windows and doors, ensuring professional and reliable services.` },
      { en: `Custom Solutions: We understand that window and door needs vary. Our solutions are customized to fit your space, preferences, and security requirements.`, ar: `Custom Solutions: We understand that window and door needs vary. Our solutions are customized to fit your space, preferences, and security requirements.` },
      { en: `Aesthetic Appeal: Windows and doors play a significant role in the overall look of your space. Our solutions are designed to enhance the visual appeal and ambiance of your interiors and exteriors.`, ar: `Aesthetic Appeal: Windows and doors play a significant role in the overall look of your space. Our solutions are designed to enhance the visual appeal and ambiance of your interiors and exteriors.` },
      { en: `Energy Savings: Our energy-efficient solutions contribute to lower energy consumption, reducing your carbon footprint and utility bills.`, ar: `Energy Savings: Our energy-efficient solutions contribute to lower energy consumption, reducing your carbon footprint and utility bills.` },
      { en: `Customer-Centric Approach: Your satisfaction and comfort are our main focus. We work collaboratively to ensure that our solutions align with your needs and exceed your expectations.`, ar: `Customer-Centric Approach: Your satisfaction and comfort are our main focus. We work collaboratively to ensure that our solutions align with your needs and exceed your expectations.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "4",
      slug: "lighting-switch-socket",
      sourceUrl: "https://dsccsaudia.com/service/lighting-switch-socket",
      icon: "/assets/uploads/media-uploader/lamp1695226338.svg",
      category: "MEP",
      name: { en: `Lighting / Switch / Socket`, ar: `أنظمة الإضاءة والمفاتيح الكهربائية` },
      tagline: { en: `Lighting / Switch / Socket`, ar: `Lighting / Switch / Socket` },
      overview: { en: `Welcome to DSCC Lighting, Switch, and Socket Services, where we specialize in enhancing the functionality and ambiance of your residential or commercial spaces through expert lighting design, installation, and maintenance. Our experienced team is dedicated to creating well-lit environments that blend style, energy efficiency, and convenience. With a passion for lighting design and a commitment to excellence, our skilled technicians bring years of expertise to every project. Whether you're looking to brighten up a room, create a specific mood, or enhance energy efficiency, we have the knowledge to transform your vision into reality.`, ar: `Welcome to DSCC Lighting, Switch, and Socket Services, where we specialize in enhancing the functionality and ambiance of your residential or commercial spaces through expert lighting design, installation, and maintenance. Our experienced team is dedicated to creating well-lit environments that blend style, energy efficiency, and convenience. With a passion for lighting design and a commitment to excellence, our skilled technicians bring years of expertise to every project. Whether you're looking to brighten up a room, create a specific mood, or enhance energy efficiency, we have the knowledge to transform your vision into reality.` },
      features: [
  
      ],
      useCases: [
        { en: `Technical Excellence: Our technicians possess the expertise needed to design and install a variety of lighting solutions, switches, and sockets, ensuring professional and reliable services.`, ar: `Technical Excellence: Our technicians possess the expertise needed to design and install a variety of lighting solutions, switches, and sockets, ensuring professional and reliable services.` },
      { en: `Tailored Solutions: We understand that lighting needs vary. Our solutions are customized to fit your space, preferences, and energy efficiency goals.`, ar: `Tailored Solutions: We understand that lighting needs vary. Our solutions are customized to fit your space, preferences, and energy efficiency goals.` },
      { en: `Aesthetic Appeal: Lighting plays a crucial role in ambiance and aesthetics. Our solutions are designed to enhance the visual appeal and mood of your spaces.`, ar: `Aesthetic Appeal: Lighting plays a crucial role in ambiance and aesthetics. Our solutions are designed to enhance the visual appeal and mood of your spaces.` },
      { en: `Energy Savings: We prioritize energy-efficient solutions that not only lower your utility bills but also contribute to a more sustainable environment.`, ar: `Energy Savings: We prioritize energy-efficient solutions that not only lower your utility bills but also contribute to a more sustainable environment.` },
      { en: `Customer-Centric Approach: Your satisfaction and comfort are our primary focus. We work closely with you to understand your needs and deliver solutions that exceed your expectations.`, ar: `Customer-Centric Approach: Your satisfaction and comfort are our primary focus. We work closely with you to understand your needs and deliver solutions that exceed your expectations.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "5",
      slug: "wall-and-floor-covering",
      sourceUrl: "https://dsccsaudia.com/service/wall-&-floor-covering",
      icon: "/assets/uploads/media-uploader/parquet1695226339.svg",
      category: "Architecture & Envelope",
      name: { en: `Wall & Floor Covering`, ar: `حلول الأرضيات والجدران` },
      tagline: { en: `Wall & Floor Covering`, ar: `Wall & Floor Covering` },
      overview: { en: `Welcome to DSCC Wall & Floor Covering Services, where we specialize in transforming your interiors with exquisite wall and floor treatments that combine beauty, functionality, and innovation. Our expert team is dedicated to enhancing your spaces with premium coverings that reflect your style, elevate aesthetics, and create inviting atmospheres. With an eye for design and a commitment to quality, our skilled artisans and technicians bring years of expertise to every project. Whether you're envisioning a cozy home environment or a sophisticated commercial space, we have the knowledge and creativity to bring your ideas to life.`, ar: `Welcome to DSCC Wall & Floor Covering Services, where we specialize in transforming your interiors with exquisite wall and floor treatments that combine beauty, functionality, and innovation. Our expert team is dedicated to enhancing your spaces with premium coverings that reflect your style, elevate aesthetics, and create inviting atmospheres. With an eye for design and a commitment to quality, our skilled artisans and technicians bring years of expertise to every project. Whether you're envisioning a cozy home environment or a sophisticated commercial space, we have the knowledge and creativity to bring your ideas to life.` },
      features: [
  
      ],
      useCases: [
        { en: `Design Excellence: Our designers possess an eye for detail and a flair for selecting coverings that harmonize with your design vision.`, ar: `Design Excellence: Our designers possess an eye for detail and a flair for selecting coverings that harmonize with your design vision.` },
      { en: `Customization: We understand that each space is unique. Our solutions are tailored to fit your layout, preferences, and functional needs.`, ar: `Customization: We understand that each space is unique. Our solutions are tailored to fit your layout, preferences, and functional needs.` },
      { en: `Quality Materials: We prioritize using high-quality materials and techniques to ensure the longevity and beauty of our coverings.`, ar: `Quality Materials: We prioritize using high-quality materials and techniques to ensure the longevity and beauty of our coverings.` },
      { en: `Professional Installation: Our team ensures a seamless installation process, delivering impeccable results that exceed your expectations.`, ar: `Professional Installation: Our team ensures a seamless installation process, delivering impeccable results that exceed your expectations.` },
      { en: `Customer-Centric Approach: Your satisfaction and the creation of stunning and inviting spaces are our primary focus.`, ar: `Customer-Centric Approach: Your satisfaction and the creation of stunning and inviting spaces are our primary focus.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "6",
      slug: "hvac-system",
      sourceUrl: "https://dsccsaudia.com/service/hvac-system",
      icon: "/assets/uploads/media-uploader/hvac-system1694201795.svg",
      category: "MEP",
      name: { en: `HVAC System`, ar: `أنظمة التكييف والتهوية` },
      tagline: { en: `HVAC System`, ar: `HVAC System` },
      overview: { en: `At DSCC, we understand that a well-functioning HVAC (Heating, Ventilation, and Air Conditioning) system is essential for maintaining a comfortable and productive environment in your residential or commercial space. Our HVAC System Services are designed to provide you with top-notch installation, maintenance, repair, and consultation services to ensure optimal indoor air quality and temperature control.`, ar: `At DSCC, we understand that a well-functioning HVAC (Heating, Ventilation, and Air Conditioning) system is essential for maintaining a comfortable and productive environment in your residential or commercial space. Our HVAC System Services are designed to provide you with top-notch installation, maintenance, repair, and consultation services to ensure optimal indoor air quality and temperature control.` },
      features: [
        { en: `Installation: Our experts will guide you through the process of selecting the right HVAC system for your space. We'll consider factors such as the size of the area, energy efficiency goals, and budget constraints to recommend the best-suited system. Our installation process is meticulous, ensuring proper integration and functionality.`, ar: `Installation: Our experts will guide you through the process of selecting the right HVAC system for your space. We'll consider factors such as the size of the area, energy efficiency goals, and budget constraints to recommend the best-suited system. Our installation process is meticulous, ensuring proper integration and functionality.` },
      { en: `Maintenance: Regular maintenance is key to extending the lifespan of your HVAC system and preventing potential issues. Our maintenance services encompass thorough system inspections, cleaning, filter replacements, and performance optimization. By scheduling routine maintenance, you can reduce the likelihood of costly breakdowns and maintain efficient operation.`, ar: `Maintenance: Regular maintenance is key to extending the lifespan of your HVAC system and preventing potential issues. Our maintenance services encompass thorough system inspections, cleaning, filter replacements, and performance optimization. By scheduling routine maintenance, you can reduce the likelihood of costly breakdowns and maintain efficient operation.` },
      { en: `Repair: Unexpected HVAC system breakdowns can disrupt your daily activities and compromise comfort. Our skilled technicians are available to diagnose and repair a variety of HVAC system issues promptly. We strive to minimize downtime and restore your system to peak performance as quickly as possible.`, ar: `Repair: Unexpected HVAC system breakdowns can disrupt your daily activities and compromise comfort. Our skilled technicians are available to diagnose and repair a variety of HVAC system issues promptly. We strive to minimize downtime and restore your system to peak performance as quickly as possible.` },
      { en: `Consultation: If you're considering upgrading your HVAC system or making energy-efficient improvements, our experts can provide valuable insights. We offer consultation services to help you make informed decisions about system upgrades, zoning, thermostat options, and indoor air quality enhancements.`, ar: `Consultation: If you're considering upgrading your HVAC system or making energy-efficient improvements, our experts can provide valuable insights. We offer consultation services to help you make informed decisions about system upgrades, zoning, thermostat options, and indoor air quality enhancements.` }
      ],
      useCases: [
        { en: `Expert Technicians: Our technicians are certified and experienced in handling a wide array of HVAC systems, ensuring reliable and professional service.`, ar: `Expert Technicians: Our technicians are certified and experienced in handling a wide array of HVAC systems, ensuring reliable and professional service.` },
      { en: `Customer-Centric Approach: We prioritize your comfort and satisfaction. Our team listens to your needs and works collaboratively to find the best solutions for your HVAC system.`, ar: `Customer-Centric Approach: We prioritize your comfort and satisfaction. Our team listens to your needs and works collaboratively to find the best solutions for your HVAC system.` },
      { en: `Quality and Efficiency: We are committed to delivering high-quality services and using energy-efficient solutions that align with environmental standards.`, ar: `Quality and Efficiency: We are committed to delivering high-quality services and using energy-efficient solutions that align with environmental standards.` },
      { en: `Transparent Pricing: Our pricing is fair and transparent. You'll receive upfront quotes for our services, so you know what to expect before any work begins.`, ar: `Transparent Pricing: Our pricing is fair and transparent. You'll receive upfront quotes for our services, so you know what to expect before any work begins.` },
      { en: `Emergency Services: HVAC emergencies can happen at any time. Our team is available for emergency repairs to ensure your comfort is quickly restored.`, ar: `Emergency Services: HVAC emergencies can happen at any time. Our team is available for emergency repairs to ensure your comfort is quickly restored.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "7",
      slug: "audio-video-system",
      sourceUrl: "https://dsccsaudia.com/service/audio-video-system",
      icon: "/assets/uploads/media-uploader/sound-system1695226341.svg",
      category: "Smart & Tech",
      name: { en: `Audio/Video System`, ar: `أنظمة الصوت والصورة` },
      tagline: { en: `Audio/Video System`, ar: `Audio/Video System` },
      overview: { en: `Welcome to DSCC Audio/Video System Services, where we specialize in creating captivating audio and video experiences that elevate your residential and commercial spaces. Our expert team is dedicated to providing cutting-edge audio and video solutions that immerse you in high-quality entertainment, communication, and collaboration.`, ar: `Welcome to DSCC Audio/Video System Services, where we specialize in creating captivating audio and video experiences that elevate your residential and commercial spaces. Our expert team is dedicated to providing cutting-edge audio and video solutions that immerse you in high-quality entertainment, communication, and collaboration.` },
      features: [
  
      ],
      useCases: [
        { en: `Technical Excellence: Our technicians possess the expertise to design, install, and integrate a variety of audio and video systems, ensuring professional and reliable services.`, ar: `Technical Excellence: Our technicians possess the expertise to design, install, and integrate a variety of audio and video systems, ensuring professional and reliable services.` },
      { en: `Customization: We understand that each space has unique requirements. Our solutions are tailored to your preferences, whether for entertainment or business purposes.`, ar: `Customization: We understand that each space has unique requirements. Our solutions are tailored to your preferences, whether for entertainment or business purposes.` },
      { en: `Cutting-Edge Technology: We stay updated with the latest audio and video technologies and trends to provide you with state-of-the-art solutions.`, ar: `Cutting-Edge Technology: We stay updated with the latest audio and video technologies and trends to provide you with state-of-the-art solutions.` },
      { en: `Quality Materials: We prioritize using high-quality components and equipment to ensure the best performance and longevity.`, ar: `Quality Materials: We prioritize using high-quality components and equipment to ensure the best performance and longevity.` },
      { en: `Customer-Centric Approach: Your satisfaction and the creation of immersive audio and video experiences are our primary focus.`, ar: `Customer-Centric Approach: Your satisfaction and the creation of immersive audio and video experiences are our primary focus.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "8",
      slug: "building-automation-system",
      sourceUrl: "https://dsccsaudia.com/service/building-automation-system",
      icon: "/assets/uploads/media-uploader/smart-city1695226340.svg",
      category: "Smart & Tech",
      name: { en: `Building Automation System`, ar: `أنظمة التحكم الذكي` },
      tagline: { en: `Building Automation System`, ar: `Building Automation System` },
      overview: { en: `Welcome to DSCC Building Automation System Services, your partner in harnessing the power of technology to optimize the functionality, comfort, and energy efficiency of your building. Our expert team specializes in designing, implementing, and maintaining cutting-edge Building Automation Systems (BAS) that put you in control and enhance the overall performance of your facility.`, ar: `Welcome to DSCC Building Automation System Services, your partner in harnessing the power of technology to optimize the functionality, comfort, and energy efficiency of your building. Our expert team specializes in designing, implementing, and maintaining cutting-edge Building Automation Systems (BAS) that put you in control and enhance the overall performance of your facility.` },
      features: [
  
      ],
      useCases: [
        { en: `Technical Excellence: Our technicians are highly skilled in designing, implementing, and maintaining complex building automation systems. We stay up-to-date with the latest technologies to ensure your system is cutting-edge.`, ar: `Technical Excellence: Our technicians are highly skilled in designing, implementing, and maintaining complex building automation systems. We stay up-to-date with the latest technologies to ensure your system is cutting-edge.` },
      { en: `Custom Solutions: We understand that every building is unique. Our solutions are tailored to your specific needs, integrating the systems that matter most to you.`, ar: `Custom Solutions: We understand that every building is unique. Our solutions are tailored to your specific needs, integrating the systems that matter most to you.` },
      { en: `Efficiency and Sustainability: Our BAS solutions are designed to enhance energy efficiency and sustainability, resulting in cost savings and reduced env`, ar: `Efficiency and Sustainability: Our BAS solutions are designed to enhance energy efficiency and sustainability, resulting in cost savings and reduced env` },
      { en: `Scalability: Whether you have a single building or a complex of structures, our BAS solutions can be scaled to accommodate your needs and future growth.`, ar: `Scalability: Whether you have a single building or a complex of structures, our BAS solutions can be scaled to accommodate your needs and future growth.` },
      { en: `24/7 Support: Our team provides round-the-clock support to ensure that your BAS operates seamlessly at all times. We're here to address any concerns or issues that may arise.`, ar: `24/7 Support: Our team provides round-the-clock support to ensure that your BAS operates seamlessly at all times. We're here to address any concerns or issues that may arise.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "9",
      slug: "smart-room-services",
      sourceUrl: "https://dsccsaudia.com/service/smart-room-services",
      icon: "/assets/uploads/media-uploader/smart-room-control-systems1694201268.svg",
      category: "Smart & Tech",
      name: { en: `Smart Room Services`, ar: `حلول الغرف الذكية` },
      tagline: { en: `Smart Room Services`, ar: `Smart Room Services` },
      overview: { en: `Welcome to DSCC Smart Room Services, where we specialize in transforming your living and working spaces into innovative and technologically advanced environments. Our expert team is dedicated to creating smart rooms that seamlessly integrate cutting-edge technology to enhance your comfort, convenience, and overall lifestyle.`, ar: `Welcome to DSCC Smart Room Services, where we specialize in transforming your living and working spaces into innovative and technologically advanced environments. Our expert team is dedicated to creating smart rooms that seamlessly integrate cutting-edge technology to enhance your comfort, convenience, and overall lifestyle.` },
      features: [
        { en: `Smart Home Integration: Transform your living spaces into smart homes that offer control over lighting, temperature, security, entertainment, and more through integrated smart systems.`, ar: `Smart Home Integration: Transform your living spaces into smart homes that offer control over lighting, temperature, security, entertainment, and more through integrated smart systems.` },
      { en: `Commercial Smart Spaces: Elevate your business environment with smart meeting rooms, conference spaces, and offices that streamline operations, enhance productivity, and impress clients.`, ar: `Commercial Smart Spaces: Elevate your business environment with smart meeting rooms, conference spaces, and offices that streamline operations, enhance productivity, and impress clients.` },
      { en: `Custom Solutions: We work closely with you to understand your preferences and requirements. Our experts design and implement custom smart room solutions that align with your unique needs.`, ar: `Custom Solutions: We work closely with you to understand your preferences and requirements. Our experts design and implement custom smart room solutions that align with your unique needs.` },
      { en: `Smart Lighting: Control lighting levels and ambiance through voice commands or mobile apps, creating the perfect atmosphere for any occasion.`, ar: `Smart Lighting: Control lighting levels and ambiance through voice commands or mobile apps, creating the perfect atmosphere for any occasion.` },
      { en: `Automated Climate Control: Enjoy optimal comfort with automated climate control that adjusts temperatures based on your preferences and occupancy.`, ar: `Automated Climate Control: Enjoy optimal comfort with automated climate control that adjusts temperatures based on your preferences and occupancy.` },
      { en: `Security and Surveillance: Monitor your smart room remotely, receive real-time alerts, and control security features to ensure the safety of your space.`, ar: `Security and Surveillance: Monitor your smart room remotely, receive real-time alerts, and control security features to ensure the safety of your space.` },
      { en: `Entertainment Systems: Experience immersive entertainment with integrated audio and video systems that allow you to enjoy music, movies, and more with ease.`, ar: `Entertainment Systems: Experience immersive entertainment with integrated audio and video systems that allow you to enjoy music, movies, and more with ease.` },
      { en: `Voice Control: Manage your smart room effortlessly through voice commands, making everyday tasks more convenient and hands-free.`, ar: `Voice Control: Manage your smart room effortlessly through voice commands, making everyday tasks more convenient and hands-free.` }
      ],
      useCases: [
        { en: `Technical Excellence: Our technicians possess the expertise to design, install, and integrate a variety of smart technologies, ensuring a seamless and intelligent space.`, ar: `Technical Excellence: Our technicians possess the expertise to design, install, and integrate a variety of smart technologies, ensuring a seamless and intelligent space.` },
      { en: `Customization: We understand that every smart room is unique. Our solutions are tailored to your preferences, needs, and lifestyle.`, ar: `Customization: We understand that every smart room is unique. Our solutions are tailored to your preferences, needs, and lifestyle.` },
      { en: `Innovation: We stay updated with the latest smart technologies and trends to provide you with state-of-the-art solutions.`, ar: `Innovation: We stay updated with the latest smart technologies and trends to provide you with state-of-the-art solutions.` },
      { en: `Convenience: Our smart room solutions simplify tasks, enhance comfort, and improve efficiency, making your daily life more convenient.`, ar: `Convenience: Our smart room solutions simplify tasks, enhance comfort, and improve efficiency, making your daily life more convenient.` },
      { en: `Customer-Centric Approach: Your satisfaction and the creation of a truly intelligent and comfortable environment are our primary focus.`, ar: `Customer-Centric Approach: Your satisfaction and the creation of a truly intelligent and comfortable environment are our primary focus.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "10",
      slug: "kitchen-and-laundry-equipment",
      sourceUrl: "https://dsccsaudia.com/service/kitchen-&-laundry-equipment",
      icon: "/assets/uploads/media-uploader/kitchen1695226338.svg",
      category: "Hospitality",
      name: { en: `Kitchen & Laundry Equipment`, ar: `تجهيزات المطابخ والمغاسل` },
      tagline: { en: `Kitchen & Laundry Equipment`, ar: `Kitchen & Laundry Equipment` },
      overview: { en: `Welcome to DSCC Kitchen & Laundry Equipment Services, where we specialize in providing top-tier solutions for the installation, maintenance, and repair of kitchen and laundry equipment. Our skilled team is dedicated to ensuring that your commercial or residential spaces are equipped with reliable, efficient, and high-performance equipment that enhances your operations and daily life.`, ar: `Welcome to DSCC Kitchen & Laundry Equipment Services, where we specialize in providing top-tier solutions for the installation, maintenance, and repair of kitchen and laundry equipment. Our skilled team is dedicated to ensuring that your commercial or residential spaces are equipped with reliable, efficient, and high-performance equipment that enhances your operations and daily life.` },
      features: [
  
      ],
      useCases: [
        { en: `Technical Expertise: Our technicians have a strong background in handling a variety of kitchen and laundry equipment, ensuring professional installation, maintenance, and repair services.`, ar: `Technical Expertise: Our technicians have a strong background in handling a variety of kitchen and laundry equipment, ensuring professional installation, maintenance, and repair services.` },
      { en: `Quality Assurance: We prioritize using high-quality parts and materials in our services to ensure the longevity and optimal performance of your equipment.`, ar: `Quality Assurance: We prioritize using high-quality parts and materials in our services to ensure the longevity and optimal performance of your equipment.` },
      { en: `Custom Solutions: Whether you're a commercial establishment or a homeowner, our solutions are tailored to your specific needs and requirements.`, ar: `Custom Solutions: Whether you're a commercial establishment or a homeowner, our solutions are tailored to your specific needs and requirements.` },
      { en: `Prompt Response: We understand the urgency of equipment issues. Our team is responsive and works diligently to address your concerns promptly.`, ar: `Prompt Response: We understand the urgency of equipment issues. Our team is responsive and works diligently to address your concerns promptly.` },
      { en: `Efficiency: Well-maintained equipment operates more efficiently, saving you energy and resources. Our services contribute to your cost savings and environmental impact reduction.`, ar: `Efficiency: Well-maintained equipment operates more efficiently, saving you energy and resources. Our services contribute to your cost savings and environmental impact reduction.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "11",
      slug: "security-system",
      sourceUrl: "https://dsccsaudia.com/service/security-system",
      icon: "/assets/uploads/media-uploader/security-systems1694201625.svg",
      category: "Smart & Tech",
      name: { en: `Security System`, ar: `أنظمة الأمن والمراقبة` },
      tagline: { en: `Security System`, ar: `Security System` },
      overview: { en: `Welcome to DSCC Security System Services, where we specialize in providing comprehensive and advanced security solutions for residential and commercial spaces. Our expert team is dedicated to enhancing your safety and peace of mind through the design, installation, and maintenance of cutting-edge security systems.`, ar: `Welcome to DSCC Security System Services, where we specialize in providing comprehensive and advanced security solutions for residential and commercial spaces. Our expert team is dedicated to enhancing your safety and peace of mind through the design, installation, and maintenance of cutting-edge security systems.` },
      features: [
        { en: `Design and Installation: Our security experts work closely with you to assess your security needs and vulnerabilities. We design and install comprehensive security systems, including CCTV cameras, access control, intruder alarms, and more, to provide a robust defense against potential threats.`, ar: `Design and Installation: Our security experts work closely with you to assess your security needs and vulnerabilities. We design and install comprehensive security systems, including CCTV cameras, access control, intruder alarms, and more, to provide a robust defense against potential threats.` },
      { en: `Monitoring and Surveillance: Our security systems offer real-time monitoring and surveillance capabilities, enabling you to keep an eye on your property 24/7 from anywhere. We can also provide professional monitoring services to respond to alerts and potential breaches.`, ar: `Monitoring and Surveillance: Our security systems offer real-time monitoring and surveillance capabilities, enabling you to keep an eye on your property 24/7 from anywhere. We can also provide professional monitoring services to respond to alerts and potential breaches.` },
      { en: `Maintenance and Upgrades: Regular maintenance is essential to ensure the continued effectiveness of your security systems. Our technicians perform routine checks, repairs, and upgrades to keep your security measures up-to-date and reliable.`, ar: `Maintenance and Upgrades: Regular maintenance is essential to ensure the continued effectiveness of your security systems. Our technicians perform routine checks, repairs, and upgrades to keep your security measures up-to-date and reliable.` }
      ],
      useCases: [
        { en: `Technical Excellence: Our technicians are well-versed in designing, installing, and maintaining a wide range of security systems, ensuring professional and effective services.`, ar: `Technical Excellence: Our technicians are well-versed in designing, installing, and maintaining a wide range of security systems, ensuring professional and effective services.` },
      { en: `Tailored Solutions: We understand that security needs vary. Our solutions are customized to fit your specific requirements, whether you need a simple residential alarm system or a comprehensive commercial security network.`, ar: `Tailored Solutions: We understand that security needs vary. Our solutions are customized to fit your specific requirements, whether you need a simple residential alarm system or a comprehensive commercial security network.` },
      { en: `Advanced Technology: We stay up-to-date with the latest security technologies and trends to provide you with state-of-the-art solutions that offer the highest level of protection.`, ar: `Advanced Technology: We stay up-to-date with the latest security technologies and trends to provide you with state-of-the-art solutions that offer the highest level of protection.` },
      { en: `24/7 Support: Our team is available around the clock to address any concerns, perform maintenance, or provide support for emergency situations.`, ar: `24/7 Support: Our team is available around the clock to address any concerns, perform maintenance, or provide support for emergency situations.` },
      { en: `Peace of Mind: With our advanced security systems in place, you can enjoy peace of mind, knowing that your property and loved ones are safeguarded against potential threats.`, ar: `Peace of Mind: With our advanced security systems in place, you can enjoy peace of mind, knowing that your property and loved ones are safeguarded against potential threats.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "12",
      slug: "fire-protection-system",
      sourceUrl: "https://dsccsaudia.com/service/fire-protection-system",
      icon: "/assets/uploads/media-uploader/fire1695226337.svg",
      category: "MEP",
      name: { en: `Fire Protection System`, ar: `أنظمة مكافحة الحريق` },
      tagline: { en: `Fire Protection System`, ar: `Fire Protection System` },
      overview: { en: `Welcome to DSCC Fire Protection System Services, your dedicated partner in ensuring the safety and security of your residential or commercial space. Our expert team specializes in the design, installation, inspection, and maintenance of fire protection systems that are tailored to effectively detect, suppress, and mitigate the risk of fire emergencies. With a deep understanding of the critical importance of fire safety, our experienced technicians bring years of expertise to every project. From designing comprehensive fire protection strategies to implementing state-of-the-art systems, we are committed to safeguarding lives, property, and peace of mind.`, ar: `Welcome to DSCC Fire Protection System Services, your dedicated partner in ensuring the safety and security of your residential or commercial space. Our expert team specializes in the design, installation, inspection, and maintenance of fire protection systems that are tailored to effectively detect, suppress, and mitigate the risk of fire emergencies. With a deep understanding of the critical importance of fire safety, our experienced technicians bring years of expertise to every project. From designing comprehensive fire protection strategies to implementing state-of-the-art systems, we are committed to safeguarding lives, property, and peace of mind.` },
      features: [
  
      ],
      useCases: [
        { en: `Technical Excellence: Our technicians possess the expertise to design, install, and maintain a wide range of fire protection systems, ensuring your space is equipped with the best safety solutions.`, ar: `Technical Excellence: Our technicians possess the expertise to design, install, and maintain a wide range of fire protection systems, ensuring your space is equipped with the best safety solutions.` },
      { en: `Safety and Compliance: We prioritize following industry standards and local regulations to ensure that your fire protection systems are compliant and effective.`, ar: `Safety and Compliance: We prioritize following industry standards and local regulations to ensure that your fire protection systems are compliant and effective.` },
      { en: `Custom Solutions: Our solutions are tailored to your space and specific fire safety needs, whether you're safeguarding a residential home, commercial building, or industrial facility.`, ar: `Custom Solutions: Our solutions are tailored to your space and specific fire safety needs, whether you're safeguarding a residential home, commercial building, or industrial facility.` },
      { en: `Emergency Readiness: Our team is dedicated to being prepared for emergencies. We provide maintenance, inspection, and testing to ensure that your fire protection systems are ready when needed.`, ar: `Emergency Readiness: Our team is dedicated to being prepared for emergencies. We provide maintenance, inspection, and testing to ensure that your fire protection systems are ready when needed.` },
      { en: `Peace of Mind: With our reliable fire protection systems in place, you can have peace of mind knowing that you've taken proactive steps to mitigate the risk of fire emergencies.`, ar: `Peace of Mind: With our reliable fire protection systems in place, you can have peace of mind knowing that you've taken proactive steps to mitigate the risk of fire emergencies.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "13",
      slug: "electrical-system",
      sourceUrl: "https://dsccsaudia.com/service/electrical-system",
      icon: "/assets/uploads/media-uploader/wire1695226342.svg",
      category: "MEP",
      name: { en: `Electrical System`, ar: `الأنظمة الكهربائية` },
      tagline: { en: `Electrical System`, ar: `Electrical System` },
      overview: { en: `Welcome to DSCC Electrical System Services, your trusted partner in designing, installing, and maintaining reliable and safe electrical systems for residential and commercial spaces. Our experienced team specializes in providing comprehensive electrical solutions that ensure efficient power distribution, enhance safety, and comply with industry standards.`, ar: `Welcome to DSCC Electrical System Services, your trusted partner in designing, installing, and maintaining reliable and safe electrical systems for residential and commercial spaces. Our experienced team specializes in providing comprehensive electrical solutions that ensure efficient power distribution, enhance safety, and comply with industry standards.` },
      features: [
  
      ],
      useCases: [
        { en: `Technical Excellence: Our technicians are experienced in designing, installing, and maintaining a wide range of electrical systems, ensuring professional and reliable services.`, ar: `Technical Excellence: Our technicians are experienced in designing, installing, and maintaining a wide range of electrical systems, ensuring professional and reliable services.` },
      { en: `Safety Focus: We prioritize electrical safety, using quality materials and following industry best practices to minimize risks and ensure your space's safety.`, ar: `Safety Focus: We prioritize electrical safety, using quality materials and following industry best practices to minimize risks and ensure your space's safety.` },
      { en: `Custom Solutions: Our solutions are tailored to your space and electrical needs, whether you're upgrading an existing system or implementing a new one.`, ar: `Custom Solutions: Our solutions are tailored to your space and electrical needs, whether you're upgrading an existing system or implementing a new one.` },
      { en: `Energy Efficiency: We optimize electrical systems for energy efficiency, contributing to lower utility bills and reduced environmental impact.`, ar: `Energy Efficiency: We optimize electrical systems for energy efficiency, contributing to lower utility bills and reduced environmental impact.` },
      { en: `Responsive Support: Our team is available to address your concerns, perform routine maintenance, and respond to emergency situations promptly.`, ar: `Responsive Support: Our team is available to address your concerns, perform routine maintenance, and respond to emergency situations promptly.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "14",
      slug: "bathroom-solutions",
      sourceUrl: "https://dsccsaudia.com/service/bathroom-solutions",
      icon: "/assets/uploads/media-uploader/toilet1695226341.svg",
      category: "MEP",
      name: { en: `Bathroom Solutions`, ar: `حلول الحمامات` },
      tagline: { en: `Bathroom Solutions`, ar: `Bathroom Solutions` },
      overview: { en: `Welcome to DSCC Bathroom Solutions, where we bring a blend of creativity, expertise, and quality craftsmanship to create bathrooms that are both luxurious and functional. Our dedicated team specializes in designing, remodeling, and enhancing bathroom spaces to meet your unique needs and preferences.`, ar: `Welcome to DSCC Bathroom Solutions, where we bring a blend of creativity, expertise, and quality craftsmanship to create bathrooms that are both luxurious and functional. Our dedicated team specializes in designing, remodeling, and enhancing bathroom spaces to meet your unique needs and preferences.` },
      features: [
  
      ],
      useCases: [
        { en: `Design Excellence: Our designers have an eye for detail and a knack for creating stunning and functional bathroom spaces that suit your lifestyle.`, ar: `Design Excellence: Our designers have an eye for detail and a knack for creating stunning and functional bathroom spaces that suit your lifestyle.` },
      { en: `Quality Craftsmanship: We take pride in our workmanship, using high-quality materials and techniques to ensure lasting beauty and functionality.`, ar: `Quality Craftsmanship: We take pride in our workmanship, using high-quality materials and techniques to ensure lasting beauty and functionality.` },
      { en: `Customer-Centric Approach: Your satisfaction is our priority. We work collaboratively to ensure that the final result aligns with your expectations.`, ar: `Customer-Centric Approach: Your satisfaction is our priority. We work collaboratively to ensure that the final result aligns with your expectations.` },
      { en: `Efficiency: We understand the importance of completing projects on time. Our team is dedicated to delivering efficient solutions without compromising quality.`, ar: `Efficiency: We understand the importance of completing projects on time. Our team is dedicated to delivering efficient solutions without compromising quality.` },
      { en: `Personalization: We understand that each client's taste is unique. Our designs and solutions are tailored to your preferences, creating a bathroom that resonates with your individual style.`, ar: `Personalization: We understand that each client's taste is unique. Our designs and solutions are tailored to your preferences, creating a bathroom that resonates with your individual style.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "15",
      slug: "water-supply-and-drainage-system",
      sourceUrl: "https://dsccsaudia.com/service/water-supply-and-drainage-system",
      icon: "/assets/uploads/media-uploader/waste1695226342.svg",
      category: "MEP",
      name: { en: `Water Supply and Drainage System`, ar: `أنظمة المياه والصرف` },
      tagline: { en: `Water Supply and Drainage System`, ar: `Water Supply and Drainage System` },
      overview: { en: `Welcome to DSCC Water Supply and Drainage System Services, your trusted partner in creating, maintaining, and optimizing water management systems that ensure the smooth flow of water in and out of your residential or commercial spaces. Our experienced team specializes in providing comprehensive solutions for water supply and drainage needs, tailored to enhance efficiency and reliability. With a deep understanding of the importance of well-designed and properly functioning water supply and drainage systems, our skilled technicians bring years of expertise to every project. From planning and installation to maintenance and repairs, we prioritize effective water management that meets your requirements.`, ar: `Welcome to DSCC Water Supply and Drainage System Services, your trusted partner in creating, maintaining, and optimizing water management systems that ensure the smooth flow of water in and out of your residential or commercial spaces. Our experienced team specializes in providing comprehensive solutions for water supply and drainage needs, tailored to enhance efficiency and reliability. With a deep understanding of the importance of well-designed and properly functioning water supply and drainage systems, our skilled technicians bring years of expertise to every project. From planning and installation to maintenance and repairs, we prioritize effective water management that meets your requirements.` },
      features: [
  
      ],
      useCases: [
        { en: `Technical Expertise: Our technicians are skilled in designing, installing, and maintaining water supply and drainage systems, ensuring reliable and professional services.`, ar: `Technical Expertise: Our technicians are skilled in designing, installing, and maintaining water supply and drainage systems, ensuring reliable and professional services.` },
      { en: `Quality Assurance: We prioritize using high-quality materials and following industry best practices in our installations and repairs to ensure the longevity and optimal performance of your systems.`, ar: `Quality Assurance: We prioritize using high-quality materials and following industry best practices in our installations and repairs to ensure the longevity and optimal performance of your systems.` },
      { en: `Custom Solutions: Our solutions are tailored to meet your specific water management needs, whether it's a residential plumbing system or a commercial drainage network.`, ar: `Custom Solutions: Our solutions are tailored to meet your specific water management needs, whether it's a residential plumbing system or a commercial drainage network.` },
      { en: `Efficiency and Sustainability: Properly designed and maintained water supply and drainage systems contribute to efficient water usage and help minimize environmental impact.`, ar: `Efficiency and Sustainability: Properly designed and maintained water supply and drainage systems contribute to efficient water usage and help minimize environmental impact.` },
      { en: `Responsive Support: Our team is available to address your concerns and provide responsive support for routine maintenance, emergency repairs, or system upgrades.`, ar: `Responsive Support: Our team is available to address your concerns and provide responsive support for routine maintenance, emergency repairs, or system upgrades.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "16",
      slug: "boiler-system",
      sourceUrl: "https://dsccsaudia.com/service/boiler-system",
      icon: "/assets/uploads/media-uploader/boiler1695226343.svg",
      category: "MEP",
      name: { en: `Boiler System`, ar: `أنظمة الغلايات` },
      tagline: { en: `Boiler System`, ar: `Boiler System` },
      overview: { en: `Welcome to DSCC Boiler System Services, your trusted partner in providing efficient, reliable, and safe boiler solutions for residential and commercial spaces. Our expert team specializes in designing, installing, and maintaining boiler systems that deliver optimal heating performance while prioritizing energy efficiency and safety.`, ar: `Welcome to DSCC Boiler System Services, your trusted partner in providing efficient, reliable, and safe boiler solutions for residential and commercial spaces. Our expert team specializes in designing, installing, and maintaining boiler systems that deliver optimal heating performance while prioritizing energy efficiency and safety.` },
      features: [
  
      ],
      useCases: [
        { en: `Technical Excellence: Our technicians possess the expertise to design, install, and maintain various types of boiler systems, ensuring efficient and safe operations.`, ar: `Technical Excellence: Our technicians possess the expertise to design, install, and maintain various types of boiler systems, ensuring efficient and safe operations.` },
      { en: `Energy Efficiency Focus: We prioritize solutions that optimize energy consumption, helping you save on heating costs over time.`, ar: `Energy Efficiency Focus: We prioritize solutions that optimize energy consumption, helping you save on heating costs over time.` },
      { en: `Quality Materials: We use high-quality components and materials to ensure the reliability and longevity of your boiler system.`, ar: `Quality Materials: We use high-quality components and materials to ensure the reliability and longevity of your boiler system.` },
      { en: `Professional Installation: Our team ensures that your boiler system is installed correctly and efficiently, minimizing any disruptions.`, ar: `Professional Installation: Our team ensures that your boiler system is installed correctly and efficiently, minimizing any disruptions.` },
      { en: `Customer-Centric Approach: Your comfort, safety, and satisfaction are our primary focus. We work closely with you to ensure that your heating needs are met.`, ar: `Customer-Centric Approach: Your comfort, safety, and satisfaction are our primary focus. We work closely with you to ensure that your heating needs are met.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "17",
      slug: "special-equipment",
      sourceUrl: "https://dsccsaudia.com/service/special-equipment",
      icon: "/assets/uploads/media-uploader/special-equipment1695226341.svg",
      category: "Outdoor & Lifestyle",
      name: { en: `Special Equipment`, ar: `تجهيزات خاصة` },
      tagline: { en: `Special Equipment`, ar: `Special Equipment` },
      overview: { en: `DSCC Special Equipment Services, where we specialize in the installation, maintenance, and repair of specialized equipment such as elevators. With a strong commitment to safety, efficiency, and quality, our experienced technicians are dedicated to ensuring that your specialized equipment operates flawlessly, providing convenience and peace of mind.`, ar: `DSCC Special Equipment Services, where we specialize in the installation, maintenance, and repair of specialized equipment such as elevators. With a strong commitment to safety, efficiency, and quality, our experienced technicians are dedicated to ensuring that your specialized equipment operates flawlessly, providing convenience and peace of mind.` },
      features: [
  
      ],
      useCases: [
        { en: `Technical Expertise: Our technicians are highly skilled and trained to work on specialized equipment, ensuring that all installations, maintenance, and repairs are carried out to the highest standards.`, ar: `Technical Expertise: Our technicians are highly skilled and trained to work on specialized equipment, ensuring that all installations, maintenance, and repairs are carried out to the highest standards.` },
      { en: `Safety FirstSafety First: We prioritize the safety of users and occupants above all else. Our team follows strict safety protocols to ensure that your specialized equipment meets safety regulations and provides a secure experience.`, ar: `Safety FirstSafety First: We prioritize the safety of users and occupants above all else. Our team follows strict safety protocols to ensure that your specialized equipment meets safety regulations and provides a secure experience.` },
      { en: `Efficiency and Reliability: We understand that specialized equipment plays a crucial role in your daily operations. Our services are designed to keep your equipment running smoothly, minimizing disruptions and ensuring reliable performance.`, ar: `Efficiency and Reliability: We understand that specialized equipment plays a crucial role in your daily operations. Our services are designed to keep your equipment running smoothly, minimizing disruptions and ensuring reliable performance.` },
      { en: `Custom Solutions: We tailor our services to your specific needs and requirements. Our team works closely with you to provide solutions that align with your goals and constraints.`, ar: `Custom Solutions: We tailor our services to your specific needs and requirements. Our team works closely with you to provide solutions that align with your goals and constraints.` },
      { en: `Responsive Support: Whether you require routine maintenance or emergency repairs, our team is available to provide responsive and effective support whenever you need it.`, ar: `Responsive Support: Whether you require routine maintenance or emergency repairs, our team is available to provide responsive and effective support whenever you need it.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "18",
      slug: "swimming-pool-system",
      sourceUrl: "https://dsccsaudia.com/service/swimming-pool-system",
      icon: "/assets/uploads/media-uploader/swimming-pool-system1694201022.svg",
      category: "Outdoor & Lifestyle",
      name: { en: `Swimming Pool System`, ar: `أنظمة المسابح` },
      tagline: { en: `Swimming Pool System`, ar: `Swimming Pool System` },
      overview: { en: `Welcome to DSCC Swimming Pool System Services, your dedicated partner in creating, maintaining, and enhancing the ultimate aquatic oasis. Our expert technicians are here to ensure that your swimming pool system operates flawlessly, providing you with a serene and enjoyable environment for relaxation and recreation.`, ar: `Welcome to DSCC Swimming Pool System Services, your dedicated partner in creating, maintaining, and enhancing the ultimate aquatic oasis. Our expert technicians are here to ensure that your swimming pool system operates flawlessly, providing you with a serene and enjoyable environment for relaxation and recreation.` },
      features: [
        { en: `Installation: Transform your space into a haven of aquatic delight with our expert swimming pool installation services. Whether you're dreaming of a serene backyard retreat or a commercial pool complex, we offer tailored solutions that encompass design, construction, and installation to bring your vision to life.`, ar: `Installation: Transform your space into a haven of aquatic delight with our expert swimming pool installation services. Whether you're dreaming of a serene backyard retreat or a commercial pool complex, we offer tailored solutions that encompass design, construction, and installation to bring your vision to life.` },
      { en: `Maintenance: Proper maintenance is key to preserving the beauty and functionality of your swimming pool. Our comprehensive maintenance services cover everything from water quality testing and chemical balancing to filter cleaning and equipment inspections. By entrusting us with your pool's upkeep, you can enjoy crystal-clear waters year-round.`, ar: `Maintenance: Proper maintenance is key to preserving the beauty and functionality of your swimming pool. Our comprehensive maintenance services cover everything from water quality testing and chemical balancing to filter cleaning and equipment inspections. By entrusting us with your pool's upkeep, you can enjoy crystal-clear waters year-round.` },
      { en: `Repair: Even the most well-maintained swimming pools may encounter issues over time. Our technicians are well-equipped to diagnose and repair a wide range of pool-related problems, whether it's a malfunctioning pump, a leak, or issues with water circulation. Our prompt and efficient repair services ensure minimal downtime and maximum enjoyment.`, ar: `Repair: Even the most well-maintained swimming pools may encounter issues over time. Our technicians are well-equipped to diagnose and repair a wide range of pool-related problems, whether it's a malfunctioning pump, a leak, or issues with water circulation. Our prompt and efficient repair services ensure minimal downtime and maximum enjoyment.` },
      { en: `Upgrade and Renovation: Enhance the aesthetics and functionality of your swimming pool with our upgrade and renovation services. From energy-efficient equipment replacements to modernizing pool finishes and adding exciting features like waterfalls or lighting, we can breathe new life into your pool.`, ar: `Upgrade and Renovation: Enhance the aesthetics and functionality of your swimming pool with our upgrade and renovation services. From energy-efficient equipment replacements to modernizing pool finishes and adding exciting features like waterfalls or lighting, we can breathe new life into your pool.` }
      ],
      useCases: [
        { en: `Expert Technicians: Our technicians possess the expertise needed to handle every aspect of swimming pool systems, ensuring that installations, maintenance, and repairs are performed to the highest standards.`, ar: `Expert Technicians: Our technicians possess the expertise needed to handle every aspect of swimming pool systems, ensuring that installations, maintenance, and repairs are performed to the highest standards.` },
      { en: `Tailored Solutions: We understand that each pool is unique. Our services are customized to meet your specific requirements, ensuring that your pool remains a reflection of your personal style and preferences.`, ar: `Tailored Solutions: We understand that each pool is unique. Our services are customized to meet your specific requirements, ensuring that your pool remains a reflection of your personal style and preferences.` },
      { en: `Quality Assurance: We use high-quality materials and equipment in all our installations and repairs, ensuring that your swimming pool system stands the test of time.`, ar: `Quality Assurance: We use high-quality materials and equipment in all our installations and repairs, ensuring that your swimming pool system stands the test of time.` },
      { en: `Customer-Centric Approach: Your satisfaction and enjoyment are our top priorities. We work closely with you to understand your needs and deliver solutions that exceed your expectations.`, ar: `Customer-Centric Approach: Your satisfaction and enjoyment are our top priorities. We work closely with you to understand your needs and deliver solutions that exceed your expectations.` },
      { en: `Year-Round Support: Our team is available year-round to provide support, whether it's routine maintenance, emergency repairs, or guidance on pool system upgrades.`, ar: `Year-Round Support: Our team is available year-round to provide support, whether it's routine maintenance, emergency repairs, or guidance on pool system upgrades.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "19",
      slug: "it-system-services",
      sourceUrl: "https://dsccsaudia.com/service/it-system-services",
      icon: "/assets/uploads/media-uploader/data-management1695226336.svg",
      category: "Smart & Tech",
      name: { en: `IT System Services`, ar: `خدمات تقنية المعلومات` },
      tagline: { en: `IT System Services`, ar: `IT System Services` },
      overview: { en: `Welcome to DSCC IT System Services, your partner in harnessing the potential of technology to drive your business forward. Our expert team specializes in providing comprehensive IT solutions that empower your organization, enhance efficiency, and ensure seamless digital operations. With a deep understanding of the ever-evolving IT landscape, our experienced technicians bring years of expertise to every project. From designing and implementing IT systems to managing complex networks, we are committed to optimizing your digital infrastructure for success.`, ar: `Welcome to DSCC IT System Services, your partner in harnessing the potential of technology to drive your business forward. Our expert team specializes in providing comprehensive IT solutions that empower your organization, enhance efficiency, and ensure seamless digital operations. With a deep understanding of the ever-evolving IT landscape, our experienced technicians bring years of expertise to every project. From designing and implementing IT systems to managing complex networks, we are committed to optimizing your digital infrastructure for success.` },
      features: [
  
      ],
      useCases: [
        { en: `Technical Excellence: Our IT technicians are highly skilled and experienced, ensuring that your IT systems are designed, implemented, and maintained to the highest standards.`, ar: `Technical Excellence: Our IT technicians are highly skilled and experienced, ensuring that your IT systems are designed, implemented, and maintained to the highest standards.` },
      { en: `Tailored Solutions: We understand that every organization's IT needs are unique. Our solutions are customized to meet your specific requirements and industry standards.`, ar: `Tailored Solutions: We understand that every organization's IT needs are unique. Our solutions are customized to meet your specific requirements and industry standards.` },
      { en: `Innovation: We stay updated with the latest IT trends and technologies, ensuring that your systems are equipped with cutting-edge solutions.`, ar: `Innovation: We stay updated with the latest IT trends and technologies, ensuring that your systems are equipped with cutting-edge solutions.` },
      { en: `Data Security: We prioritize data security and privacy, implementing robust cybersecurity measures to protect your sensitive information.`, ar: `Data Security: We prioritize data security and privacy, implementing robust cybersecurity measures to protect your sensitive information.` },
      { en: `Reliability and Support: Our team provides ongoing support, monitoring, and maintenance to ensure the continuous operation of your IT systems.`, ar: `Reliability and Support: Our team provides ongoing support, monitoring, and maintenance to ensure the continuous operation of your IT systems.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "20",
      slug: "fitness-equipment",
      sourceUrl: "https://dsccsaudia.com/service/fitness-equipment",
      icon: "/assets/uploads/media-uploader/bike1695226343.svg",
      category: "Outdoor & Lifestyle",
      name: { en: `Fitness Equipment`, ar: `معدات اللياقة البدنية` },
      tagline: { en: `Fitness Equipment`, ar: `Fitness Equipment` },
      overview: { en: `Welcome to DSCC Fitness Equipment Services, where we specialize in providing top-of-the-line fitness equipment that empowers you to achieve your health and wellness goals. Our expert team is dedicated to delivering high-quality fitness solutions for both residential and commercial spaces, ensuring that you have the tools you need to lead an active and balanced lifestyle.`, ar: `Welcome to DSCC Fitness Equipment Services, where we specialize in providing top-of-the-line fitness equipment that empowers you to achieve your health and wellness goals. Our expert team is dedicated to delivering high-quality fitness solutions for both residential and commercial spaces, ensuring that you have the tools you need to lead an active and balanced lifestyle.` },
      features: [
  
      ],
      useCases: [
        { en: `Industry Knowledge: Our team understands the importance of high-quality fitness equipment in achieving optimal results and promoting overall well-being.`, ar: `Industry Knowledge: Our team understands the importance of high-quality fitness equipment in achieving optimal results and promoting overall well-being.` },
      { en: `Customization: We offer tailored solutions that match your fitness goals, available space, and budget.`, ar: `Customization: We offer tailored solutions that match your fitness goals, available space, and budget.` },
      { en: `Quality Assurance: We provide equipment from reputable brands that adhere to safety standards and offer reliable performance.`, ar: `Quality Assurance: We provide equipment from reputable brands that adhere to safety standards and offer reliable performance.` },
      { en: `Professional Installation: Our team ensures that your fitness equipment is installed correctly and safely, optimizing your workout experience.`, ar: `Professional Installation: Our team ensures that your fitness equipment is installed correctly and safely, optimizing your workout experience.` },
      { en: `Customer-Centric Approach: Your satisfaction, health, and fitness journey are our primary focus. We work closely with you to ensure your needs are met.`, ar: `Customer-Centric Approach: Your satisfaction, health, and fitness journey are our primary focus. We work closely with you to ensure your needs are met.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "21",
      slug: "outdoor-and-landscape-solutions",
      sourceUrl: "https://dsccsaudia.com/service/outdoor-&-landscape-solutions",
      icon: "/assets/uploads/media-uploader/field1695226337.svg",
      category: "Outdoor & Lifestyle",
      name: { en: `Outdoor & Landscape Solutions`, ar: `تنسيق المواقع الخارجية` },
      tagline: { en: `Outdoor & Landscape Solutions`, ar: `Outdoor & Landscape Solutions` },
      overview: { en: `Welcome to DSCC Outdoor & Landscape Solutions, your partner in creating captivating outdoor environments that blend natural beauty with artistic design. Our expert team specializes in crafting outdoor spaces that reflect your lifestyle, enhance the appeal of your property, and provide a sanctuary for relaxation and enjoyment.`, ar: `Welcome to DSCC Outdoor & Landscape Solutions, your partner in creating captivating outdoor environments that blend natural beauty with artistic design. Our expert team specializes in crafting outdoor spaces that reflect your lifestyle, enhance the appeal of your property, and provide a sanctuary for relaxation and enjoyment.` },
      features: [
  
      ],
      useCases: [
        { en: `Design Expertise: Our landscape designers have an eye for detail and a knack for creating outdoor spaces that resonate with your style and preferences.`, ar: `Design Expertise: Our landscape designers have an eye for detail and a knack for creating outdoor spaces that resonate with your style and preferences.` },
      { en: `Custom Solutions: We understand that every property is unique. Our solutions are tailored to your space, ensuring that your landscape reflects your personality and vision.`, ar: `Custom Solutions: We understand that every property is unique. Our solutions are tailored to your space, ensuring that your landscape reflects your personality and vision.` },
      { en: `Aesthetic Appeal: We combine nature's beauty with thoughtful design elements to create outdoor spaces that are both visually stunning and functional.`, ar: `Aesthetic Appeal: We combine nature's beauty with thoughtful design elements to create outdoor spaces that are both visually stunning and functional.` },
      { en: `Quality Craftsmanship: Our installations are carried out with meticulous care, using high-quality materials and techniques to ensure longevity and durability.`, ar: `Quality Craftsmanship: Our installations are carried out with meticulous care, using high-quality materials and techniques to ensure longevity and durability.` },
      { en: `Customer-Centric Approach: Your satisfaction and the realization of your outdoor dreams are our primary focus. We work closely with you to bring your vision to life.`, ar: `Customer-Centric Approach: Your satisfaction and the realization of your outdoor dreams are our primary focus. We work closely with you to bring your vision to life.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "22",
      slug: "hospitality-supplies",
      sourceUrl: "https://dsccsaudia.com/service/hospitality-supplies",
      icon: "/assets/uploads/media-uploader/room-service1695226339.svg",
      category: "Hospitality",
      name: { en: `Hospitality Supplies`, ar: `مستلزمات الضيافة` },
      tagline: { en: `Hospitality Supplies`, ar: `Hospitality Supplies` },
      overview: { en: `Welcome to DSCC Hospitality Supplies Solution, where we specialize in providing comprehensive and tailored hospitality supplies that enhance the comfort, convenience, and overall experience for your guests. Our expert team understands the importance of every detail in creating memorable stays and events, and we are dedicated to delivering high-quality supplies that reflect your establishment's standards and values.`, ar: `Welcome to DSCC Hospitality Supplies Solution, where we specialize in providing comprehensive and tailored hospitality supplies that enhance the comfort, convenience, and overall experience for your guests. Our expert team understands the importance of every detail in creating memorable stays and events, and we are dedicated to delivering high-quality supplies that reflect your establishment's standards and values.` },
      features: [
  
      ],
      useCases: [
        { en: `Industry Knowledge: Our team understands the specific needs and requirements of the hospitality sector, ensuring that the supplies we provide enhance the guest experience.`, ar: `Industry Knowledge: Our team understands the specific needs and requirements of the hospitality sector, ensuring that the supplies we provide enhance the guest experience.` },
      { en: `Customization: We offer tailor-made solutions that cater to your establishment's unique needs, whether it's for guest rooms, events, dining, or other aspects of your business.`, ar: `Customization: We offer tailor-made solutions that cater to your establishment's unique needs, whether it's for guest rooms, events, dining, or other aspects of your business.` },
      { en: `Quality: We are committed to providing high-quality supplies that align with your establishment's standards and values.`, ar: `Quality: We are committed to providing high-quality supplies that align with your establishment's standards and values.` },
      { en: `Reliability: Our timely and efficient supply services ensure that you have the essentials you need, when you need them.`, ar: `Reliability: Our timely and efficient supply services ensure that you have the essentials you need, when you need them.` },
      { en: `Customer-Centric Approach: Your satisfaction and the enhancement of guest experience through thoughtful supplies are our primary focus.`, ar: `Customer-Centric Approach: Your satisfaction and the enhancement of guest experience through thoughtful supplies are our primary focus.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "23",
      slug: "linen-chute-solution",
      sourceUrl: "https://dsccsaudia.com/service/linen-chute-solution",
      icon: "/assets/uploads/media-uploader/linen-chute-solution1695226338.svg",
      category: "Hospitality",
      name: { en: `Linen Chute Solution`, ar: `أنظمة نقل البياضات` },
      tagline: { en: `Linen Chute Solution`, ar: `Linen Chute Solution` },
      overview: { en: `Welcome to DSCC Linen Chute Solutions, where we specialize in providing innovative and efficient solutions for the disposal of linens and other materials in various commercial and residential settings. Our expert team is dedicated to simplifying waste management processes while maintaining high standards of hygiene, safety, and convenience. With a deep understanding of waste management challenges and a commitment to excellence, our skilled professionals have developed specialized expertise in designing, installing, and maintaining linen chutes that cater to the unique needs of different environments. From hotels and hospitals to apartment complexes and commercial buildings, our solutions are tailored to enhance waste disposal efficiency.`, ar: `Welcome to DSCC Linen Chute Solutions, where we specialize in providing innovative and efficient solutions for the disposal of linens and other materials in various commercial and residential settings. Our expert team is dedicated to simplifying waste management processes while maintaining high standards of hygiene, safety, and convenience. With a deep understanding of waste management challenges and a commitment to excellence, our skilled professionals have developed specialized expertise in designing, installing, and maintaining linen chutes that cater to the unique needs of different environments. From hotels and hospitals to apartment complexes and commercial buildings, our solutions are tailored to enhance waste disposal efficiency.` },
      features: [
  
      ],
      useCases: [
        { en: `Tailored Solutions: We understand that each facility has unique needs. Our solutions are customized to fit your space, ensuring seamless integration and optimal functionality.`, ar: `Tailored Solutions: We understand that each facility has unique needs. Our solutions are customized to fit your space, ensuring seamless integration and optimal functionality.` },
      { en: `Hygiene and Safety: Maintaining a clean and safe environment is our priority. Our linen chutes are designed to promote hygiene and prevent cross-contamination.`, ar: `Hygiene and Safety: Maintaining a clean and safe environment is our priority. Our linen chutes are designed to promote hygiene and prevent cross-contamination.` },
      { en: `Efficiency: Our solutions streamline waste disposal processes, saving time and effort for your staff or residents.`, ar: `Efficiency: Our solutions streamline waste disposal processes, saving time and effort for your staff or residents.` },
      { en: `Experience: With a track record of successful installations and maintenance, our team brings a wealth of experience to every project.`, ar: `Experience: With a track record of successful installations and maintenance, our team brings a wealth of experience to every project.` },
      { en: `Customer-Centric Approach: We value your satisfaction and work closely with you to deliver solutions that align with your goals and preferences.`, ar: `Customer-Centric Approach: We value your satisfaction and work closely with you to deliver solutions that align with your goals and preferences.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "24",
      slug: "decoration-and-artwork",
      sourceUrl: "https://dsccsaudia.com/service/decoration-and-artwork",
      icon: "/assets/uploads/media-uploader/living-room1695226339.svg",
      category: "Hospitality",
      name: { en: `Decoration and Artwork`, ar: `الديكور والأعمال الفنية` },
      tagline: { en: `Decoration and Artwork`, ar: `Decoration and Artwork` },
      overview: { en: `Welcome to DSCC Decoration and Artwork Services, where we specialize in curating and creating captivating decor and artwork solutions that infuse your spaces with personality, elegance, and visual intrigue. Our expert team is dedicated to enhancing the aesthetics and ambiance of your residential or commercial environments through thoughtfully selected and curated decorations and artwork. With an eye for design and a deep appreciation for aesthetics, our skilled curators and designers bring years of expertise to every project. Whether you're seeking to elevate a room's ambiance, add a touch of sophistication to your business space, or express your individual style, we have the knowledge and creativity to turn your vision into reality.`, ar: `Welcome to DSCC Decoration and Artwork Services, where we specialize in curating and creating captivating decor and artwork solutions that infuse your spaces with personality, elegance, and visual intrigue. Our expert team is dedicated to enhancing the aesthetics and ambiance of your residential or commercial environments through thoughtfully selected and curated decorations and artwork. With an eye for design and a deep appreciation for aesthetics, our skilled curators and designers bring years of expertise to every project. Whether you're seeking to elevate a room's ambiance, add a touch of sophistication to your business space, or express your individual style, we have the knowledge and creativity to turn your vision into reality.` },
      features: [
  
      ],
      useCases: [
        { en: `Design Expertise: Our curators and designers have an eye for detail and an understanding of how decor and artwork contribute to the overall aesthetics of a space.`, ar: `Design Expertise: Our curators and designers have an eye for detail and an understanding of how decor and artwork contribute to the overall aesthetics of a space.` },
      { en: `Customization: We understand that each space is unique. Our solutions are tailored to your design preferences and objectives.`, ar: `Customization: We understand that each space is unique. Our solutions are tailored to your design preferences and objectives.` },
      { en: `Quality Craftsmanship: We prioritize using high-quality materials and craftsmanship to ensure the beauty and longevity of the decorations and artwork.`, ar: `Quality Craftsmanship: We prioritize using high-quality materials and craftsmanship to ensure the beauty and longevity of the decorations and artwork.` },
      { en: `Professional Installation: Our team ensures that the selected decorations and artwork are expertly installed, ensuring the best presentation.`, ar: `Professional Installation: Our team ensures that the selected decorations and artwork are expertly installed, ensuring the best presentation.` },
      { en: `Customer-Centric Approach: Your satisfaction and the creation of visually captivating spaces are our primary focus.`, ar: `Customer-Centric Approach: Your satisfaction and the creation of visually captivating spaces are our primary focus.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    },
  {
      id: "25",
      slug: "hospitality-signage-and-wayfinding",
      sourceUrl: "https://dsccsaudia.com/service/hospitality-signage-&-wayfinding",
      icon: "/assets/uploads/media-uploader/hotel1694202447.svg",
      category: "Hospitality",
      name: { en: `Hospitality Signage & Wayfinding1`, ar: `اللافتات والإرشاد` },
      tagline: { en: `Hospitality Signage & Wayfinding1`, ar: `Hospitality Signage & Wayfinding1` },
      overview: { en: `Welcome to DSCC Hospitality Signage & Wayfinding Services, where we specialize in creating elegant and effective signage solutions that enhance the guest experience in your hospitality establishment. Our expert team understands the importance of clear communication and seamless navigation, and we are dedicated to providing signage that reflects your brand while guiding your guests with precision.`, ar: `Welcome to DSCC Hospitality Signage & Wayfinding Services, where we specialize in creating elegant and effective signage solutions that enhance the guest experience in your hospitality establishment. Our expert team understands the importance of clear communication and seamless navigation, and we are dedicated to providing signage that reflects your brand while guiding your guests with precision.` },
      features: [
        { en: `Signage Design: Our experts collaborate closely with you to understand your branding and wayfinding needs. We design signage that aligns with your aesthetics and effectively communicates information to your guests.`, ar: `Signage Design: Our experts collaborate closely with you to understand your branding and wayfinding needs. We design signage that aligns with your aesthetics and effectively communicates information to your guests.` },
      { en: `Wayfinding Solutions: Navigating large hospitality spaces can be overwhelming for guests. We offer comprehensive wayfinding solutions that guide guests seamlessly from entry to their desired destinations.`, ar: `Wayfinding Solutions: Navigating large hospitality spaces can be overwhelming for guests. We offer comprehensive wayfinding solutions that guide guests seamlessly from entry to their desired destinations.` },
      { en: `Branded Signage: Enhance brand visibility and recognition with branded signage that showcases your establishment's identity and adds a touch of sophistication to your space.`, ar: `Branded Signage: Enhance brand visibility and recognition with branded signage that showcases your establishment's identity and adds a touch of sophistication to your space.` }
      ],
      useCases: [
        { en: `Directional Signage: Clearly guide guests to reception areas, amenities, guest rooms, dining spaces, and other important locations.`, ar: `Directional Signage: Clearly guide guests to reception areas, amenities, guest rooms, dining spaces, and other important locations.` },
      { en: `Informational Signage: Provide essential information such as check-in details, event schedules, safety instructions, and more.`, ar: `Informational Signage: Provide essential information such as check-in details, event schedules, safety instructions, and more.` },
      { en: `Aesthetic Appeal: Our signage solutions are designed to blend seamlessly with your hospitality décor, creating a cohesive and visually pleasing environment.`, ar: `Aesthetic Appeal: Our signage solutions are designed to blend seamlessly with your hospitality décor, creating a cohesive and visually pleasing environment.` },
      { en: `Accessibility: Ensure your establishment is accessible to all guests by incorporating ADA-compliant signage that accommodates individuals with disabilities.`, ar: `Accessibility: Ensure your establishment is accessible to all guests by incorporating ADA-compliant signage that accommodates individuals with disabilities.` },
      { en: `Consistency: Maintain a consistent design and branding throughout your signage to enhance brand recognition and guest experience.`, ar: `Consistency: Maintain a consistent design and branding throughout your signage to enhance brand recognition and guest experience.` }
      ],
      faqs: [],
      sectors: ["residential","commercial","hospitality","infrastructure"],
    }
  ];

  export function getServiceBySlug(slug: string): Service | undefined {
    return services.find((s) => s.slug === slug);
  }
  