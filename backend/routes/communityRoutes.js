
import express from "express";
import {
    createCommunity,
  getCommunities,
  getCommunity,
  joinCommunity,
  leaveCommunity,
} from "../controllers/communityController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.post("/", authMiddleware, createCommunity); // Create new community
router.get("/", getCommunities);                 // List all
router.get("/:id", getCommunity);               // Get one
router.post("/join/:id", authMiddleware, joinCommunity);   // Join (auth required)
router.post("/leave/:id", authMiddleware, leaveCommunity); // Leave (auth required)

export default router;
