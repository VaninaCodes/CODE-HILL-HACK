import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// Registra la confirmacion de un usuario (o su stand) a un evento
const EventAttendance = sequelize.define(
    "EventAttendance",
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

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        // Nombre del stand/emprendimiento, para que sea visible en el evento
        standName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
    },
    {
        tableName: "event_attendances",
        indexes: [
            {
                unique: true,
                fields: ["eventId", "userId"],
            },
        ],
    }
);

export default EventAttendance;