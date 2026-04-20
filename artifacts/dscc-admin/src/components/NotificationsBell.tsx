import { useEffect, useState, useRef } from "react";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { api, type Notification } from "@/lib/api";
import { relativeTime } from "@/lib/format";

export function NotificationsBell() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const r = await api.listNotifications({ limit: 20 });
      setItems(r.items);
      setUnread(r.unread);
    } catch {
      // silent — bell will simply show no badge
    }
  };

  useEffect(() => {
    load();
    const id = window.setInterval(load, 30000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const markOne = async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnread((u) => Math.max(0, u - 1));
    try {
      await api.markNotificationRead(id);
    } catch {}
  };

  const markAll = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
    try {
      await api.markAllNotificationsRead();
    } catch {}
  };

  const removeOne = async (id: string) => {
    const item = items.find((n) => n.id === id);
    setItems((prev) => prev.filter((n) => n.id !== id));
    if (item && !item.read) setUnread((u) => Math.max(0, u - 1));
    try {
      await api.deleteNotification(id);
    } catch {}
  };

  const isAr = lang === "ar";
  const align = isAr ? "end-0" : "start-0";

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        className="relative h-8 w-8 p-0"
        onClick={() => setOpen((v) => !v)}
        data-testid="button-notifications"
        aria-label={t("notifications_title")}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -end-0.5 grid place-items-center h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </Button>
      {open && (
        <div
          className={`absolute z-50 top-full mt-2 ${align} w-80 sm:w-96 rounded-lg border bg-popover text-popover-foreground shadow-lg overflow-hidden`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="font-semibold text-sm">{t("notifications_title")}</div>
            {unread > 0 && (
              <button
                onClick={markAll}
                className="text-xs text-primary hover:underline flex items-center gap-1"
                data-testid="button-mark-all-read"
              >
                <CheckCheck className="h-3 w-3" />
                {t("mark_all_read")}
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {t("no_notifications")}
              </div>
            ) : (
              <ul className="divide-y">
                {items.map((n) => {
                  const title = isAr ? n.titleAr : n.titleEn;
                  const body = isAr ? n.bodyAr : n.bodyEn;
                  const href = n.leadId ? `/leads/${n.leadId}` : "#";
                  return (
                    <li
                      key={n.id}
                      className={`relative group ${n.read ? "" : "bg-primary/5"}`}
                    >
                      <Link href={href}>
                        <a
                          onClick={() => {
                            if (!n.read) markOne(n.id);
                            setOpen(false);
                          }}
                          className="block px-4 py-3 hover:bg-accent/50 transition-colors"
                          data-testid={`notification-${n.id}`}
                        >
                          <div className="flex items-start gap-2">
                            {!n.read && (
                              <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{title}</div>
                              <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                {body}
                              </div>
                              <div className="text-[11px] text-muted-foreground mt-1" dir="ltr">
                                {relativeTime(n.createdAt, lang, t)}
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                      <div className="absolute top-2 end-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        {!n.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markOne(n.id);
                            }}
                            className="h-6 w-6 grid place-items-center rounded hover:bg-accent text-muted-foreground"
                            title={t("mark_read")}
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeOne(n.id);
                          }}
                          className="h-6 w-6 grid place-items-center rounded hover:bg-accent text-muted-foreground"
                          title={t("delete")}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
