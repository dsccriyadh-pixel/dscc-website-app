import { Router, type IRouter } from "express";
import {
  deleteNotification,
  listNotifications,
  markAllRead,
  markRead,
} from "../lib/notificationStore";
import { requireAdmin } from "../middlewares/adminAuth";

const router: IRouter = Router();

router.get("/admin/notifications", requireAdmin, async (req, res) => {
  const limit = req.query["limit"] ? Math.min(200, Number(req.query["limit"]) || 50) : 50;
  const unreadOnly = req.query["unread"] === "1" || req.query["unread"] === "true";
  const data = await listNotifications({ limit, unreadOnly });
  res.json(data);
});

router.post("/admin/notifications/:id/read", requireAdmin, async (req, res) => {
  const ok = await markRead(String(req.params["id"]));
  if (!ok) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ok: true });
});

router.post("/admin/notifications/read-all", requireAdmin, async (_req, res) => {
  const count = await markAllRead();
  res.json({ ok: true, count });
});

router.delete("/admin/notifications/:id", requireAdmin, async (req, res) => {
  const ok = await deleteNotification(String(req.params["id"]));
  if (!ok) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ok: true });
});

export default router;
