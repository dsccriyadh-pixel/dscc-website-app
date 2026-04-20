// Sector taxonomy mirrored from dsccsaudia.com service-page tabs.
// English text is from source. Arabic intentionally identical pending
// human Arabic review (see public/extract/source-mapping-report.md).

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
  { en: "All Soultions", ar: "All Soultions" },
  { en: "Residential", ar: "Residential" },
  { en: "Infrastructure", ar: "Infrastructure" },
  { en: "Commercial", ar: "Commercial" },
  { en: "Hospitality", ar: "Hospitality" },
];

export const sectors: Sector[] = [
  {
    id: "residential",
    slug: "residential",
    name: { en: "Residential", ar: "Residential" },
    tagline: {
      en: "Crafting every detail to create harmonious spaces that reflect your personality & lifestyle",
      ar: "Crafting every detail to create harmonious spaces that reflect your personality & lifestyle",
    },
    overview: {
      en: "Crafting every detail to create harmonious spaces that reflect your personality & lifestyle",
      ar: "Crafting every detail to create harmonious spaces that reflect your personality & lifestyle",
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
    name: { en: "Infrastructure", ar: "Infrastructure" },
    tagline: {
      en: "One-stop solution provider of consultancy, design, building supplies and equipment.",
      ar: "One-stop solution provider of consultancy, design, building supplies and equipment.",
    },
    overview: {
      en: "One-stop solution provider of consultancy, design, building supplies and equipment.",
      ar: "One-stop solution provider of consultancy, design, building supplies and equipment.",
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
    name: { en: "Commercial", ar: "Commercial" },
    tagline: {
      en: "Architectural solutions tailored to your unique needs, preferences and project requirements",
      ar: "Architectural solutions tailored to your unique needs, preferences and project requirements",
    },
    overview: {
      en: "Architectural solutions tailored to your unique needs, preferences and project requirements",
      ar: "Architectural solutions tailored to your unique needs, preferences and project requirements",
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
    name: { en: "Hospitality", ar: "Hospitality" },
    tagline: {
      en: "We create a seamless harmony that blends functionality, comfort and aesthetics",
      ar: "We create a seamless harmony that blends functionality, comfort and aesthetics",
    },
    overview: {
      en: "We create a seamless harmony that blends functionality, comfort and aesthetics",
      ar: "We create a seamless harmony that blends functionality, comfort and aesthetics",
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
