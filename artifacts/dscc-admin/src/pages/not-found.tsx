import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 grid place-items-center mb-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-xl font-semibold mb-1">{t("nf_title")}</h1>
          <p className="text-sm text-muted-foreground mb-4">{t("nf_desc")}</p>
          <Button asChild>
            <a href={`${base}/`}>{t("nf_back")}</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
