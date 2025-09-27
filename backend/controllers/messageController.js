import Message from "../models/Message.js";
import Community from "../models/Community.js";
import User from "../models/user.js";
let comId;
// Send Message
export const sendMessage = async (req, res) => {
    try {
        const { communityId, content, isAnonymous } = req.body;
        const sender = req.user.id;
        comId = communityId;

        // Check if community exists using findOne with modern syntax
        const community = await Community.findOne({ _id: communityId });
        if (!community) {
            return res.status(404).json({
                success: false,
                error: "Community not found"
            });
        }

        const messageData = {
            communityId,
            sender,
            content,
            isAnonymous,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const newMessage = await Message.create(messageData);
        const communitycnt = await Community.findById(communityId);
        communitycnt.messageCount += 1;
        await communitycnt.save();
        console.log("Updated count in db for communities");


        res.status(201).json({
            success: true,
            data: newMessage
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Get all messages for a community with manual population
export const getMessagesByCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;

        // Get messages first
        const messages = await Message.find({ communityId })
            .sort({ createdAt: -1 })
            .lean();

        // Get unique sender IDs
        const senderIds = [...new Set(messages.map(msg => msg.sender.toString()))];

        // Fetch users data
        const users = await User.find(
            { _id: { $in: senderIds } },
            { name: 1, username: 1, email: 1, _id: 1 }
        ).lean();

        // Create a Map for efficient lookup
        const userMap = new Map(users.map(user => [user._id.toString(), user]));

        // Manually populate sender data
        const populatedMessages = messages.map(message => ({
            ...message,
            sender: userMap.get(message.sender.toString()) || null
        }));

        res.status(200).json({
            success: true,
            data: populatedMessages
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Delete message (admin or owner)
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.isAdmin;

        const message = await Message.findOne({ _id: messageId }).lean();

        if (!message) {
            return res.status(404).json({
                success: false,
                error: "Message not found"
            });
        }

        // Check authorization using modern comparison
        const isOwner = message.sender.toString() === userId;

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized to delete this message"
            });
        }

        // Use deleteOne with filter instead of instance method
        const deleteResult = await Message.deleteOne({ _id: messageId });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                error: "Message not found or already deleted"
            });
        }
        const communitycnt = await Community.findById(message.communityId);
        communitycnt.messageCount -= 1;
        await communitycnt.save();

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Update message (only owner can update)
export const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content, isAnonymous } = req.body;
        const userId = req.user.id;

        // Find the message
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                error: "Message not found"
            });
        }

        // Authorization check → only sender can edit
        if (message.sender.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized to update this message"
            });
        }

        // Update fields
        if (content !== undefined) message.content = content;
        if (isAnonymous !== undefined) message.isAnonymous = isAnonymous;
        message.updatedAt = new Date();

        await message.save();

        res.status(200).json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error("Error updating message:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

