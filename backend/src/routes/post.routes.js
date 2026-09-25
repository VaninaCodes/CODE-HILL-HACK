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
import { uploadPostImage } from "../middleware/upload.js";

const router = Router();

router.get("/", getAllPost);
router.get("/:id", postIdValidator, validateResult, getPostById);

// uploadPostImage.single("image") procesa el archivo ANTES de validar el resto del body
router.post(
    "/",
    uploadPostImage.single("image"),
    createPostValidator,
    validateResult,
    createPost
);

router.put(
    "/:id",
    uploadPostImage.single("image"),
    updatePostValidator,
    validateResult,
    updatePost
);

router.delete("/:id", postIdValidator, validateResult, deletePost);

export default router;