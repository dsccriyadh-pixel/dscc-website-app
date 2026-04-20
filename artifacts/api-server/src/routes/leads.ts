import { Router, type IRouter } from "express";
import {
  addNote,
  createLead,
  deleteLead,
  getLead,
  getStats,
  listLeads,
  updateLead,
  type LeadStatus,
} from "../lib/leadStore";
import { requireAdmin } from "../middlewares/adminAuth";

const router: IRouter = Router();

// Public: website submits leads here
const ALLOWED_SOURCES = new Set(["quote", "contact", "chatbot", "newsletter", "other"]);
const MAX_STR = 4000;

function sanitize(input: unknown, depth = 0): unknown {
  if (depth > 4) return undefined;
  if (input === null || input === undefined) return input;
  if (typeof input === "string") return input.slice(0, MAX_STR);
  if (typeof input === "number" || typeof input === "boolean") return input;
  if (Array.isArray(input)) return input.slice(0, 50).map((v) => sanitize(v, depth + 1));
  if (typeof input === "object") {
    const out: Record<string, unknown> = {};
    let i = 0;
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      if (i++ >= 80) break;
      out[k.slice(0, 80)] = sanitize(v, depth + 1);
    }
    return out;
  }
  return undefined;
}

router.post("/leads", async (req, res) => {
  try {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const sourceRaw = typeof body["source"] === "string" ? (body["source"] as string) : "other";
    const source = ALLOWED_SOURCES.has(sourceRaw) ? sourceRaw : "other";
    const data = sanitize(body["data"] ?? body) as Record<string, unknown>;
    if (!data || typeof data !== "object") {
      res.status(400).json({ ok: false, error: "Invalid payload" });
      return;
    }
    const ref = typeof body["ref"] === "string" ? (body["ref"] as string).slice(0, 64) : undefined;
    const lead = await createLead({ source, ref, data });
    res.json({ ok: true, ref: lead.ref, id: lead.id });
  } catch (err) {
    res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

// Admin: list/filter leads
router.get("/admin/leads", requireAdmin, async (req, res) => {
  const all = await listLeads();
  const qp = (k: string): string | undefined => {
    const v = req.query[k];
    return typeof v === "string" ? v : undefined;
  };
  const q = qp("q")?.toLowerCase().trim();
  const status = qp("status");
  const source = qp("source");
  const city = qp("city");
  const service = qp("service");
  const filtered = all.filter((l) => {
    if (status && status !== "all" && l.status !== status) return false;
    if (source && source !== "all" && l.source !== source) return false;
    if (city && city !== "all" && l.city !== city) return false;
    if (service && service !== "all" && !(l.services || []).includes(service)) return false;
    if (q) {
      const blob = [
        l.fullName,
        l.company,
        l.email,
        l.phone,
        l.city,
        l.projectType,
        l.message,
        l.chatbotSummary,
        l.ref,
        ...(l.services || []),
        ...(l.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
  res.json({ leads: filtered });
});

router.get("/admin/leads/:id", requireAdmin, async (req, res) => {
  const lead = await getLead(String(req.params["id"]));
  if (!lead) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ lead });
});

router.patch("/admin/leads/:id", requireAdmin, async (req, res) => {
  const body = req.body || {};
  const allowed = [
    "status",
    "priority",
    "assignedTo",
    "tags",
    "fullName",
    "company",
    "email",
    "phone",
    "city",
    "projectType",
    "services",
    "budget",
    "timeline",
  ] as const;
  const patch: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) patch[k] = body[k];
  if (
    "status" in patch &&
    !["new", "contacted", "qualified", "quotation_sent", "negotiation", "won", "lost", "archived"].includes(
      patch["status"] as LeadStatus,
    )
  ) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  const updated = await updateLead(String(req.params["id"]), patch);
  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ lead: updated });
});

router.post("/admin/leads/:id/notes", requireAdmin, async (req, res) => {
  const { body, author, outcome, followUpAt } = req.body || {};
  if (!body || typeof body !== "string") {
    res.status(400).json({ error: "Note body required" });
    return;
  }
  const lead = await addNote(String(req.params["id"]), body, { author, outcome, followUpAt });
  if (!lead) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ lead });
});

router.delete("/admin/leads/:id", requireAdmin, async (req, res) => {
  const ok = await deleteLead(String(req.params["id"]));
  if (!ok) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ok: true });
});

router.get("/admin/stats", requireAdmin, async (_req, res) => {
  const s = await getStats();
  res.json(s);
});

router.post("/admin/auth/check", requireAdmin, (_req, res) => {
  res.json({ ok: true });
});

// CSV export
router.get("/admin/leads.csv", requireAdmin, async (_req, res) => {
  const all = await listLeads();
  const cols = [
    "id",
    "ref",
    "createdAt",
    "source",
    "status",
    "priority",
    "fullName",
    "company",
    "email",
    "phone",
    "city",
    "projectType",
    "services",
    "budget",
    "timeline",
    "sourcePage",
    "message",
  ];
  const escape = (v: unknown): string => {
    if (v === null || v === undefined) return "";
    let s = Array.isArray(v) ? v.join("; ") : String(v);
    // CSV-injection defense: prefix cells starting with =, +, -, @, tab or CR with a single quote
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [cols.join(",")];
  for (const l of all) {
    lines.push(cols.map((c) => escape((l as unknown as Record<string, unknown>)[c])).join(","));
  }
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="dscc-leads-${Date.now()}.csv"`);
  res.send(lines.join("\n"));
});

export default router;
