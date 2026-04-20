import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { clearToken } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Settings() {
  const { t } = useI18n();
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <PageHeader title={t("settings_title")} description={t("settings_desc")} />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("language_title")}</CardTitle>
            <CardDescription>{t("language_desc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2 flex-wrap">
            <LangToggle variant="outline" />
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("auth_title")}</CardTitle>
            <CardDescription>{t("auth_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => {
                clearToken();
                const base = import.meta.env.BASE_URL.replace(/\/$/, "");
                window.location.href = `${base}/login`;
              }}
              data-testid="button-sign-out"
            >
              {t("sign_out")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("storage_title")}</CardTitle>
            <CardDescription>{t("storage_desc")}</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("export_title")}</CardTitle>
            <CardDescription>{t("export_desc")}</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("deploy_title")}</CardTitle>
            <CardDescription>{t("deploy_desc")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
