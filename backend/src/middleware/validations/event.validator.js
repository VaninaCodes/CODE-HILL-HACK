import { body, param } from "express-validator";

export const createEventValidator = [
    body("userId")
        .notEmpty().withMessage("El userId es obligatorio")
        .isInt().withMessage("El userId debe ser un numero"),
    body("title")
        .trim()
        .notEmpty().withMessage("El titulo es obligatorio")
        .isLength({ max: 150 }).withMessage("El titulo es demasiado largo"),
    body("description")
        .trim()
        .notEmpty().withMessage("La descripcion es obligatoria"),
    body("location")
        .trim()
        .notEmpty().withMessage("La ubicacion es obligatoria"),
    body("eventDate")
        .notEmpty().withMessage("La fecha del evento es obligatoria")
        .isISO8601().withMessage("La fecha debe tener formato valido (ISO8601)"),
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

export const updateEventValidator = [
    param("id").isInt().withMessage("Id invalido"),
    body("title").optional().trim().isLength({ max: 150 }),
    body("description").optional().trim().notEmpty(),
    body("location").optional().trim().notEmpty(),
    body("eventDate").optional().isISO8601(),
    body("image").optional().isString(),
    body("tagIds").optional().isArray(),
    body("tagIds.*").optional().isInt(),
];

export const eventIdValidator = [
    param("id").isInt().withMessage("Id invalido"),
];

export const attendValidator = [
    param("id").isInt().withMessage("Id invalido"),
    body("userId")
        .notEmpty().withMessage("El userId es obligatorio")
        .isInt().withMessage("El userId debe ser un numero"),
    body("standName")
        .optional()
        .trim()
        .isLength({ max: 100 }),
];