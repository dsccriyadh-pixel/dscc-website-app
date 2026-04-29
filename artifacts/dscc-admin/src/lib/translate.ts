import { useEffect, useState } from "react";

const API_BASE =
  ((import.meta as unknown as { env?: { VITE_API_BASE?: string } }).env?.VITE_API_BASE) ||
  "/api";

const CACHE_PREFIX = "dscc_tr_v1::";
const MEM_CACHE = new Map<string, string>();
const INFLIGHT = new Map<string, Promise<string>>();

function detectLang(text: string): "ar" | "en" | "other" {
  const arabic = /[\u0600-\u06FF]/.test(text);
  const latin = /[A-Za-z]/.test(text);
  if (arabic && !latin) return "ar";
  if (latin && !arabic) return "en";
  if (arabic) return "ar";
  if (latin) return "en";
  return "other";
}

function cacheGet(key: string): string | null {
  if (MEM_CACHE.has(key)) return MEM_CACHE.get(key) ?? null;
  try {
    const v = localStorage.getItem(CACHE_PREFIX + key);
    if (v != null) {
      MEM_CACHE.set(key, v);
      return v;
    }
  } catch {
    // ignore
  }
  return null;
}

function cacheSet(key: string, value: string): void {
  MEM_CACHE.set(key, value);
  try {
    localStorage.setItem(CACHE_PREFIX + key, value);
  } catch {
    // ignore quota errors
  }
}

export async function translateText(
  text: string,
  target: "en" | "ar",
): Promise<string> {
  const trimmed = (text || "").trim();
  if (!trimmed) return "";
  const detected = detectLang(trimmed);
  if (detected === target || detected === "other") return trimmed;

  const key = `${target}::${trimmed}`;
  const cached = cacheGet(key);
  if (cached != null) return cached;

  const inflight = INFLIGHT.get(key);
  if (inflight) return inflight;

  const promise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, target }),
      });
      if (!res.ok) return trimmed;
      const data = (await res.json()) as { ok?: boolean; translated?: string };
      const out = data?.translated && typeof data.translated === "string" ? data.translated : trimmed;
      cacheSet(key, out);
      return out;
    } catch {
      return trimmed;
    } finally {
      INFLIGHT.delete(key);
    }
  })();
  INFLIGHT.set(key, promise);
  return promise;
}

export function useTranslated(
  text: string | undefined | null,
  target: "en" | "ar",
): { value: string; loading: boolean } {
  const original = (text ?? "").trim();
  const detected = original ? detectLang(original) : "other";
  const needs = original && detected !== target && detected !== "other";

  const initial = needs ? cacheGet(`${target}::${original}`) ?? original : original;
  const [value, setValue] = useState<string>(initial);
  const [loading, setLoading] = useState<boolean>(needs && cacheGet(`${target}::${original}`) == null);

  useEffect(() => {
    let cancelled = false;
    if (!original) {
      setValue("");
      setLoading(false);
      return;
    }
    if (!needs) {
      setValue(original);
      setLoading(false);
      return;
    }
    const cached = cacheGet(`${target}::${original}`);
    if (cached != null) {
      setValue(cached);
      setLoading(false);
      return;
    }
    setLoading(true);
    setValue(original);
    translateText(original, target).then((out) => {
      if (!cancelled) {
        setValue(out);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [original, target, needs]);

  return { value, loading };
}
