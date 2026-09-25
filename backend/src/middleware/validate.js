import { validationResult } from "express-validator";

// Se usa despues de los validators de cada ruta.
// Si hay errores de validacion, corta la request con 400.
export const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};