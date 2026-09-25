import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Tag = sequelize.define(
    "Tag",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },

        category: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        tableName: "tags",
    }
);

export default Tag;