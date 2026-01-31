
import express from "express";
const router = express.Router();

import userController from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

// PATCH /api/user/privacy
router.patch("/privacy", authMiddleware, userController.patchPrivacySettings);

// PATCH /api/user/preferences
router.patch("/preferences", authMiddleware, userController.patchPreferencesSettings);

export default router;