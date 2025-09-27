import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { 
  createGlobalMessage, 
  deleteMessage, 
  getMessage, 
  updateMessage, 
  updateMessageAnonymous 
} from "../controllers/messageGlobal.js";

const router = express.Router();

router.post('/global-chat', authMiddleware, createGlobalMessage);

router.get('/global-chat', authMiddleware, getMessage);

router.put('/global-chat/:id', authMiddleware, updateMessage);

router.patch('/global-chat/:id/anonymous', authMiddleware, updateMessageAnonymous);

router.delete('/global-chat/:id', authMiddleware, deleteMessage);

export default router;
