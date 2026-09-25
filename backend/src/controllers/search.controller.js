import { Op } from "sequelize";
import { Post, Event, Tag, User } from "../models/index.js";

// GET /search?tag=Tecnología&type=posts|events|users|all&q=palabra
export const search = async (req, res) => {
    try {
        const { tag, type = "all", q } = req.query;

        const tagInclude = {
            model: Tag,
            as: "tags",
            attributes: ["id", "name", "category"],
            through: { attributes: [] },
            ...(tag && { where: { name: tag } }),
        };

        const results = {};

        if (type === "all" || type === "posts") {
            const postWhere = q
                ? {
                      [Op.or]: [
                          { title: { [Op.like]: `%${q}%` } },
                          { content: { [Op.like]: `%${q}%` } },
                      ],
                  }
                : {};

            results.posts = await Post.findAll({
                where: postWhere,
                include: [tagInclude],
            });
        }

        if (type === "all" || type === "events") {
            const eventWhere = q
                ? {
                      [Op.or]: [
                          { title: { [Op.like]: `%${q}%` } },
                          { description: { [Op.like]: `%${q}%` } },
                      ],
                  }
                : {};

            results.events = await Event.findAll({
                where: eventWhere,
                include: [tagInclude],
            });
        }

        // NUEVO: busqueda de personas / emprendimientos
        if (type === "all" || type === "users") {
            const userWhere = q
                ? {
                      [Op.or]: [
                          { username: { [Op.like]: `%${q}%` } },
                          { description: { [Op.like]: `%${q}%` } },
                      ],
                  }
                : {};

            results.users = await User.findAll({
                where: userWhere,
                attributes: ["id", "username", "type", "description", "avatar"],
                include: [tagInclude],
            });
        }

        return res.status(200).json(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al realizar la busqueda" });
    }
};