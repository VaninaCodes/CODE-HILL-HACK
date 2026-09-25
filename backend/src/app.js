import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import tagRoutes from "./routes/tag.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tags", tagRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API del hackatón funcionando.",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});