import { promises as fs } from "node:fs";
import path from "node:path";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "quotation_sent"
  | "negotiation"
  | "won"
  | "lost"
  | "archived";

export type LeadSource = "quote" | "contact" | "chatbot" | "newsletter" | "other";

export interface LeadNote {
  id: string;
  body: string;
  author?: string;
  outcome?: string;
  followUpAt?: string;
  createdAt: string;
}

export interface LeadFile {
  name: string;
  size?: number;
  type?: string;
}

export interface Lead {
  id: string;
  ref: string;
  source: LeadSource;
  status: LeadStatus;
  priority: "low" | "normal" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  // contact
  fullName?: string;
  company?: string;
  email?: string;
  phone?: string;
  city?: string;
  // intent
  projectType?: string;
  services?: string[];
  projectSize?: string;
  budget?: string;
  timeline?: string;
  sourcePage?: string;
  sourceAction?: string;
  message?: string;
  chatbotSummary?: string;
  intent?: string;
  recommendedServices?: string[];
  files?: LeadFile[];
  notes: LeadNote[];
  tags?: string[];
  assignedTo?: string;
  raw?: Record<string, unknown>;
}

const DATA_DIR = process.env["DATA_DIR"] || path.resolve(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

let cache: Lead[] | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function loadLeads(): Promise<Lead[]> {
  if (cache) return cache;
  await ensureDir();
  try {
    const txt = await fs.readFile(LEADS_FILE, "utf8");
    cache = JSON.parse(txt) as Lead[];
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === "ENOENT") {
      // First run, start with empty store
      cache = [];
      return cache;
    }
    // Fail closed on corruption — never auto-reset and risk wiping data
    throw new Error(
      `Failed to read lead store at ${LEADS_FILE}: ${e.message}. ` +
        `The file exists but could not be parsed. Inspect it before continuing.`,
    );
  }
  return cache;
}

async function persist() {
  await ensureDir();
  // Atomic write: temp file + rename
  const tmp = `${LEADS_FILE}.${process.pid}.${Date.now()}.tmp`;
  const data = JSON.stringify(cache ?? [], null, 2);
  await fs.writeFile(tmp, data, "utf8");
  await fs.rename(tmp, LEADS_FILE);
}

function enqueueWrite(fn: () => void | Promise<void>): Promise<void> {
  // Always recover the chain on failure so a single bad write doesn't poison subsequent writes.
  const next = writeQueue.then(
    async () => {
      try {
        await fn();
        await persist();
      } catch (err) {
        // Reset cache so next read re-loads from disk and stays consistent.
        cache = null;
        throw err;
      }
    },
    async () => {
      try {
        await fn();
        await persist();
      } catch (err) {
        cache = null;
        throw err;
      }
    },
  );
  writeQueue = next.catch(() => {
    /* swallow so the chain continues */
  });
  return next;
}

function rid(prefix = ""): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 8);
  return `${prefix}${t}${r}`;
}

function inferSource(s: unknown): LeadSource {
  if (s === "quote" || s === "contact" || s === "chatbot" || s === "newsletter") return s;
  return "other";
}

interface IncomingPayload {
  source?: string;
  ref?: string;
  at?: string;
  data?: Record<string, unknown>;
}

