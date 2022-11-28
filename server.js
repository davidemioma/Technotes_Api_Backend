import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";
import { connectDB } from "./config/dbConnect.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import noteRoutes from "./routes/notes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8800;

//Middleqare
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/notes", noteRoutes);

app.listen(PORT, () => {
  connectDB();

  console.log(`Server running on port ${PORT}`);
});
