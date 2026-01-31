// backend/routes/symptomsRoutes.js
import express from "express";
import { upsertSymptoms, getSymptoms, getSymptomsByDate } from "../controllers/symptomsController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/symptoms
// @desc    Create or update symptoms log
// @access  Private
router.post("/", authMiddleware, upsertSymptoms);

// @route   GET /api/symptoms
// @desc    Get all symptom logs
// @access  Private
router.get("/", authMiddleware, getSymptoms);

// @route   GET /api/symptoms/:date
// @desc    Get symptoms for a specific date (YYYY-MM-DD)
// @access  Private
router.get("/:date", authMiddleware, getSymptomsByDate);

export default router;
