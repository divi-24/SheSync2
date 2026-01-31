import express from "express";
import { createCycle, getCycles, getCycleById, updateCycle, deleteCycle } from "../controllers/cycleControllers.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/cycles
// @desc    Create a new cycle
// @access  Private
router.post("/", authMiddleware, createCycle);

// @route   GET /api/cycles
// @desc    Get all cycles for the logged-in user
// @access  Private
router.get("/", authMiddleware, getCycles);

// @route   GET /api/cycles/:id
// @desc    Get a single cycle by ID
// @access  Private
router.get("/:id", authMiddleware, getCycleById);

// @route   PUT /api/cycles/:id
// @desc    Update a cycle by ID
// @access  Private
router.put("/:id", authMiddleware, updateCycle);

// @route   DELETE /api/cycles/:id
// @desc    Delete a cycle by ID
// @access  Private
router.delete("/:id", authMiddleware, deleteCycle);

export default router;
