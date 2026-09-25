import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./src/config/database.js";
import "./src/models/index.js";
import routes from "./src/routes/index.js";

import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
import path from "path";
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api", routes);
app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => {
//   res.json({
//     message: "API del hackatón funcionando.",
//   });
// });

const PORT = process.env.PORT || 3000;

sequelize
    .authenticate()
    .then(async () => {
        console.log("Conexión a la base de datos exitosa.");
        await sequelize.sync();
        console.log("Tablas sincronizadas correctamente.");
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar a la base de datos:", error.message);
    });

export default app;