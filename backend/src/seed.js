import sequelize from "./config/database.js";
import "./models/index.js";
import { runSeeders } from "./seeders/index.js";

try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos exitosa.");

    await sequelize.sync();
    console.log("Tablas sincronizadas correctamente.");

    await runSeeders();
} catch (error) {
    console.error("Error al sembrar la base de datos:", error.message);
} finally {
    await sequelize.close();
}