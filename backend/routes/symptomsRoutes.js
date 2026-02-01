// backend/routes/symptomsRoutes.js
import express from "express";
import { upsertSymptoms, getSymptoms, getSymptomsByDate, analyzeSymptoms } from "../controllers/symptomsController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Add request logging middleware
router.use((req, res, next) => {
  console.log("[SymptomsRouter] Incoming request:", req.method, req.path);
  next();
});

// @route   GET /api/symptoms/test
// @desc    Test endpoint - no auth required
// @access  Public
router.get("/test", (req, res) => {
  console.log("[SymptomsRouter] Test endpoint hit");
  res.json({ message: "Symptoms router is working!", timestamp: new Date() });
});

// @route   POST /api/symptoms/analyze/advanced
// @desc    Analyze symptoms with AI and medical facts
// @access  Private
router.post("/analyze/advanced", (req, res, next) => {
  console.log("[SymptomsRouter] POST /analyze/advanced received");
  authMiddleware(req, res, () => {
    console.log("[SymptomsRouter] Auth passed, calling analyzeSymptoms");
    analyzeSymptoms(req, res);
  });
});

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
