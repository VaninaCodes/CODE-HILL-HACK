import { body, param } from "express-validator";

// TODO: cuando este el middleware de auth, sacar la validacion de "userId"
// del body y tomarlo directamente de req.user.id
export const createPostValidator = [
    body("userId")
        .notEmpty().withMessage("El userId es obligatorio")
        .isInt().withMessage("El userId debe ser un numero"),
    body("title")
        .trim()
        .notEmpty().withMessage("El titulo es obligatorio")
        .isLength({ max: 150 }).withMessage("El titulo es demasiado largo"),
    body("content")
        .trim()
        .notEmpty().withMessage("El contenido es obligatorio"),
    body("image")
        .optional()
        .isString(),
    body("tagIds")
        .optional()
        .isArray().withMessage("tagIds debe ser un arreglo de ids"),
    body("tagIds.*")
        .optional()
        .isInt().withMessage("Cada tagId debe ser un numero"),
];

export const updatePostValidator = [
    param("id").isInt().withMessage("Id invalido"),
    body("title")
        .optional()
        .trim()
        .isLength({ max: 150 }).withMessage("El titulo es demasiado largo"),
    body("content")
        .optional()
        .trim()
        .notEmpty().withMessage("El contenido no puede quedar vacio"),
    body("image")
        .optional()
        .isString(),
    body("tagIds")
        .optional()
        .isArray().withMessage("tagIds debe ser un arreglo de ids"),
    body("tagIds.*")
        .optional()
        .isInt().withMessage("Cada tagId debe ser un numero"),
];

export const postIdValidator = [
    param("id").isInt().withMessage("Id invalido"),
];