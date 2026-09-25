import { Router } from "express";
import postRoutes from "./post.routes.js";
import eventRoutes from "./event.routes.js";
import searchRoutes from "./search.routes.js";
import matchingRoutes from "./matching.routes.js";

const router = Router();

router.use("/posts", postRoutes);
router.use("/events", eventRoutes);
router.use("/search", searchRoutes);
router.use("/matching", matchingRoutes);

export default router;