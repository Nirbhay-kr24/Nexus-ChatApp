import express from "express";
import { sendToGemini } from "../controllers/gemini.controller.js";

const router = express.Router();

router.post("/", sendToGemini);

export default router;
