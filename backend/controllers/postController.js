import Post from "../models/Post.js";
import Community from "../models/Community.js";
import Comment from "../models/Comment.js";
import cloudinary from "../config/cloudinary.js";

// Create Post
export const createPost = async (req, res) => {
    try {
        const { title, content, communityId } = req.body;
        const author = req.user.id; // coming from authMiddleware

        if (!content || !communityId) {
            return res.status(400).json({ success: false, error: "Content and community are required" });
        }

        // Verify community exists
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ success: false, error: "Community not found" });
        }

        // Handle media if uploaded
        let media = [];
        if (req.files && req.files.length > 0) {
            media = req.files.map(file => ({
                url: file.path,
                type: file.mimetype.startsWith("video") ? "video" : "image",
            }));
        }

        const post = await Post.create({
            title,
            content,
            author,
            communityId,
            media,
        });

        // Populate the created post before sending response
        const populatedPost = await Post.findById(post._id)
            .populate("author", "name email")
            .populate("communityId", "name");

        return res.status(201).json({ success: true, data: populatedPost });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Get All Posts
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name email")
            .populate("communityId", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Get Single Post
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "name email")
            .populate("communityId", "name");

        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        return res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error("Error fetching post:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Get Posts by Community
export const getPostsByCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Verify community exists
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ success: false, error: "Community not found" });
        }

        const posts = await Post.find({ communityId })
            .populate("author", "name email")
            .populate("communityId", "name")
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Post.countDocuments({ communityId });

        return res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalPosts: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error("Error fetching community posts:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Update Post
export const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }

        post.title = title || post.title;
        post.content = content || post.content;

        await post.save();
        return res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error("Error updating post:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Delete Post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }

        // Remove media from cloudinary if exists
        if (post.media && post.media.length > 0) {
            for (let item of post.media) {
                const publicId = item.url.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId, { resource_type: item.type === "video" ? "video" : "image" });
            }
        }

        await post.deleteOne();
        return res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Like / Unlike Post (toggle)
export const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        const userId = req.user.id;
        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        // Update likeCount automatically
        post.likeCount = post.likes.length;
        await post.save();

        return res.status(200).json({
            success: true,
            data: { likes: post.likeCount, liked: !alreadyLiked },
        });
    } catch (error) {
        console.error("Error toggling like:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// ======================= COMMENT MANAGEMENT =======================

// Add Comment to Post
export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const author = req.user.id;

        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, error: "Comment content is required" });
        }

        // Verify post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        // Create comment
        const comment = await Comment.create({
            postId,
            author,
            content: content.trim(),
        });

        // Add comment ID to post's comments array
        post.comments.push(comment._id);
        await post.save();

        // Populate the created comment before sending response
        const populatedComment = await Comment.findById(comment._id)
            .populate("author", "name email");

        return res.status(201).json({ success: true, data: populatedComment });
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Get Comments for a Post
export const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        // Verify post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        const comments = await Comment.find({ postId })
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Comment.countDocuments({ postId });

        return res.status(200).json({
            success: true,
            data: comments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalComments: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Update Comment
export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, error: "Comment content is required" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, error: "Comment not found" });
        }

        // Check if user is the author of the comment
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: "Unauthorized to update this comment" });
        }

        comment.content = content.trim();
        await comment.save();

        // Populate updated comment
        const populatedComment = await Comment.findById(comment._id)
            .populate("author", "name email");

        return res.status(200).json({ success: true, data: populatedComment });
    } catch (error) {
        console.error("Error updating comment:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Delete Comment
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, error: "Comment not found" });
        }

        // Check if user is the author of the comment
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: "Unauthorized to delete this comment" });
        }

        // Remove comment from post's comments array
        await Post.findByIdAndUpdate(
            comment.postId,
            { $pull: { comments: commentId } }
        );

        // Delete the comment
        await comment.deleteOne();

        return res.status(200).json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

// Like / Unlike Comment (toggle)
export const toggleCommentLike = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, error: "Comment not found" });
        }

        const alreadyLiked = comment.likes.includes(userId);

        if (alreadyLiked) {
            comment.likes = comment.likes.filter(id => id.toString() !== userId);
        } else {
            comment.likes.push(userId);
        }

        await comment.save();

        return res.status(200).json({
            success: true,
            data: {
                likes: comment.likes.length,
                liked: !alreadyLiked,
                commentId: comment._id
            },
        });
    } catch (error) {
        console.error("Error toggling comment like:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};
