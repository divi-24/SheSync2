import express from "express";
import {
  createPregnancy,
  getActivePregnancy,
  updatePregnancy,
  archivePregnancy,
  deletePregnancy,
  getPregnancyHistory,
} from "../controllers/pregnancyController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// IMPORTANT: Specific routes must come BEFORE dynamic :id routes to avoid conflicts

// @route   POST /api/pregnancy
// @desc    Create a new pregnancy record
router.post("/", authMiddleware, createPregnancy);

// @route   GET /api/pregnancy/active
// @desc    Get active pregnancy (must come before /:id routes)
router.get("/active", authMiddleware, getActivePregnancy);

// @route   PATCH /api/pregnancy/:id/archive
// @desc    Mark pregnancy as inactive (must come before general /:id routes)
router.patch("/:id/archive", authMiddleware, archivePregnancy);

// @route   PUT /api/pregnancy/:id
// @desc    Update pregnancy info/milestones
router.put("/:id", authMiddleware, updatePregnancy);

// @route   DELETE /api/pregnancy/:id
// @desc    Delete pregnancy record permanently
router.delete("/:id", authMiddleware, deletePregnancy);

// @route   GET /api/pregnancy
// @desc    Get pregnancy history (must come LAST after all specific routes)
router.get("/", authMiddleware, getPregnancyHistory);

export default router;
