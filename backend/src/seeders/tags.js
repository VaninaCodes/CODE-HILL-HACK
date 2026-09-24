import sequelize from "../config/database.js";
import { Tag } from "../models/index.js";

const tags = [
    // Emprendimiento
    { name: "Administración", category: "Emprendimiento" },
    { name: "Contabilidad", category: "Emprendimiento" },
    { name: "Finanzas", category: "Emprendimiento" },
    { name: "Marketing", category: "Emprendimiento" },
    { name: "Ventas", category: "Emprendimiento" },
    { name: "Atención al cliente", category: "Emprendimiento" },

    // Tecnología
    { name: "Programación", category: "Tecnología" },
    { name: "Desarrollo web", category: "Tecnología" },
    { name: "Aplicaciones", category: "Tecnología" },
    { name: "Inteligencia artificial", category: "Tecnología" },
    { name: "Bases de datos", category: "Tecnología" },
    { name: "Ciberseguridad", category: "Tecnología" },

    // Creatividad
    { name: "Diseño gráfico", category: "Creatividad" },
    { name: "Fotografía", category: "Creatividad" },
    { name: "Video", category: "Creatividad" },
    { name: "Ilustración", category: "Creatividad" },
    { name: "Música", category: "Creatividad" },
    { name: "Escritura", category: "Creatividad" },

    // Gastronomía
    { name: "Cocina", category: "Gastronomía" },
    { name: "Repostería", category: "Gastronomía" },
    { name: "Panadería", category: "Gastronomía" },
    { name: "Catering", category: "Gastronomía" },
    { name: "Bebidas", category: "Gastronomía" },

    // Producción
    { name: "Agricultura", category: "Producción" },
    { name: "Ganadería", category: "Producción" },
    { name: "Artesanías", category: "Producción" },
    { name: "Textil", category: "Producción" },
    { name: "Manufactura", category: "Producción" },

    // Educación
    { name: "Idiomas", category: "Educación" },
    { name: "Matemática", category: "Educación" },
    { name: "Capacitación", category: "Educación" },
    { name: "Tutorías", category: "Educación" },

    // Servicios
    { name: "Reparaciones", category: "Servicios" },
    { name: "Limpieza", category: "Servicios" },
    { name: "Transporte", category: "Servicios" },
    { name: "Consultoría", category: "Servicios" },
    { name: "Servicios profesionales", category: "Servicios" },
];

try {
    await sequelize.authenticate();

    await Tag.bulkCreate(tags, {
        ignoreDuplicates: true,
    });

    console.log("Etiquetas cargadas correctamente.");
} catch (error) {
    console.error("Error al cargar las etiquetas:", error);
} finally {
    await sequelize.close();
}