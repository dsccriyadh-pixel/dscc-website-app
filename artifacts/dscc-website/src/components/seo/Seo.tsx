import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_NAME = "DSCC Saudi Arabia";
const SITE_URL = typeof window !== "undefined" ? window.location.origin : "https://dscc-sa.com";

function ensureMeta(selector: string, attr: string, value: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (!el) {
    if (selector.startsWith("link")) {
      el = document.createElement("link");
    } else {
      el = document.createElement("meta");
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
  if (el instanceof HTMLMetaElement) el.setAttribute("content", content);
  else el.setAttribute("href", content);
  return el;
}

export function Seo({ title, description, path, image, type = "website", jsonLd }: SeoProps) {
  const { lang } = useLanguage();
  const fullTitle = `${title} — ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const img = image ? `${SITE_URL}/${image.replace(/^\//, "")}` : `${SITE_URL}/img/hero-skyline.png`;

  useEffect(() => {
    document.title = fullTitle;

    const created: Element[] = [];
    const track = (el: Element | null) => { if (el) created.push(el); };

    track(ensureMeta('meta[name="description"]', "name", "description", description));
    track(ensureMeta('link[rel="canonical"]', "rel", "canonical", url));
    track(ensureMeta('meta[property="og:title"]', "property", "og:title", fullTitle));
    track(ensureMeta('meta[property="og:description"]', "property", "og:description", description));
    track(ensureMeta('meta[property="og:url"]', "property", "og:url", url));
    track(ensureMeta('meta[property="og:type"]', "property", "og:type", type));
    track(ensureMeta('meta[property="og:image"]', "property", "og:image", img));
    track(ensureMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME));
    track(ensureMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image"));
    track(ensureMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle));
    track(ensureMeta('meta[name="twitter:description"]', "name", "twitter:description", description));
    track(ensureMeta('meta[name="twitter:image"]', "name", "twitter:image", img));

    // hreflang alt
    const hreflangs: { hreflang: string; href: string }[] = [
      { hreflang: "en", href: `${SITE_URL}${path}` },
      { hreflang: "ar", href: `${SITE_URL}${path}` },
      { hreflang: "x-default", href: `${SITE_URL}${path}` },
    ];
    hreflangs.forEach((h) => {
      const sel = `link[rel="alternate"][hreflang="${h.hreflang}"]`;
      let l = document.head.querySelector<HTMLLinkElement>(sel);
      if (!l) {
        l = document.createElement("link");
        l.setAttribute("rel", "alternate");
        l.setAttribute("hreflang", h.hreflang);
        document.head.appendChild(l);
      }
      l.setAttribute("href", h.href);
    });

    // JSON-LD
    document.head.querySelectorAll('script[data-seo-jsonld="true"]').forEach((n) => n.remove());
    const blocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
    blocks.forEach((block) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.dataset.seoJsonld = "true";
      s.text = JSON.stringify(block);
      document.head.appendChild(s);
    });

    document.documentElement.lang = lang;
  }, [fullTitle, description, url, type, img, lang, JSON.stringify(jsonLd)]);

  return null;
}

export const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  sameAs: [],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Olaya Towers, King Fahd Road",
    addressLocality: "Riyadh",
    postalCode: "12244",
    addressCountry: "SA",
  },
  contactPoint: [
    { "@type": "ContactPoint", telephone: "+966-11-200-1234", contactType: "sales", areaServed: "SA", availableLanguage: ["en", "ar"] },
  ],
};
