import { getConsent, hasAdsConsent } from "@/lib/tracking";

export const META_PIXEL_ID = "2767855866945056";
type MetaFn = ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string };

declare global {
  interface Window {
    fbq?: MetaFn;
    _fbq?: MetaFn;
    __dsccMetaLoad?: (consent: ReturnType<typeof getConsent>) => void;
    __dsccMetaInitialized?: boolean;
    __dsccMetaScriptLoaded?: boolean;
  }
}

let initialized = false;
let active = false;
let lastPage = "";
const recent = new Map<string, number>();

function permitted(): boolean {
  if (!hasAdsConsent()) {
    active = false;
    return false;
  }
  return active;
}

function ensurePixel(): boolean {
  if (!hasAdsConsent()) return false;
  window.__dsccMetaLoad?.(getConsent());
  if (window.__dsccMetaInitialized) initialized = true;
  if (!window.fbq) {
    const fbq = ((...args: unknown[]) => {
      fbq.queue = fbq.queue || [];
      fbq.queue.push(args);
    }) as MetaFn;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;
  }
  if (!window.__dsccMetaScriptLoaded && !document.querySelector('script[data-dscc-meta-pixel="true"], script[src*="connect.facebook.net/en_US/fbevents.js"]')) {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.dataset.dsccMetaPixel = "true";
    document.head.appendChild(script);
    window.__dsccMetaScriptLoaded = true;
  }
  if (!initialized && !window.__dsccMetaInitialized) {
    window.fbq("init", META_PIXEL_ID);
    initialized = true;
    window.__dsccMetaInitialized = true;
  }
  active = true;
  return true;
}

function emit(name: string, params: Record<string, unknown> = {}, dedupeKey = name, eventID?: string): void {
  if (!ensurePixel() || !permitted()) return;
  const now = Date.now();
  const previous = recent.get(dedupeKey) || 0;
  if (now - previous < 1200) return;
  recent.set(dedupeKey, now);
  if (recent.size > 100) for (const [key, at] of recent) if (now - at > 10_000) recent.delete(key);
  if (eventID) window.fbq?.("track", name, params, { eventID });
  else window.fbq?.("track", name, params);
}

export function initMeta(): void {
  if (!hasAdsConsent()) return;
  ensurePixel();
}

export function trackMetaPageView(path: string): void {
  if (!ensurePixel() || !permitted()) return;
  const normalized = path || "/";
  if (normalized === lastPage) return;
  lastPage = normalized;
  window.fbq?.("track", "PageView");
  const lower = normalized.toLowerCase();
  const category =
    lower === "/quote" ? "Request Quote"
      : /furniture/.test(lower) ? "Furniture"
        : /hospitality/.test(lower) ? "Hospitality"
        : /hotel(-|_)?fit|hotel-fit/.test(lower) ? "Hotel Fit-Out"
            : /residential(-|_)?fit|residential-fit|villa-fit/.test(lower) ? "Residential Fit-Out"
              : /commercial(-|_)?fit|commercial-fit|office-fit/.test(lower) ? "Commercial Fit-Out"
                : /ff[&-]?e/.test(lower) ? "FF&E"
                  : /kitchens?/.test(lower) ? "Kitchens"
                    : /wardrobes?/.test(lower) ? "Wardrobes"
                      : /doors?(-|_)?windows?|windows?(-|_)?doors?|window-and-door/.test(lower) ? "Doors and Windows"
                        : /smart(-|_)?home/.test(lower) ? "Smart Home"
                          : /\bmep\b|mep-/.test(lower) ? "MEP"
                            : lower.startsWith("/services") ? "Services"
                              : lower.startsWith("/projects") ? "Projects"
                                : lower.startsWith("/sectors") ? "Sectors"
                                  : lower.startsWith("/contact") ? "Contact"
                                    : "Page";
  const segments = normalized.split("/").filter(Boolean);
  const slug = segments.length > 1 ? segments[segments.length - 1] : undefined;
  emit("ViewContent", {
    content_name: slug || normalized,
    content_category: category,
    ...(slug ? { content_ids: [slug], content_type: "product" } : {}),
  }, `view:${normalized}`);
}

export function trackMetaContact(method: "whatsapp" | "phone" | "email" | "chatbot"): void {
  emit("Contact", { contact_method: method }, `contact:${method}`);
}

export function trackMetaRequestQuote(): void {
  emit("RequestQuote", {}, "request_quote");
}

export function trackMetaLead(eventId: string): void {
  if (!eventId || !ensurePixel() || !permitted()) return;
  // event_id is shared with CAPI/other client conversions. Do not include
  // names, email, phone, or any other browser-side customer data here.
  emit("Lead", {}, `lead:${eventId}`, eventId);
}

export function stopMeta(): void {
  active = false;
  lastPage = "";
}

export function metaConsentChoicesChanged(): void {
  if (getConsent().ad_storage !== "granted" || getConsent().ad_user_data !== "granted" || getConsent().ad_personalization !== "granted") stopMeta();
  else initMeta();
}