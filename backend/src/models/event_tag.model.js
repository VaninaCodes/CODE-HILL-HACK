import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const EventTag = sequelize.define(
    "EventTag",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "event_tags",
    }
);

export default EventTag;