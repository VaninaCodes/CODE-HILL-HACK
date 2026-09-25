import { User, Tag, Post, Event } from "../models/index.js";

export const getMatching = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: {
                model: Tag,
                through: { attributes: [] },
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        const userTagIds = user.Tags.map((tag) => tag.id);

        if (userTagIds.length === 0) {
            return res.status(200).json({
                posts: [],
                events: [],
                message: "El usuario no tiene intereses seleccionados.",
            });
        }

        const posts = await Post.findAll({
            include: [
                {
                    model: Tag,
                    as: "tags",
                    through: { attributes: [] },
                    where: { id: userTagIds },
                },
                {
                    model: User,
                    as: "author",
                    attributes: ["id", "username", "avatar"],
                },
            ],
        });

        const events = await Event.findAll({
            include: [
                {
                    model: Tag,
                    as: "tags",
                    through: { attributes: [] },
                    where: { id: userTagIds },
                },
                {
                    model: User,
                    as: "organizer",
                    attributes: ["id", "username", "avatar"],
                },
            ],
        });

        const postsWithMatches = posts
            .map((post) => ({
                ...post.toJSON(),
                matchCount: post.tags.length,
            }))
            .sort((a, b) => b.matchCount - a.matchCount);

        const eventsWithMatches = events
            .map((event) => ({
                ...event.toJSON(),
                matchCount: event.tags.length,
            }))
            .sort((a, b) => b.matchCount - a.matchCount);

        return res.status(200).json({
            posts: postsWithMatches,
            events: eventsWithMatches,
        });
    } catch (error) {
        console.error("Error en matching:", error);

        return res.status(500).json({
            message: "Error al obtener recomendaciones.",
        });
    }
};