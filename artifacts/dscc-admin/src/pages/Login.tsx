import { useState } from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { setToken } from "@/lib/auth";
import { api } from "@/lib/api";

export default function Login() {
  const [token, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError("Invalid token. Check your ADMIN_TOKEN environment variable.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid place-items-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary text-primary-foreground grid place-items-center mb-3">
            <Building2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">DSCC Admin</CardTitle>
          <CardDescription>
            Internal operations dashboard. Sign in with your admin token.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Admin token</Label>
              <Input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter your admin token"
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
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <p className="text-xs text-muted-foreground pt-2">
              Set <code className="bg-muted px-1 py-0.5 rounded">ADMIN_TOKEN</code> in your server environment
              to secure this dashboard. Default in development: <code className="bg-muted px-1 py-0.5 rounded">dscc-dev-token</code>.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
