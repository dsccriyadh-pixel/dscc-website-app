import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  FileText,
  Bot,
  Mail,
  LogOut,
  Settings,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearToken } from "@/lib/auth";
import { ThemeToggle } from "./ThemeToggle";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV: NavItem[] = [
  { path: "/", label: "Overview", icon: LayoutDashboard },
  { path: "/leads", label: "All Leads", icon: Users },
  { path: "/quotes", label: "Quote Requests", icon: FileText },
  { path: "/chatbot", label: "Chatbot Leads", icon: Bot },
  { path: "/contact", label: "Contact Messages", icon: Mail },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const onLogout = () => {
    clearToken();
    window.location.href = `${base}/login`;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide">DSCC Admin</div>
              <div className="text-[11px] text-sidebar-foreground/60">Saudi Arabia · Operations</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active =
              item.path === "/"
                ? location === "/" || location === ""
                : location.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <a
                  data-testid={`nav-${item.path.replace(/\//g, "") || "overview"}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-card">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm">DSCC Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="hidden md:flex items-center justify-end px-6 py-2 border-b bg-card/50">
          <ThemeToggle />
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
        <nav className="md:hidden flex border-t bg-card">
          {NAV.slice(0, 5).map((item) => {
            const active =
              item.path === "/"
                ? location === "/" || location === ""
                : location.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <a
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] ${
                    active ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label.split(" ")[0]}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
