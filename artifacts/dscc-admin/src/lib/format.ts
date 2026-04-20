export function formatDate(iso?: string, locale?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(locale || undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(iso?: string, lang: "en" | "ar" = "en"): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diff = (Date.now() - d.getTime()) / 1000;
  const ar = lang === "ar";
  if (diff < 60) return ar ? "الآن" : "just now";
  if (diff < 3600) return ar ? `قبل ${Math.floor(diff / 60)} د` : `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return ar ? `قبل ${Math.floor(diff / 3600)} س` : `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return ar ? `قبل ${Math.floor(diff / 86400)} ي` : `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString(lang === "ar" ? "ar-SA" : undefined);
}
