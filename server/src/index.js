import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.js";
import prescriptionRoutes from "./routes/prescription.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// sync SQLite database
sequelize
  .sync()
  .then(() => console.log("SQLite Database & tables created!"))
  .catch((err) => console.error("DB sync error:", err));

// routes
app.get("/", (req, res) => {
  res.json({
    message: "Prescription API is running",
    endpoints: {
      auth: "/api/v1/auth",
      prescriptions: "/api/v1/prescriptions",
    },
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/prescriptions", prescriptionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
