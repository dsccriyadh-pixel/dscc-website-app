import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  FileText,
  Bot,
  Mail,
  LogOut,
  Settings,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearToken } from "@/lib/auth";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";
import { NotificationsBell } from "./NotificationsBell";
import { useI18n, type TKey } from "@/lib/i18n";

interface NavItem {
  path: string;
  labelKey: TKey;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV: NavItem[] = [
  { path: "/", labelKey: "nav_overview", icon: LayoutDashboard },
  { path: "/today", labelKey: "nav_today", icon: CalendarDays },
  { path: "/leads", labelKey: "nav_leads", icon: Users },
  { path: "/quotes", labelKey: "nav_quotes", icon: FileText },
  { path: "/chatbot", labelKey: "nav_chatbot", icon: Bot },
  { path: "/contact", labelKey: "nav_contact", icon: Mail },
  { path: "/settings", labelKey: "nav_settings", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const { t } = useI18n();
  const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;

  const onLogout = () => {
    clearToken();
    window.location.href = `${base}/login`;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-e border-sidebar-border">
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-md bg-white/95 grid place-items-center shadow-sm shrink-0">
              <img src={logoSrc} alt="DSCC" className="h-8 w-auto" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold tracking-wide truncate">{t("brand")}</div>
              <div className="text-[11px] text-sidebar-foreground/70 truncate">{t("tagline")}</div>
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
                      : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t(item.labelKey)}</span>
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
            className="w-full justify-start text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 me-2" />
            {t("sign_out")}
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-card">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-white grid place-items-center border">
              <img src={logoSrc} alt="DSCC" className="h-6 w-auto" />
            </div>
            <span className="font-semibold text-sm">{t("brand")}</span>
          </div>
          <div className="flex items-center gap-1">
            <NotificationsBell />
            <LangToggle />
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="hidden md:flex items-center justify-end gap-1 px-6 py-2 border-b bg-card/50">
          <NotificationsBell />
          <LangToggle />
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
            const label = t(item.labelKey);
            return (
              <Link key={item.path} href={item.path}>
                <a
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] ${
                    active ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate max-w-[60px]">{label.split(" ")[0]}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
