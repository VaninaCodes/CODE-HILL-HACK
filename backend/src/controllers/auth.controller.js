import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Tag, UserTag } from "../models/index.js";

export const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            type,
            description,
            avatar,
            tags,
        } = req.body;

        const existingUser = await User.findOne({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "El email ya está registrado.",
            });
        }

        const existingUsername = await User.findOne({
            where: { username },
        });

        if (existingUsername) {
            return res.status(400).json({
                message: "El nombre de usuario ya está registrado.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            type,
            description,
            avatar,
        });

        if (tags && tags.length > 0) {
            const selectedTags = await Tag.findAll({
                where: {
                    id: tags,
                },
            });

            const userTags = selectedTags.map((tag) => ({
                userId: user.id,
                tagId: tag.id,
            }));

            await UserTag.bulkCreate(userTags);
        }

        return res.status(201).json({
            message: "Usuario registrado correctamente.",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                type: user.type,
                description: user.description,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error("Error en register:", error);

        return res.status(500).json({
            message: "Error al registrar el usuario.",
        });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                message: "Email o contraseña incorrectos.",
            });
        }

        const passwordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordValid) {
            return res.status(401).json({
                message: "Email o contraseña incorrectos.",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                type: user.type,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );

        return res.status(200).json({
            message: "Inicio de sesión correcto.",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                type: user.type,
            },
        });
    } catch (error) {
        console.error("Error en login:", error);

        return res.status(500).json({
            message: "Error al iniciar sesión.",
        });
    }
};