import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import captainRoutes from "./routes/captain.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());
// DB Connect
connectDB();

// Default Home Route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// API Routes
app.use('/user', userRoutes);
app.use('/captain', captainRoutes)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
