import GlobalMessage from "../models/GlobalMessage.js";
import User from "../models/user.js";

// POST : send message

export const createGlobalMessage = async (req, res) => {
    try {
        const { content, isAnonymous, mediaUrl } = req.body;
        const sender = req.user.id; // Get sender from authenticated user

        const newMessage = await GlobalMessage.create({
            sender,
            content,
            isAnonymous,
            mediaUrl,
        });

        // shape response: hide sender if anonymous
        const response = {
            _id: newMessage._id,
            content: newMessage.content,
            mediaUrl: newMessage.mediaUrl,
            createdAt: newMessage.createdAt,
            ...(newMessage.isAnonymous
                ? { sender: "Anonymous" }
                : { sender: newMessage.sender }),
        };

        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET : retrieve all messages
export const getMessage = async (req, res) => {
    try {
        const messages = await GlobalMessage.find()
            .populate("sender", "name email") // show user details (using 'name' instead of 'username')
            .sort({ createdAt: -1 });

        // Map messages to handle anonymous ones properly
        const processedMessages = messages.map(message => {
            const messageObj = message.toObject();

            if (messageObj.isAnonymous) {
                // For anonymous messages, keep the original sender ID but show anonymous display info
                messageObj.displaySender = {
                    _id: "anonymous",
                    name: "Anonymous",
                    email: "anonymous@anonymous.com"
                };
                // Keep the original sender for ownership checking
                messageObj.originalSender = messageObj.sender;
            } else {
                // For non-anonymous messages, display sender is the same as sender
                messageObj.displaySender = messageObj.sender;
                messageObj.originalSender = messageObj.sender;
            }

            return messageObj;
        }); return res.status(200).json({ success: true, data: processedMessages });
    } catch (error) {
        console.error("Error retrieving messages:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// DELETE : remove a message
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await GlobalMessage.findByIdAndDelete(id);
        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        return res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// PATCH : update a message
export const updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ success: false, message: "Content is required" });
        }

        const updatedMessage = await GlobalMessage.findByIdAndUpdate(
            id,
            { content },
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        return res.status(200).json({ success: true, message: "Message updated successfully", data: updatedMessage });
    } catch (error) {
        console.error("Error updating message:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// @desc    Update isAnonymous state of a message
// @route   PATCH /api/global/global-chat/:id/anonymous
// @access  Private
export const updateMessageAnonymous = async (req, res) => {
    try {
        const { id } = req.params;
        const { isAnonymous } = req.body;

        if (typeof isAnonymous !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isAnonymous must be a boolean value"
            });
        }

        const message = await GlobalMessage.findById(id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        // only the message owner can update anonymity
        if (message.sender.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to update this message"
            });
        }

        message.isAnonymous = isAnonymous;
        const updatedMessage = await message.save();

        res.status(200).json({
            success: true,
            message: "Message anonymity updated",
            data: updatedMessage,
        });
    } catch (error) {
        console.error("Error updating message anonymity:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

