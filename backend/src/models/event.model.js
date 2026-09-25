import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Event = sequelize.define(
    "Event",
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

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        location: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        eventDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "events",
    }
);

export default Event;