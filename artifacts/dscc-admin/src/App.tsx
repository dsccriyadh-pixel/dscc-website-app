import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import LeadsList from "@/pages/LeadsList";
import LeadDetail from "@/pages/LeadDetail";
import Settings from "@/pages/Settings";
import { AppLayout } from "@/components/AppLayout";
import { RequireAuth } from "@/components/RequireAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5_000, refetchOnWindowFocus: false },
  },
});

function ProtectedRoutes() {
  return (
    <RequireAuth>
      <AppLayout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/leads" component={() => <LeadsList />} />
          <Route path="/leads/:id" component={LeadDetail} />
          <Route
            path="/quotes"
            component={() => (
              <LeadsList
                fixedSource="quote"
                title="Quote Requests"
                description="Detailed quotation requests submitted via the quotation funnel."
              />
            )}
          />
          <Route
            path="/chatbot"
            component={() => (
              <LeadsList
                fixedSource="chatbot"
                title="Chatbot Leads"
                description="Leads captured by Sara, the AI sales engineer."
              />
            )}
          />
          <Route
            path="/contact"
            component={() => (
              <LeadsList
                fixedSource="contact"
                title="Contact Messages"
                description="General inquiries from the contact form."
              />
            )}
          />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </AppLayout>
    </RequireAuth>
  );
}

function App() {
  useEffect(() => {
    try {
      if (localStorage.getItem("dscc_admin_theme") === "dark") {
        document.documentElement.classList.add("dark");
      }
    } catch {}
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route component={ProtectedRoutes} />
          </Switch>
        </WouterRouter>
        <Toaster richColors closeButton position="top-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
