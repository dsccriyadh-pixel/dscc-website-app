import { promises as fs } from "node:fs";
import path from "node:path";

export type NotificationType = "lead_new" | "lead_status" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  leadId?: string;
  leadRef?: string;
  meta?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

const DATA_DIR = process.env["DATA_DIR"] || path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "notifications.json");
const MAX_KEEP = 500;

let cache: Notification[] | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function load(): Promise<Notification[]> {
  if (cache) return cache;
  await ensureDir();
  try {
    const txt = await fs.readFile(FILE, "utf8");
    cache = JSON.parse(txt) as Notification[];
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === "ENOENT") {
      cache = [];
      return cache;
    }
    throw new Error(`Failed to read notifications at ${FILE}: ${e.message}`);
  }
  return cache;
}

async function persist() {
  await ensureDir();
  const tmp = `${FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(cache ?? [], null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

function enqueue(fn: () => void | Promise<void>): Promise<void> {
  const next = writeQueue.then(
    async () => {
      try {
        await fn();
        await persist();
      } catch (err) {
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
  writeQueue = next.catch(() => {});
  return next;
}

function rid(): string {
  return `N_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export async function createNotification(
  n: Omit<Notification, "id" | "createdAt" | "read"> & { read?: boolean; createdAt?: string },
): Promise<Notification> {
  await load();
  const item: Notification = {
    id: rid(),
    createdAt: n.createdAt || new Date().toISOString(),
    read: n.read ?? false,
    type: n.type,
    titleAr: n.titleAr,
    titleEn: n.titleEn,
    bodyAr: n.bodyAr,
    bodyEn: n.bodyEn,
    leadId: n.leadId,
    leadRef: n.leadRef,
    meta: n.meta,
  };
  await enqueue(() => {
    cache!.unshift(item);
    if (cache!.length > MAX_KEEP) cache = cache!.slice(0, MAX_KEEP);
  });
  return item;
}

export async function listNotifications(opts: { limit?: number; unreadOnly?: boolean } = {}): Promise<{
  items: Notification[];
  unread: number;
  total: number;
}> {
  const all = await load();
  const unread = all.filter((n) => !n.read).length;
  let items = all;
  if (opts.unreadOnly) items = items.filter((n) => !n.read);
  if (opts.limit) items = items.slice(0, opts.limit);
  return { items: items.slice(), unread, total: all.length };
}

export async function markRead(id: string): Promise<boolean> {
  await load();
  let ok = false;
  await enqueue(() => {
    const idx = cache!.findIndex((n) => n.id === id);
    if (idx === -1) return;
    cache![idx] = { ...cache![idx]!, read: true };
    ok = true;
  });
  return ok;
}

export async function markAllRead(): Promise<number> {
  await load();
  let count = 0;
  await enqueue(() => {
    for (let i = 0; i < cache!.length; i++) {
      if (!cache![i]!.read) {
        cache![i] = { ...cache![i]!, read: true };
        count++;
      }
    }
  });
  return count;
}

export async function deleteNotification(id: string): Promise<boolean> {
  await load();
  let ok = false;
  await enqueue(() => {
    const before = cache!.length;
    cache = cache!.filter((n) => n.id !== id);
    ok = cache.length < before;
  });
  return ok;
}
