import express from "express";
import {
  createPregnancy,
  getActivePregnancy,
  updatePregnancy,
  archivePregnancy,
  getPregnancyHistory,
} from "../controllers/pregnancyController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/pregnancy
// @desc    Create a new pregnancy record
router.post("/", authMiddleware, createPregnancy);

// @route   GET /api/pregnancy/active
// @desc    Get active pregnancy
router.get("/active", authMiddleware, getActivePregnancy);

// @route   PUT /api/pregnancy/:id
// @desc    Update pregnancy info/milestones
router.put("/:id", authMiddleware, updatePregnancy);

// @route   PATCH /api/pregnancy/:id/archive
// @desc    Mark pregnancy as inactive
router.patch("/:id/archive", authMiddleware, archivePregnancy);

// @route   GET /api/pregnancy
// @desc    Get pregnancy history
router.get("/", authMiddleware, getPregnancyHistory);

export default router;
