import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import chatRouter from "./chat";
import notificationsRouter from "./notifications";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(chatRouter);
router.use(notificationsRouter);

export default router;
