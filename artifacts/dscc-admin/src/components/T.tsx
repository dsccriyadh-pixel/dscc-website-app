import { useI18n } from "@/lib/i18n";
import { useTranslated } from "@/lib/translate";

interface TProps {
  text?: string | null;
  fallback?: string;
  className?: string;
  showOriginal?: boolean;
  inline?: boolean;
}

export function T({ text, fallback = "—", className, showOriginal = false, inline = true }: TProps) {
  const { lang } = useI18n();
  const target = lang === "en" ? "en" : "ar";
  const { value, loading } = useTranslated(text ?? "", target);
  const original = (text ?? "").trim();
  const display = original ? value || original : "";

  if (!original) {
    return inline ? <span className={className}>{fallback}</span> : <div className={className}>{fallback}</div>;
  }

  const Tag = (inline ? "span" : "div") as "span" | "div";
  return (
    <Tag className={className}>
      {display}
      {loading ? <span className="opacity-50 ms-1 text-[10px]">…</span> : null}
      {showOriginal && value && value !== original ? (
        <span className="block text-[10px] opacity-60 mt-0.5" dir="auto">
          ({original})
        </span>
      ) : null}
    </Tag>
  );
}
