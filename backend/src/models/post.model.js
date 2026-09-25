import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Post = sequelize.define(
    "Post",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "posts",
    }
);

export default Post;