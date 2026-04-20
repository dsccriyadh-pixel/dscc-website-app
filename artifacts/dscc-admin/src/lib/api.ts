import { getToken } from "./auth";
import type { Lead, DashboardStats, LeadStatus } from "./types";

const API_BASE =
  ((import.meta as unknown as { env?: { VITE_API_BASE?: string } }).env?.VITE_API_BASE) ||
  "/api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (res.status === 401) {
    const err = new Error("Unauthorized");
    (err as Error & { code?: string }).code = "UNAUTHORIZED";
    throw err;
  }
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j && typeof j === "object" && "error" in j) msg = String((j as { error: unknown }).error);
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export interface LeadFilters {
  q?: string;
  status?: string;
  source?: string;
  city?: string;
  service?: string;
}

export const api = {
  checkAuth: () => request<{ ok: boolean }>("/admin/auth/check", { method: "POST" }),
  listLeads: (f: LeadFilters = {}) => {
    const qs = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => {
      if (v && v !== "all") qs.set(k, v);
    });
    const s = qs.toString();
    return request<{ leads: Lead[] }>(`/admin/leads${s ? `?${s}` : ""}`);
  },
  getLead: (id: string) => request<{ lead: Lead }>(`/admin/leads/${id}`),
  updateLead: (id: string, patch: Partial<Lead> & { status?: LeadStatus }) =>
    request<{ lead: Lead }>(`/admin/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  addNote: (
    id: string,
    body: string,
    opts: { author?: string; outcome?: string; followUpAt?: string } = {},
  ) =>
    request<{ lead: Lead }>(`/admin/leads/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ body, ...opts }),
    }),
  deleteLead: (id: string) =>
    request<{ ok: boolean }>(`/admin/leads/${id}`, { method: "DELETE" }),
  stats: () => request<DashboardStats>("/admin/stats"),
  csvUrl: () => {
    const token = getToken();
    return `${API_BASE}/admin/leads.csv${token ? `?token=${encodeURIComponent(token)}` : ""}`;
  },
};
