import { Tag } from "../models/index.js";

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      order: [
        ["category", "ASC"],
        ["name", "ASC"],
      ],
    });

    return res.status(200).json(tags);
  } catch (error) {
    console.error("Error al obtener las etiquetas:", error);

    return res.status(500).json({
      message: "Error al obtener las etiquetas.",
    });
  }
};