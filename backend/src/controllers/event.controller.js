import { User, Tag, Event, EventAttendance } from "../models/index.js";
import { matchedData } from "express-validator";

const eventIncludes = [
    { model: User, as: "organizer", attributes: ["id", "username", "type"] },
    { model: Tag, as: "tags", attributes: ["id", "name", "category"], through: { attributes: [] } },
];

// Obtener todos los eventos
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            include: eventIncludes,
            order: [["eventDate", "ASC"]],
        });
        return res.status(200).json(events);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener los eventos" });
    }
};

// Buscar evento por id
export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id, { include: eventIncludes });
        if (!event) return res.status(404).json({ message: "Evento no encontrado" });
        res.status(200).json(event);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener el evento" });
    }
};

// Crear un evento
export const createEvent = async (req, res) => {
    try {
        const validateData = matchedData(req);
        const { tagIds, ...eventData } = validateData;

        const event = await Event.create(eventData);

        if (tagIds && tagIds.length) {
            await event.setTags(tagIds);
        }

        const eventWithTags = await Event.findByPk(event.id, { include: eventIncludes });
        return res.status(201).json(eventWithTags);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al crear el evento" });
    }
};

// Editar un evento
export const updateEvent = async (req, res) => {
    try {
        const validateDataBody = matchedData(req, { locations: ["body"] });
        const { id } = matchedData(req, { locations: ["params"] });
        const { tagIds, ...updateData } = validateDataBody;

        const eventExist = await Event.findByPk(id);
        if (!eventExist) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        await eventExist.update(updateData);

        if (tagIds) {
            await eventExist.setTags(tagIds);
        }

        return res.status(200).json({ message: "Evento editado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al editar el evento" });
    }
};

// Eliminar un evento
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const eventExist = await Event.findByPk(id);
        if (!eventExist) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }
        await eventExist.destroy();
        return res.status(200).json({ message: "Evento eliminado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al eliminar el evento" });
    }
};

// Confirmar asistencia / stand a un evento
// POST /events/:id/attend  body: { userId, standName? }
export const attendEvent = async (req, res) => {
    try {
        const { id: eventId } = matchedData(req, { locations: ["params"] });
        const { userId, standName } = matchedData(req, { locations: ["body"] });

        const event = await Event.findByPk(eventId);
        if (!event) return res.status(404).json({ message: "Evento no encontrado" });

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const attendance = await EventAttendance.create({ eventId, userId, standName });

        return res.status(201).json({
            message: "Confirmacion registrada correctamente",
            attendance,
        });
    } catch (error) {
        // Violacion del indice unico (eventId + userId) -> ya estaba confirmado
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ message: "Ya confirmaste tu asistencia a este evento" });
        }
        console.log(error);
        res.status(500).json({ message: "Error al confirmar la asistencia" });
    }
};

// Cancelar una confirmacion de asistencia
// DELETE /events/:id/attend  body: { userId }
export const cancelAttendance = async (req, res) => {
    try {
        const { id: eventId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "El userId es obligatorio" });
        }

        const attendance = await EventAttendance.findOne({ where: { eventId, userId } });
        if (!attendance) {
            return res.status(404).json({ message: "No existe una confirmacion para cancelar" });
        }

        await attendance.destroy();
        return res.status(200).json({ message: "Confirmacion cancelada correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al cancelar la confirmacion" });
    }
};

// Listar los asistentes/stands confirmados de un evento
export const getEventAttendees = async (req, res) => {
    try {
        const { id: eventId } = req.params;

        const event = await Event.findByPk(eventId);
        if (!event) return res.status(404).json({ message: "Evento no encontrado" });

        const attendees = await EventAttendance.findAll({
            where: { eventId },
            include: [{ model: User, attributes: ["id", "username", "type"] }],
        });

        return res.status(200).json(attendees);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener los asistentes" });
    }
};