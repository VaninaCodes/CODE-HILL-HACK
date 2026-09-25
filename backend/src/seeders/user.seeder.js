import bcrypt from "bcryptjs";
import { User, Tag } from "../models/index.js";

// Password por defecto para todos los usuarios de prueba
const DEFAULT_PASSWORD = "Formosa2026!";

const usersData = [
    {
        username: "panaderialaformosena",
        email: "contacto@panaderialaformosena.com.ar",
        type: "emprendimiento",
        description: "Panadería artesanal formoseña, especialistas en chipá y facturas caseras.",
        tags: ["Panadería", "Cocina"],
    },
    {
        username: "artesaniaspilaga",
        email: "hola@artesaniaspilaga.com.ar",
        type: "emprendimiento",
        description: "Artesanías en telar y madera de la comunidad Pilagá, hechas a mano.",
        tags: ["Artesanías"],
    },
    {
        username: "viveroestrella",
        email: "info@viveroestrella.com.ar",
        type: "emprendimiento",
        description: "Vivero y producción de plantines cerca del Bañado La Estrella.",
        tags: ["Agricultura"],
    },
    {
        username: "contableformosa",
        email: "estudio@contableformosa.com.ar",
        type: "emprendimiento",
        description: "Estudio contable para pymes y monotributistas de Formosa capital.",
        tags: ["Contabilidad", "Finanzas"],
    },
    {
        username: "tecnoformosa",
        email: "contacto@tecnoformosa.dev",
        type: "emprendimiento",
        description: "Desarrollo de paginas web y apps para emprendimientos locales.",
        tags: ["Desarrollo web", "Programación"],
    },
    {
        username: "disenosquebracho",
        email: "hola@disenosquebracho.com.ar",
        type: "emprendimiento",
        description: "Estudio de diseño grafico: marcas, packaging y redes para pymes.",
        tags: ["Diseño gráfico"],
    },
    {
        username: "cateringdonarosa",
        email: "pedidos@cateringdonarosa.com.ar",
        type: "emprendimiento",
        description: "Catering para eventos: empanadas, asados y mesas dulces.",
        tags: ["Catering"],
    },
    {
        username: "textilesdelnorte",
        email: "ventas@textilesdelnorte.com.ar",
        type: "emprendimiento",
        description: "Confección de indumentaria y textiles con algodón regional.",
        tags: ["Textil"],
    },
    {
        username: "consultorapyme",
        email: "info@consultorapymeformosa.com.ar",
        type: "emprendimiento",
        description: "Consultoria en gestion y formalizacion para pequeños negocios.",
        tags: ["Consultoría"],
    },
    {
        username: "marketinglitoral",
        email: "hola@marketinglitoral.com.ar",
        type: "emprendimiento",
        description: "Gestion de redes sociales y campañas de marketing digital.",
        tags: ["Marketing"],
    },
    {
        username: "juanbenitez",
        email: "juan.benitez@gmail.com",
        type: "persona",
        description: "Estudiante de sistemas, interesado en programacion y apps.",
        tags: ["Programación", "Aplicaciones"],
    },
    {
        username: "mariaacosta",
        email: "maria.acosta@gmail.com",
        type: "persona",
        description: "Amante de la repostería, busco emprendimientos gastronomicos locales.",
        tags: ["Cocina", "Repostería"],
    },
    {
        username: "carlosduarte",
        email: "carlos.duarte@gmail.com",
        type: "persona",
        description: "Productor rural de la zona, interesado en agricultura y ganaderia.",
        tags: ["Agricultura", "Ganadería"],
    },
    {
        username: "luciaferreira",
        email: "lucia.ferreira@gmail.com",
        type: "persona",
        description: "Ilustradora freelance, siempre buscando nuevos proyectos creativos.",
        tags: ["Ilustración", "Fotografía"],
    },
    {
        username: "pedrocardozo",
        email: "pedro.cardozo@gmail.com",
        type: "persona",
        description: "Docente interesado en capacitaciones y tutorias para emprendedores.",
        tags: ["Capacitación", "Tutorías"],
    },
];

export const seedUsers = async () => {
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const createdUsers = [];

    for (const data of usersData) {
        const [user] = await User.findOrCreate({
            where: { username: data.username },
            defaults: {
                email: data.email,
                password: hashedPassword,
                type: data.type,
                description: data.description,
            },
        });

        const tags = await Tag.findAll({ where: { name: data.tags } });
        if (tags.length) await user.setTags(tags);

        createdUsers.push(user);
    }

    console.log(`Usuarios sembrados: ${createdUsers.length} (password para todos: "${DEFAULT_PASSWORD}")`);
    return createdUsers;
};

export default seedUsers;