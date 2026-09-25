import { User, Tag, Post } from "../models/index.js";
import { matchedData } from "express-validator";
import fs from "fs";
import path from "path";

const postIncludes = [
    { model: User, as: "author", attributes: ["id", "username", "type"] },
    { model: Tag, as: "tags", attributes: ["id", "name", "category"], through: { attributes: [] } },
];

// Obtener todas las publicaciones
export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: postIncludes,
            order: [["createdAt", "DESC"]],
        });
        return res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener las publicaciones" });
    }
};

// Buscar publicacion por id
export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id, { include: postIncludes });
        if (!post) return res.status(404).json({ message: "Publicacion no encontrada" });
        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener la publicacion" });
    }
};

// Crear una publicacion
export const createPost = async (req, res) => {
    try {
        const validateData = matchedData(req);
        const { tagIds, ...postData } = validateData;

        // Si vino un archivo, guardamos la ruta publica en el campo image
        if (req.file) {
            postData.image = `/uploads/posts/${req.file.filename}`;
        }

        const post = await Post.create(postData);

        if (tagIds && tagIds.length) {
            await post.setTags(tagIds);
        }

        const postWithTags = await Post.findByPk(post.id, { include: postIncludes });

        return res.status(201).json(postWithTags);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al crear la publicacion" });
    }
};

// Editar una publicacion
export const updatePost = async (req, res) => {
    try {
        const validateDataBody = matchedData(req, { locations: ["body"] });
        const { id } = matchedData(req, { locations: ["params"] });
        const { tagIds, ...updateData } = validateDataBody;

        const postExist = await Post.findByPk(id);
        if (!postExist) {
            return res.status(404).json({ message: "Publicacion no encontrada" });
        }

        // Si vino una imagen nueva, borramos la anterior (si existia) y guardamos la nueva ruta
        if (req.file) {
            if (postExist.image) {
                const oldPath = path.resolve(`.${postExist.image}`);
                fs.unlink(oldPath, (err) => {
                    if (err) console.log("No se pudo borrar la imagen anterior:", err.message);
                });
            }
            updateData.image = `/uploads/posts/${req.file.filename}`;
        }

        await postExist.update(updateData);

        if (tagIds) {
            await postExist.setTags(tagIds);
        }

        return res.status(200).json({ message: "Publicacion editada correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al editar la publicacion" });
    }
};

// Eliminar una publicacion
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const postExist = await Post.findByPk(id);
        if (!postExist) {
            return res.status(404).json({ message: "Publicacion no encontrada" });
        }

        if (postExist.image) {
            const imgPath = path.resolve(`.${postExist.image}`);
            fs.unlink(imgPath, (err) => {
                if (err) console.log("No se pudo borrar la imagen:", err.message);
            });
        }

        await postExist.destroy();
        return res.status(200).json({ message: "Publicacion eliminada correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al eliminar la publicacion" });
    }
};