import { Router } from "express";
import {
    getAllPost,
    getPostById,
    createPost,
    updatePost,
    deletePost,
} from "../controllers/post.controller.js";
import {
    createPostValidator,
    updatePostValidator,
    postIdValidator,
} from "../middleware/validations/post.validator.js";
import { validateResult } from "../middleware/validate.js";

const router = Router();

router.get("/", getAllPost);
router.get("/:id", postIdValidator, validateResult, getPostById);
router.post("/", createPostValidator, validateResult, createPost);
router.put("/:id", updatePostValidator, validateResult, updatePost);
router.delete("/:id", postIdValidator, validateResult, deletePost);

export default router;