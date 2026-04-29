import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import chatRouter from "./chat";
import notificationsRouter from "./notifications";
import translateRouter from "./translate";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(chatRouter);
router.use(notificationsRouter);
router.use(translateRouter);

export default router;