function pickStr(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

function pickStrArr(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.map((x) => (typeof x === "string" ? x.trim() : "")).filter(Boolean);
  return out.length ? out : undefined;
}

export function normalizeIncoming(payload: IncomingPayload): Lead {
  const now = new Date().toISOString();
  const source = inferSource(payload.source);
  const data = (payload.data && typeof payload.data === "object" ? payload.data : {}) as Record<
    string,
    unknown
  >;

  // Files: accept array of {name,size,type} OR string filenames
  let files: LeadFile[] | undefined;
  const rawFiles = data["files"];
  if (Array.isArray(rawFiles)) {
    files = rawFiles
      .map((f): LeadFile | null => {
        if (typeof f === "string") return { name: f };
        if (f && typeof f === "object") {
          const o = f as Record<string, unknown>;
          const name = pickStr(o["name"]);
          if (!name) return null;
          return {
            name,
            size: typeof o["size"] === "number" ? o["size"] : undefined,
            type: pickStr(o["type"]),
          };
        }
        return null;
      })
      .filter((x): x is LeadFile => !!x);
  }

  return {
    id: rid("L_"),
    ref: pickStr(payload.ref) || rid("DSCC-"),
    source,
    status: "new",
    priority: "normal",
    createdAt: pickStr(payload.at) || now,
    updatedAt: now,
    fullName: pickStr(data["fullName"]) || pickStr(data["name"]),
    company: pickStr(data["company"]),
    email: pickStr(data["email"]),
    phone: pickStr(data["phone"]),
    city: pickStr(data["city"]),
    projectType: pickStr(data["projectType"]) || pickStr(data["type"]),
    services: pickStrArr(data["services"]) || pickStrArr(data["serviceIds"]),
    projectSize: pickStr(data["projectSize"]) || pickStr(data["size"]),
    budget: pickStr(data["budget"]),
    timeline: pickStr(data["timeline"]),
    sourcePage: pickStr(data["sourcePage"]) || pickStr(data["page"]),
    sourceAction: pickStr(data["sourceAction"]) || pickStr(data["action"]),
    message: pickStr(data["message"]) || pickStr(data["notes"]) || pickStr(data["details"]),
    chatbotSummary: pickStr(data["summary"]) || pickStr(data["chatbotSummary"]),
    intent: pickStr(data["intent"]),
    recommendedServices: pickStrArr(data["recommendedServices"]),
    files,
    tags: pickStrArr(data["tags"]),
    notes: [],
    raw: data,
  };
}

export async function createLead(payload: IncomingPayload): Promise<Lead> {
  const lead = normalizeIncoming(payload);
  await loadLeads();
  await enqueueWrite(() => {
    cache!.unshift(lead);
  });
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  return loadLeads().then((l) => l.slice());
}

export async function getLead(id: string): Promise<Lead | null> {
  const all = await loadLeads();
  return all.find((l) => l.id === id) || null;
}

export async function updateLead(
  id: string,
  patch: Partial<
    Pick<Lead, "status" | "priority" | "assignedTo" | "tags" | "fullName" | "company" | "email" | "phone" | "city" | "projectType" | "services" | "budget" | "timeline">
  >,
): Promise<Lead | null> {
  await loadLeads();
  let updated: Lead | null = null;
  await enqueueWrite(() => {
    const idx = cache!.findIndex((l) => l.id === id);
    if (idx === -1) return;
    cache![idx] = { ...cache![idx]!, ...patch, updatedAt: new Date().toISOString() } as Lead;
    updated = cache![idx]!;
  });
  return updated;
}

export async function addNote(
  id: string,
  body: string,
  opts: { author?: string; outcome?: string; followUpAt?: string } = {},
): Promise<Lead | null> {
  await loadLeads();
  let updated: Lead | null = null;
  await enqueueWrite(() => {
    const idx = cache!.findIndex((l) => l.id === id);
    if (idx === -1) return;
    const note: LeadNote = {
      id: rid("N_"),
      body,
      author: opts.author,
      outcome: opts.outcome,
      followUpAt: opts.followUpAt,
      createdAt: new Date().toISOString(),
    };
    cache![idx] = {
      ...cache![idx]!,
      notes: [note, ...(cache![idx]!.notes || [])],
      updatedAt: new Date().toISOString(),
    } as Lead;
    updated = cache![idx]!;
  });
  return updated;
}

export async function deleteLead(id: string): Promise<boolean> {
  await loadLeads();
  let ok = false;
  await enqueueWrite(() => {
    const before = cache!.length;
    cache = cache!.filter((l) => l.id !== id);
    ok = cache.length < before;
  });
  return ok;
}

export interface DashboardStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  topServices: Array<{ name: string; count: number }>;
  topCities: Array<{ name: string; count: number }>;
  newLast7Days: number;
  newLast30Days: number;
  recent: Lead[];
}

export async function getStats(): Promise<DashboardStats> {
  const all = await loadLeads();
  const byStatus: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  const svc: Record<string, number> = {};
  const cities: Record<string, number> = {};
  const now = Date.now();
  let last7 = 0;
  let last30 = 0;
  for (const l of all) {
    byStatus[l.status] = (byStatus[l.status] || 0) + 1;
    bySource[l.source] = (bySource[l.source] || 0) + 1;
    if (l.services) for (const s of l.services) svc[s] = (svc[s] || 0) + 1;
    if (l.city) cities[l.city] = (cities[l.city] || 0) + 1;
    const t = Date.parse(l.createdAt);
    if (!Number.isNaN(t)) {
      const days = (now - t) / 86400000;
      if (days <= 7) last7++;
      if (days <= 30) last30++;
    }
  }
  const top = (m: Record<string, number>) =>
    Object.entries(m)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  return {
    total: all.length,
    byStatus,
    bySource,
    topServices: top(svc),
    topCities: top(cities),
    newLast7Days: last7,
    newLast30Days: last30,
    recent: all.slice(0, 8),
  };
}
