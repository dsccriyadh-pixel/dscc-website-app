import { createAdsConversionDispatcher } from "@/lib/conversionDispatcher.js";

export const trackingConfig = {
  gtmContainerId: import.meta.env.VITE_GTM_CONTAINER_ID || "GTM-5V53WMCS",
  ga4MeasurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || "G-CT7Z4L5831",
  googleAdsId: import.meta.env.VITE_GOOGLE_ADS_ID,
  formConversionLabel: import.meta.env.VITE_GOOGLE_ADS_FORM_CONVERSION_LABEL,
  whatsappConversionLabel: import.meta.env.VITE_GOOGLE_ADS_WHATSAPP_CONVERSION_LABEL,
  phoneConversionLabel: import.meta.env.VITE_GOOGLE_ADS_PHONE_CONVERSION_LABEL,
  testMode: import.meta.env.VITE_TRACKING_TEST_MODE === "true",
} as const;

export function isTrackingTestMode(): boolean {
  return trackingConfig.testMode || !/^(www\.)?dsccsaudia\.com$/i.test(window.location.hostname);
}

export type ConsentState = "granted" | "denied";
export type ConsentChoices = { analytics_storage: ConsentState; ad_storage: ConsentState; ad_user_data: ConsentState; ad_personalization: ConsentState };

declare global {
  interface Window {
    __dsccConsent?: ConsentChoices;
    __dsccTrackingLoad?: (choices: ConsentChoices) => void;
    __dsccCurrentSearch?: string;
  }
}

const denied: ConsentChoices = { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
const storageKey = "dscc_google_consent_v2";

export function getConsent(): ConsentChoices {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const value = JSON.parse(raw) as Partial<ConsentChoices>;
      if (value.analytics_storage && value.ad_storage && value.ad_user_data && value.ad_personalization) return value as ConsentChoices;
    }
  } catch { /* Consent remains denied. */ }
  return window.__dsccConsent || denied;
}

export function updateConsent(choices: ConsentChoices): void {
  const previous = getConsent();
  const revoked =
    (previous.analytics_storage === "granted" && choices.analytics_storage === "denied") ||
    (previous.ad_storage === "granted" && choices.ad_storage === "denied") ||
    (previous.ad_user_data === "granted" && choices.ad_user_data === "denied") ||
    (previous.ad_personalization === "granted" && choices.ad_personalization === "denied");
  try { localStorage.setItem(storageKey, JSON.stringify(choices)); } catch { /* private mode */ }
  window.__dsccConsent = choices;
  window.gtag?.("consent", "update", choices);
  window.dataLayer?.push({ event: "consent_update", ...choices });
  window.__dsccTrackingLoad?.(choices);
  // Consent updates stop Google immediately. Reloading the production page
  // after a downgrade also removes already-loaded Snap/Metricool scripts.
  if (revoked && !isTrackingTestMode()) window.setTimeout(() => window.location.reload(), 0);
}

export function hasAnalyticsConsent(): boolean {
  return getConsent().analytics_storage === "granted";
}

export function hasAdsConsent(): boolean {
  const consent = getConsent();
  return consent.ad_storage === "granted" && consent.ad_user_data === "granted" && consent.ad_personalization === "granted";
}

export function newEventId(prefix = "evt"): string {
  try { return `${prefix}_${crypto.randomUUID()}`; } catch { return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`; }
}

export function pushDataLayer(event: string, detail: Record<string, unknown> = {}): string {
  const event_id = typeof detail.event_id === "string" ? detail.event_id : newEventId(event);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, event_id, ...detail });
  return event_id;
}

async function sha256(value: string): Promise<string | undefined> {
  try {
    if (!crypto.subtle) return undefined;
    const bytes = new TextEncoder().encode(value);
    return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  } catch { return undefined; }
}

async function normalizedCustomerData(data: Record<string, unknown>) {
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  let phoneDigits = typeof data.phone === "string" ? data.phone.replace(/\D/g, "") : "";
  if (phoneDigits.startsWith("00")) phoneDigits = phoneDigits.slice(2);
  if (/^05\d{8}$/.test(phoneDigits)) phoneDigits = `966${phoneDigits.slice(1)}`;
  else if (/^5\d{8}$/.test(phoneDigits)) phoneDigits = `966${phoneDigits}`;
  const phone = /^\d{8,15}$/.test(phoneDigits) ? `+${phoneDigits}` : "";
  const [emailHash, phoneHash] = await Promise.all([
    email ? sha256(email) : undefined,
    phone ? sha256(phone) : undefined,
  ]);
  return {
    ...(emailHash ? { email: emailHash } : {}),
    ...(phoneHash ? { phone_number: phoneHash } : {}),
  };
}

interface AdsConversionOptions {
  customer?: Record<string, unknown>;
  transactionId?: string;
  pagePath?: string;
  language?: string;
  formName?: string;
  projectType?: string;
  buttonPlacement?: string;
  destinationUrl?: string;
}

const dispatchAdsConversion = createAdsConversionDispatcher<AdsConversionOptions>(hasAdsConsent, async (kind, eventId, options) => {
  const label = kind === "form" ? trackingConfig.formConversionLabel : kind === "whatsapp" ? trackingConfig.whatsappConversionLabel : trackingConfig.phoneConversionLabel;
  if (isTrackingTestMode()) {
    pushDataLayer("google_ads_conversion_test", {
      event_id: eventId,
      conversion_kind: kind,
      send_to: `${trackingConfig.googleAdsId}/${label}`,
      test_mode: true,
    });
    return;
  }
  const userData = options.customer ? await normalizedCustomerData(options.customer) : {};
  // The Google tag normalizes/hashes enhanced-conversion customer fields. This
  // data is never put in dataLayer or sent to the internal analytics endpoint.
  if (Object.keys(userData).length) window.gtag?.("set", "user_data", userData);
  window.gtag?.("event", "conversion", {
    send_to: `${trackingConfig.googleAdsId}/${label}`,
    event_id: eventId,
    ...(kind === "form" ? { value: 1.0, currency: "SAR" } : {}),
    ...(options.transactionId ? { transaction_id: options.transactionId } : {}),
    ...(options.pagePath ? { page_path: options.pagePath } : {}),
    ...(options.language ? { website_language: options.language } : {}),
    ...(options.formName ? { form_name: options.formName } : {}),
    ...(options.projectType ? { project_type: options.projectType } : {}),
    ...(options.buttonPlacement ? { button_placement: options.buttonPlacement } : {}),
    ...(options.destinationUrl ? { destination_url: options.destinationUrl } : {}),
    event_timestamp: new Date().toISOString(),
  });
  if (Object.keys(userData).length) window.gtag?.("set", "user_data", {});
});

export async function sendAdsConversion(kind: "form" | "whatsapp" | "phone", eventId: string, options: AdsConversionOptions = {}): Promise<void> {
  await dispatchAdsConversion(kind, eventId, options);
}