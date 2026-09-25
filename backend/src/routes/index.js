import { Router } from "express";
import postRoutes from "./post.routes.js";
import eventRoutes from "./event.routes.js";
import searchRoutes from "./search.routes.js";

const router = Router();

router.use("/posts", postRoutes);
router.use("/events", eventRoutes);
router.use("/search", searchRoutes);

export default router;