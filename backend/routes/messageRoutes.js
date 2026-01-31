import express from "express";
import { sendMessage, getMessagesByCommunity, deleteMessage, updateMessage } from "../controllers/messageController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// POST - send message
router.post("/", authMiddleware, sendMessage);

// GET - all messages for a community
router.get("/:communityId", authMiddleware, getMessagesByCommunity);

// DELETE - delete message
router.delete("/:messageId", authMiddleware, deleteMessage);
router.put("/:messageId", authMiddleware, updateMessage);

export default router;
