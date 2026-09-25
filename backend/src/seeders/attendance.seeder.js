import { Event, User, EventAttendance } from "../models/index.js";

// Pares [tituloEvento, username, standName?] a confirmar
const attendanceData = [
    ["Feria de Emprendedores Formosa 2026", "panaderialaformosena", "Panadería La Formoseña"],
    ["Feria de Emprendedores Formosa 2026", "artesaniaspilaga", "Artesanías Pilagá"],
    ["Feria de Emprendedores Formosa 2026", "textilesdelnorte", "Textiles del Norte"],
    ["Feria de Emprendedores Formosa 2026", "juanbenitez", null],
    ["Expo Gastronómica del Litoral", "cateringdonarosa", "Catering Doña Rosa"],
    ["Expo Gastronómica del Litoral", "mariaacosta", null],
    ["Capacitación en Marketing Digital", "consultorapyme", null],
    ["Capacitación en Marketing Digital", "tecnoformosa", null],
    ["Rueda de Negocios PyME Formosa", "contableformosa", "Estudio Contable Ríos"],
];

export const seedAttendances = async () => {
    let created = 0;

    for (const [eventTitle, username, standName] of attendanceData) {
        const event = await Event.findOne({ where: { title: eventTitle } });
        const user = await User.findOne({ where: { username } });
        if (!event || !user) continue;

        const [, wasCreated] = await EventAttendance.findOrCreate({
            where: { eventId: event.id, userId: user.id },
            defaults: { standName },
        });

        if (wasCreated) created += 1;
    }

    console.log(`Confirmaciones de asistencia sembradas: ${created}`);
};

export default seedAttendances;