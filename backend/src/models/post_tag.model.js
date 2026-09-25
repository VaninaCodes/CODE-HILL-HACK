import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PostTag = sequelize.define(
    "PostTag",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "post_tags",
    }
);

export default PostTag;