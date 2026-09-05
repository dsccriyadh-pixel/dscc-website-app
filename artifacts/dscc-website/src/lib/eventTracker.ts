import { trackGa4Action } from "@/lib/ga4";
import { getCurrentSearch } from "@/lib/urlSearch";
import { getAttribution } from "@/lib/attribution";
import { getConsent, hasAdsConsent, pushDataLayer, sendAdsConversion } from "@/lib/tracking";

// Lightweight internal action tracking — sends a beacon per user action to /api/event.
// Captures WhatsApp / phone / email clicks globally plus explicit events (chat open, etc).
// No cookies, no personal data.

function deriveSource(): string {
  const q = new URLSearchParams(getCurrentSearch());
  if (q.get("ScCid") || q.get("sccid")) return "snapchat";
  const utm = q.get("utm_source");
  if (utm) return utm.toLowerCase().slice(0, 40);
  if (q.get("gclid")) return "google_ads";
  if (q.get("fbclid")) return "facebook";
  if (q.get("ttclid")) return "tiktok";
  const ref = document.referrer;
  if (ref) {
    try {
      const host = new URL(ref).hostname.replace(/^www\./, "");
      if (host && host !== window.location.hostname.replace(/^www\./, "")) {
        return host.slice(0, 60);
      }
    } catch {
      /* ignore malformed referrer */
    }
  }
  return "direct";
}

const sessionSource = deriveSource();

export function getTrackingSource(): string {
  return sessionSource;
}

function currentPath(): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  let p = window.location.pathname;
  if (base && p.startsWith(base)) p = p.slice(base.length) || "/";
  return p.slice(0, 200);
}

let lastEvent = "";
let lastEventAt = 0;
const recentEvents = new Map<string, number>();

export function trackEvent(type: string, label = ""): void {
  const now = Date.now();
  const key = `${type}|${label}`;
  if (key === lastEvent && now - lastEventAt < 800) return;
  if (now - (recentEvents.get(key) || 0) < 10_000) return;
  lastEvent = key;
  lastEventAt = now;
  recentEvents.set(key, now);
  if (recentEvents.size > 100) for (const [k, at] of recentEvents) if (now - at > 10_000) recentEvents.delete(k);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const standardizedType =
    type === "quote_submit" || type === "contact_submit" || type === "calculator_lead"
      ? "generate_lead"
      : type === "showroom_booking"
        ? "book_appointment"
        : type;
  const dataLayerType =
    standardizedType === "whatsapp_click"
      ? "dscc_whatsapp_click"
      : standardizedType === "phone_click"
        ? "dscc_phone_click"
        : standardizedType;
  const eventId = pushDataLayer(dataLayerType, { label: label.slice(0, 200) });
  const payload = JSON.stringify({
    type: standardizedType.slice(0, 40),
    label: label.slice(0, 200),
    path: currentPath(),
    src: sessionSource,
    event_id: eventId,
    attribution: getAttribution(),
    consent: getConsent(),
  });
  const url = `${base}/api/event`;
  trackGa4Action(standardizedType, label, eventId);
  if (standardizedType === "whatsapp_click") {
    void sendAdsConversion("whatsapp", eventId, {
      pagePath: currentPath(),
      language: document.documentElement.lang || "en",
      buttonPlacement: label || "link",
      destinationUrl: "https://wa.me/966551504974",
    });
  }
  if (standardizedType === "phone_click") {
    void sendAdsConversion("phone", eventId, {
      pagePath: currentPath(),
      language: document.documentElement.lang || "en",
      buttonPlacement: label || "link",
      destinationUrl: "tel:+966551504974",
    });
  }
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
    } else {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* tracking must never break the page */
  }
}

let initialized = false;

export function initEventTracking(): void {
  if (initialized) return;
  initialized = true;
  document.addEventListener(
    "click",
    (e) => {
      try {
        const target = e.target as Element | null;
        const a = target?.closest?.("a[href]");
        if (!a) return;
        const href = (a.getAttribute("href") || "").trim();
        if (!href) return;
        const lower = href.toLowerCase();
        if (lower.includes("whatsapp.com") || lower.includes("wa.me/")) {
          trackEvent("whatsapp_click");
          if (hasAdsConsent()) import("@/lib/snap").then((m) => m.snapTrack("CUSTOM_EVENT_1")).catch(() => {});
        } else if (lower.startsWith("tel:")) {
          trackEvent("phone_click");
        } else if (lower.startsWith("mailto:")) {
          trackEvent("email_click");
        } else if (/\.(pdf|docx?)($|\?)/.test(lower) || lower.includes("/downloads/")) {
          trackEvent("brochure_download", href.split("/").pop()?.split("?")[0] || "");
        } else {
          const quotePath = new URL(href, window.location.href).pathname.replace(import.meta.env.BASE_URL.replace(/\/$/, ""), "") || "/";
          if (quotePath === "/quote") trackEvent("request_quote_click");
        }
      } catch {
        /* never break the page */
      }
    },
    { capture: true, passive: true }
  );
}
