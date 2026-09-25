import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: false,
    }
);
export const startDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        console.log("Se conecto a la base de datos");
    } catch (error) {
        console.log("No se pudo conectar a la base de datos: ", error);
    }
};

export default sequelize;