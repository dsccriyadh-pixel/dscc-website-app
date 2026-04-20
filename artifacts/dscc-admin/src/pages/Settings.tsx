import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { clearToken } from "@/lib/auth";

export default function Settings() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <PageHeader
        title="Settings"
        description="Configuration, integrations, and access for this admin dashboard."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Authentication</CardTitle>
            <CardDescription>
              The dashboard is protected by a single admin token, configurable via the
              <code className="mx-1 bg-muted px-1.5 py-0.5 rounded">ADMIN_TOKEN</code>
              environment variable on the API server.
            </CardDescription>
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
              Sign out
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data storage</CardTitle>
            <CardDescription>
              Leads are stored as a JSON file on the API server, in a directory configurable via
              <code className="mx-1 bg-muted px-1.5 py-0.5 rounded">DATA_DIR</code>
              (defaults to <code className="bg-muted px-1.5 py-0.5 rounded">./data</code>). For
              Hostinger or any Node-capable host, mount that directory to a persistent volume.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Export &amp; integrations</CardTitle>
            <CardDescription>
              Lead data is structured to be portable. Use the CSV export on the leads page, or
              consume the API at
              <code className="mx-1 bg-muted px-1.5 py-0.5 rounded">/api/admin/leads</code>
              with a bearer token. Webhook forwarding to Slack, Google Sheets, or a CRM can be
              added in <code className="bg-muted px-1.5 py-0.5 rounded">artifacts/api-server/src/routes/leads.ts</code>.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deployment</CardTitle>
            <CardDescription>
              The dashboard ships as a static React build (Vite) and consumes a small Express API.
              Both can be hosted on Hostinger Node hosting; the dashboard alone can also be hosted
              on any static CDN by setting <code className="bg-muted px-1.5 py-0.5 rounded">VITE_API_BASE</code>
              to point at the API origin.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
