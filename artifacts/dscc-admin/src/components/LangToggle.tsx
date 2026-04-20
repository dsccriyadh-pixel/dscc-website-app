import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface Props {
  variant?: "ghost" | "outline";
  size?: "sm" | "icon";
}

export function LangToggle({ variant = "ghost", size = "sm" }: Props) {
  const { lang, setLang, t } = useI18n();
  const next = lang === "ar" ? "en" : "ar";
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setLang(next)}
      className="gap-1.5"
      data-testid="button-lang-toggle"
      aria-label="Toggle language"
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-medium">{t("language")}</span>
    </Button>
  );
}
