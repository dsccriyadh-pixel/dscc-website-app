import type { TKey } from "./i18n";

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
  fullName?: string;
  company?: string;
  email?: string;
  phone?: string;
  city?: string;
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

export const STATUS_ORDER: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "quotation_sent",
  "negotiation",
  "won",
  "lost",
  "archived",
];

export const SOURCE_KEYS: LeadSource[] = ["quote", "contact", "chatbot", "newsletter", "other"];

export function statusKey(s: LeadStatus): TKey {
  const map: Record<LeadStatus, TKey> = {
    new: "st_new",
    contacted: "st_contacted",
    qualified: "st_qualified",
    quotation_sent: "st_quotation_sent",
    negotiation: "st_negotiation",
    won: "st_won",
    lost: "st_lost",
    archived: "st_archived",
  };
  return map[s];
}

export function sourceKey(s: LeadSource): TKey {
  const map: Record<LeadSource, TKey> = {
    quote: "src_quote",
    contact: "src_contact",
    chatbot: "src_chatbot",
    newsletter: "src_newsletter",
    other: "src_other",
  };
  return map[s];
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
  contacted: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-800",
  qualified: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950 dark:text-violet-200 dark:border-violet-800",
  quotation_sent: "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800",
  negotiation: "bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800",
  won: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
  lost: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800",
  archived: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700",
};
