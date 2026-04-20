import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { setToken } from "@/lib/auth";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";

export default function Login() {
  const [token, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();
  const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setToken(token.trim());
    try {
      await api.checkAuth();
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      window.location.href = `${base}/`;
    } catch {
      setError(t("invalid_token"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid place-items-center bg-gradient-to-br from-background via-background to-accent/40 px-4">
      <div className="absolute top-4 end-4">
        <LangToggle variant="outline" />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-xl bg-white border grid place-items-center mb-3 shadow-sm">
            <img src={logoSrc} alt="DSCC" className="h-12 w-auto" />
          </div>
          <CardTitle className="text-xl">{t("login_title")}</CardTitle>
          <CardDescription>{t("login_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">{t("admin_token")}</Label>
              <Input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder={t("admin_token_ph")}
                autoFocus
                data-testid="input-token"
              />
            </div>
            {error && (
              <div className="text-sm text-destructive" data-testid="text-login-error">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading || !token} data-testid="button-login">
              {loading ? t("signing_in") : t("sign_in")}
            </Button>
            <p className="text-xs text-muted-foreground pt-2 leading-relaxed">{t("login_hint")}</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
