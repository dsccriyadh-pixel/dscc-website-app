// Sector taxonomy mirrored from dsccsaudia.com service-page tabs.
// Arabic provided manually since source has no Arabic content.

import type { BilingualString, Faq } from "./services";
import { services } from "./services";

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

const allServiceSlugs = services.map((s) => s.slug);

export const sectorTabs: BilingualString[] = [
  { en: "All Soultions",  ar: "جميع الحلول" },
  { en: "Residential",    ar: "السكني" },
  { en: "Infrastructure", ar: "البنية التحتية" },
  { en: "Commercial",     ar: "التجاري" },
  { en: "Hospitality",    ar: "الضيافة" },
];

export const sectors: Sector[] = [
  {
    id: "residential",
    slug: "residential",
    name: { en: "Residential", ar: "السكني" },
    tagline: {
      en: "Crafting every detail to create harmonious spaces that reflect your personality & lifestyle",
      ar: "نُتقن كلّ تفصيل لخلق مساحات متناغمة تعكس شخصيّتك وأسلوب حياتك",
    },
    overview: {
      en: "Crafting every detail to create harmonious spaces that reflect your personality & lifestyle",
      ar: "نُتقن كلّ تفصيل لخلق مساحات متناغمة تعكس شخصيّتك وأسلوب حياتك",
    },
    needs: [],
    process: [],
    faqs: [],
    serviceSlugs: allServiceSlugs,
    image: "/assets/uploads/media-uploader/cover021693834064.jpg",
  },
  {
    id: "infrastructure",
    slug: "infrastructure",
    name: { en: "Infrastructure", ar: "البنية التحتية" },
    tagline: {
      en: "One-stop solution provider of consultancy, design, building supplies and equipment.",
      ar: "مزوّد متكامل لخدمات الاستشارة والتصميم وتوريد مواد ومعدّات البناء.",
    },
    overview: {
      en: "One-stop solution provider of consultancy, design, building supplies and equipment.",
      ar: "مزوّد متكامل لخدمات الاستشارة والتصميم وتوريد مواد ومعدّات البناء.",
    },
    needs: [],
    process: [],
    faqs: [],
    serviceSlugs: allServiceSlugs,
    image: "/assets/uploads/media-uploader/cover011693833991.jpg",
  },
  {
    id: "commercial",
    slug: "commercial",
    name: { en: "Commercial", ar: "التجاري" },
    tagline: {
      en: "Architectural solutions tailored to your unique needs, preferences and project requirements",
      ar: "حلول معمارية مفصّلة وفق احتياجاتك وتفضيلاتك ومتطلبات مشروعك",
    },
    overview: {
      en: "Architectural solutions tailored to your unique needs, preferences and project requirements",
      ar: "حلول معمارية مفصّلة وفق احتياجاتك وتفضيلاتك ومتطلبات مشروعك",
    },
    needs: [],
    process: [],
    faqs: [],
    serviceSlugs: allServiceSlugs,
    image: "/assets/uploads/media-uploader/cover031693834151.jpg",
  },
  {
    id: "hospitality",
    slug: "hospitality",
    name: { en: "Hospitality", ar: "الضيافة" },
    tagline: {
      en: "We create a seamless harmony that blends functionality, comfort and aesthetics",
      ar: "نخلق انسجاماً سلساً يمزج بين الوظيفة والراحة والجمال",
    },
    overview: {
      en: "We create a seamless harmony that blends functionality, comfort and aesthetics",
      ar: "نخلق انسجاماً سلساً يمزج بين الوظيفة والراحة والجمال",
    },
    needs: [],
    process: [],
    faqs: [],
    serviceSlugs: allServiceSlugs,
    image: "/assets/uploads/media-uploader/cover041693834210.jpg",
  },
];

export function getSectorBySlug(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug);
}
