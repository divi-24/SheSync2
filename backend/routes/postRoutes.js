import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import upload from "../config/multer.js";
import {
    createPost,
    getPosts,
    getPostById,
    getPostsByCommunity,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
    getCommentsByPost,
    updateComment,
    deleteComment,
    toggleCommentLike
} from "../controllers/postController.js";

const router = express.Router();

// Create a new post (protected) - with file upload support
router.post("/", authMiddleware, upload.array("media", 5), createPost);

// Get all posts (public or protected based on your needs)
router.get("/", getPosts);

// Get posts by community ID with pagination (public)
router.get("/community/:communityId", getPostsByCommunity);

// Get single post by ID (public)
router.get("/:id", getPostById);

// Update post (protected - only author can update) - with file upload support
router.put("/:id", authMiddleware, upload.array("media", 5), updatePost);

// Delete post (protected - only author can delete)
router.delete("/:id", authMiddleware, deletePost);

// Like/Unlike post (protected)
router.post("/:id/like", authMiddleware, toggleLike);

// ================= COMMENT ROUTES =================

// Add comment to post (protected)
router.post("/:postId/comments", authMiddleware, addComment);

// Get comments for a post (public)
router.get("/:postId/comments", getCommentsByPost);

// Update comment (protected - only comment author)
router.put("/comments/:commentId", authMiddleware, updateComment);

// Delete comment (protected - only comment author)
router.delete("/comments/:commentId", authMiddleware, deleteComment);

// Like/Unlike comment (protected)
router.post("/comments/:commentId/like", authMiddleware, toggleCommentLike);

export default router;
