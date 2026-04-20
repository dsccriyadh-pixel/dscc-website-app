import { logger } from "./logger";
import type { Lead } from "./leadStore";

const SLACK_WEBHOOK_URL = process.env["SLACK_WEBHOOK_URL"] || "";
const SLACK_HIGH_PRIORITY_ONLY = process.env["SLACK_HIGH_PRIORITY_ONLY"] === "1";

export async function notifySlackNewLead(lead: Lead, opts: { adminUrl?: string } = {}): Promise<void> {
  if (!SLACK_WEBHOOK_URL) return;
  if (SLACK_HIGH_PRIORITY_ONLY && lead.priority !== "high" && lead.priority !== "urgent") return;

  const sourceLabel: Record<string, string> = {
    quote: "Quote request",
    contact: "Contact form",
    chatbot: "Chatbot (Sara)",
    newsletter: "Newsletter",
    other: "Other",
  };
  const prioEmoji: Record<string, string> = {
    urgent: ":rotating_light:",
    high: ":fire:",
    normal: ":bell:",
    low: ":speech_balloon:",
  };

  const fields: Array<{ title: string; value: string; short: boolean }> = [];
  if (lead.fullName) fields.push({ title: "Name", value: lead.fullName, short: true });
  if (lead.company) fields.push({ title: "Company", value: lead.company, short: true });
  if (lead.email) fields.push({ title: "Email", value: lead.email, short: true });
  if (lead.phone) fields.push({ title: "Phone", value: lead.phone, short: true });
  if (lead.city) fields.push({ title: "City", value: lead.city, short: true });
  if (lead.projectType) fields.push({ title: "Project", value: lead.projectType, short: true });
  if (lead.services && lead.services.length)
    fields.push({ title: "Services", value: lead.services.slice(0, 5).join(", "), short: false });
  if (lead.message)
    fields.push({ title: "Message", value: lead.message.slice(0, 500), short: false });

  const adminUrl = opts.adminUrl || process.env["ADMIN_BASE_URL"] || "";
  const text =
    `${prioEmoji[lead.priority] || ":bell:"} *New ${sourceLabel[lead.source] || "lead"}* — ` +
    `${lead.fullName || lead.company || lead.email || lead.phone || "Unnamed"} ` +
    `(\`${lead.ref}\`)`;

  const payload = {
    text,
    attachments: [
      {
        color:
          lead.priority === "urgent"
            ? "#b22222"
            : lead.priority === "high"
              ? "#d97706"
              : "#8b1538",
        fields,
        footer: "DSCC CRM",
        ts: Math.floor(Date.parse(lead.createdAt) / 1000) || Math.floor(Date.now() / 1000),
        ...(adminUrl
          ? {
              actions: [
                {
                  type: "button",
                  text: "Open in dashboard",
                  url: `${adminUrl.replace(/\/$/, "")}/leads/${lead.id}`,
                  style: "primary",
                },
              ],
            }
          : {}),
      },
    ],
  };

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      logger.warn(
        { status: res.status, body: (await res.text()).slice(0, 200) },
        "slack webhook non-ok",
      );
    }
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "slack webhook failed");
  }
}
