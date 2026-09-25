import { Router } from "express";
import { getRecommendations } from "../controllers/matching.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getRecommendations);

export default router;