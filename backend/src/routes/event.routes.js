import { Router } from "express";
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    attendEvent,
    cancelAttendance,
    getEventAttendees,
} from "../controllers/event.controller.js";
import {
    createEventValidator,
    updateEventValidator,
    eventIdValidator,
    attendValidator,
} from "../middleware/validations/event.validator.js";
import { validateResult } from "../middleware/validate.js";

const router = Router();

router.get("/", getAllEvents);
router.get("/:id", eventIdValidator, validateResult, getEventById);
router.post("/", createEventValidator, validateResult, createEvent);
router.put("/:id", updateEventValidator, validateResult, updateEvent);
router.delete("/:id", eventIdValidator, validateResult, deleteEvent);

// Confirmacion de asistencia / stand
router.get("/:id/attendees", eventIdValidator, validateResult, getEventAttendees);
router.post("/:id/attend", attendValidator, validateResult, attendEvent);
router.delete("/:id/attend", eventIdValidator, validateResult, cancelAttendance);

export default router;