import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  updateTags,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/profile/tags", authMiddleware, updateTags);

export default router;