// Sector taxonomy with Arabic content provided verbatim by client.

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
  { en: "Residential",    ar: "سكني" },
  { en: "Infrastructure", ar: "بنية تحتية" },
  { en: "Commercial",     ar: "تجاري" },
  { en: "Hospitality",    ar: "ضيافة" },
];

export const sectors: Sector[] = [
  {
    id: "residential",
    slug: "residential",
    name: { en: "Residential", ar: "سكني" },
    tagline: {
      en: "Crafting every detail to create harmonious spaces that reflect your personality & lifestyle",
      ar: "نقدم حلولاً متكاملة للمشاريع السكنية تجمع بين الراحة والجودة.",
    },
    overview: {
      en: "Crafting every detail to create harmonious spaces that reflect your personality & lifestyle",
      ar: "نقدم حلولاً متكاملة للمشاريع السكنية تجمع بين الراحة والجودة.",
    },
    needs: [],
    process: [],
    faqs: [],
    serviceSlugs: allServiceSlugs,
    image: "/assets/uploads/media-uploader/cover021693834064.jpg",
  },
  {
    id: "commercial",
    slug: "commercial",
    name: { en: "Commercial", ar: "تجاري" },
    tagline: {
      en: "Architectural solutions tailored to your unique needs, preferences and project requirements",
      ar: "حلول مصممة لدعم بيئات الأعمال وتحسين الكفاءة.",
    },
    overview: {
      en: "Architectural solutions tailored to your unique needs, preferences and project requirements",
      ar: "حلول مصممة لدعم بيئات الأعمال وتحسين الكفاءة.",
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
    name: { en: "Hospitality", ar: "ضيافة" },
    tagline: {
      en: "We create a seamless harmony that blends functionality, comfort and aesthetics",
      ar: "تجهيزات متكاملة تعزز تجربة الضيوف.",
    },
    overview: {
      en: "We create a seamless harmony that blends functionality, comfort and aesthetics",
      ar: "تجهيزات متكاملة تعزز تجربة الضيوف.",
    },
    needs: [],
    process: [],
    faqs: [],
    serviceSlugs: allServiceSlugs,
    image: "/assets/uploads/media-uploader/cover041693834210.jpg",
  },
  {
    id: "infrastructure",
    slug: "infrastructure",
    name: { en: "Infrastructure", ar: "بنية تحتية" },
    tagline: {
      en: "One-stop solution provider of consultancy, design, building supplies and equipment.",
      ar: "حلول للمشاريع الكبرى تضمن الاستدامة.",
    },
    overview: {
      en: "One-stop solution provider of consultancy, design, building supplies and equipment.",
      ar: "حلول للمشاريع الكبرى تضمن الاستدامة.",
    },
    needs: [],
    process: [],
    faqs: [],
    serviceSlugs: allServiceSlugs,
    image: "/assets/uploads/media-uploader/cover011693833991.jpg",
  },
];

export function getSectorBySlug(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug);
}
