export interface LeadPayload {
  source: "quote" | "contact" | "chatbot" | "newsletter";
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
  const ref = payload.ref || generateRef();
  const enriched = { ...payload, ref };
  const endpoint =
    ((import.meta as any).env?.VITE_LEAD_ENDPOINT as string | undefined) ||
    "/api/leads";

  // Always cache locally so we have an offline trail.
  persistLocal(enriched);
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enriched),
      });
      if (res.ok) return { ok: true, ref };
      return { ok: false, ref };
    } catch {
      return { ok: false, ref };
    }
  }
  return { ok: true, ref };
}

function persistLocal(p: LeadPayload & { ref: string }) {
  try {
    const list = JSON.parse(localStorage.getItem("dscc_leads") || "[]");
    list.push(p);
    localStorage.setItem("dscc_leads", JSON.stringify(list));
  } catch {}
}

export function buildWhatsAppLink(message: string, phone = "966553117884") {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoLink(subject: string, body: string, to = "hello@dscc-sa.com") {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
