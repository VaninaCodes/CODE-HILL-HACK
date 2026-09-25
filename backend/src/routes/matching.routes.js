import { Router } from "express";
import { getMatching } from "../controllers/matching.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getMatching);

export default router;