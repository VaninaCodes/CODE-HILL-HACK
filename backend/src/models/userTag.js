import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserTag = sequelize.define(
    "UserTag",
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

        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "user_tags",
    }
);

export default UserTag;