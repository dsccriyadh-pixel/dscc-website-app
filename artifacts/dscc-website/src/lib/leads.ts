import { getAttribution } from "@/lib/attribution";
import { getConsent, isTrackingTestMode, newEventId, pushDataLayer, sendAdsConversion } from "@/lib/tracking";
import { trackGa4Action } from "@/lib/ga4";

export interface LeadPayload {
  source: "quote" | "contact" | "chatbot" | "newsletter" | "showroom" | "calculator";
  data: Record<string, unknown>;
  ref?: string;
  at: string;
}

export function generateRef(prefix = "DSCC") {
  const t = Date.now().toString(36).toUpperCase().slice(-5);
  const r = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `${prefix}-${t}${r}`;
}

export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean; ref: string }> {
  const fingerprint = `${payload.source}:${JSON.stringify(payload.data)}`;
  const pendingKey = `dscc_pending_lead_${fingerprint.split("").reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0)}`;
  let pending: { ref: string; event_id: string; at: number } | null = null;
  try { pending = JSON.parse(sessionStorage.getItem(pendingKey) || "null"); } catch { /* storage unavailable */ }
  if (!pending || Date.now() - pending.at > 15 * 60_000) {
    pending = { ref: payload.ref || generateRef(), event_id: newEventId("lead"), at: Date.now() };
    try { sessionStorage.setItem(pendingKey, JSON.stringify(pending)); } catch { /* storage unavailable */ }
  }
  const { ref, event_id } = pending;
  const testMode = isTrackingTestMode();
  const enriched = { ...payload, ref, event_id, attribution: getAttribution(), consent: getConsent(), language: document.documentElement.lang || "en", test_mode: testMode };
  const endpoint =
    ((import.meta as any).env?.VITE_LEAD_ENDPOINT as string | undefined) ||
    "/api/leads";

  // Preview/test submissions exercise the UI and dataLayer only. They never
  // persist PII, call the lead API, send notifications, or reach ad platforms.
  if (testMode) {
    pushDataLayer("dscc_form_submission_success", { event_id, lead_source: payload.source, transaction_id: ref, test_mode: true });
    void sendAdsConversion("form", event_id);
    try { sessionStorage.removeItem(pendingKey); } catch { /* storage unavailable */ }
    return { ok: true, ref };
  }

  // Always cache locally so we have an offline trail.
  persistLocal(enriched);
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enriched),
      });
      if (res.ok) {
        const result = await res.json().catch(() => ({})) as { ok?: boolean; ref?: string; id?: string };
        if (result.ok === false) return { ok: false, ref };
        const acceptedRef = result.ref || ref;
        const transactionId = result.id || acceptedRef;
        // A lead/conversion represents an accepted server submission, never a
        // button click. The persisted payload and every client conversion share
        // this immutable ID for retry and platform deduplication.
        pushDataLayer("dscc_form_submission_success", { event_id, lead_source: payload.source, transaction_id: transactionId });
        trackGa4Action("generate_lead", "", event_id);
        void sendAdsConversion("form", event_id, {
          customer: payload.data,
          transactionId,
          pagePath: window.location.pathname,
          language: document.documentElement.lang || "en",
          formName: payload.source,
          projectType: typeof payload.data.projectType === "string" ? payload.data.projectType : undefined,
        });
        try { sessionStorage.removeItem(pendingKey); sessionStorage.setItem(`${pendingKey}_sent`, String(Date.now())); } catch { /* storage unavailable */ }
        return { ok: true, ref: acceptedRef };
      }
      return { ok: false, ref };
    } catch {
      return { ok: false, ref };
    }
  }
  return { ok: false, ref };
}

function persistLocal(p: LeadPayload & { ref: string }) {
  try {
    const list = JSON.parse(localStorage.getItem("dscc_leads") || "[]");
    list.push(p);
    localStorage.setItem("dscc_leads", JSON.stringify(list));
  } catch {}
}

export function buildWhatsAppLink(message: string, phone = "966551504974") {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoLink(subject: string, body: string, to = "contact@dsccsaudia.com") {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
