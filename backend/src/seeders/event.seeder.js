import { User, Tag, Event } from "../models/index.js";

// [username organizador, titulo, descripcion, ubicacion, fecha, tags]
const eventsData = [
    [
        "consultorapyme",
        "Feria de Emprendedores Formosa 2026",
        "Feria abierta al público con stands de emprendimientos locales de gastronomía, artesanías y textiles.",
        "Costanera de Formosa",
        new Date("2026-11-15T10:00:00"),
        ["Ventas", "Marketing"],
    ],
    [
        "cateringdonarosa",
        "Expo Gastronómica del Litoral",
        "Muestra de sabores regionales con degustaciones y venta directa de productores gastronómicos.",
        "Centro Cultural Formosa",
        new Date("2026-10-20T11:00:00"),
        ["Cocina", "Catering"],
    ],
    [
        "marketinglitoral",
        "Capacitación en Marketing Digital",
        "Taller práctico sobre redes sociales y publicidad online orientado a pequeños negocios.",
        "Sede Consultora PyME",
        new Date("2026-10-05T18:00:00"),
        ["Marketing"],
    ],
    [
        "contableformosa",
        "Rueda de Negocios PyME Formosa",
        "Espacio de networking entre pymes y profesionales para generar nuevos contactos comerciales.",
        "Bolsa de Comercio de Formosa",
        new Date("2026-12-02T09:00:00"),
        ["Consultoría", "Finanzas"],
    ],
];

export const seedEvents = async () => {
    let created = 0;

    for (const [username, title, description, location, eventDate, tagNames] of eventsData) {
        const organizer = await User.findOne({ where: { username } });
        if (!organizer) continue;

        const [event, wasCreated] = await Event.findOrCreate({
            where: { title },
            defaults: { description, location, eventDate, userId: organizer.id },
        });

        const tags = await Tag.findAll({ where: { name: tagNames } });
        if (tags.length) await event.setTags(tags);

        if (wasCreated) created += 1;
    }

    console.log(`Eventos sembrados: ${created}`);
};

export default seedEvents;