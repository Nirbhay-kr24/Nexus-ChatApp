import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import geminiRoutes from "./routes/gemini.routes.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// MIDDLEWARES 
app.use(express.json()); 
app.use(cookieParser()); 
app.use(
  cors({
    origin: FRONTEND_URL, // frontend URL 
    credentials: true, // allow cookies/auth
  })
);

// ROUTES 
app.use("/api/gemini", geminiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// PRODUCTION STATIC FILES 
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// START SERVER 
server.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
  connectDB();
});
