import sequelize from "./config/database.js";
import "./models/index.js";

try {
    await sequelize.authenticate();

    console.log("Conexión a la base de datos exitosa.");

    await sequelize.sync();

    console.log("Tablas creadas correctamente.");
} catch (error) {
    console.error("Error:", error.message);
} finally {
    await sequelize.close();
}