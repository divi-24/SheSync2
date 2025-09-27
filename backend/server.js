import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import globalRoutes from './routes/globalRoutes.js';
import cycleRoutes from './routes/cycleRoutes.js';
import authRoutes from './routes/auth.js';
import invitationRoutes from './routes/invitation.js';
import dashboardRoutes from './routes/dashboard.js';
import parentRoutes from './routes/parent.js';
import symptomsRoutes from './routes/symptomsRoutes.js';
import pregnancyRoutes from './routes/pregnancyRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import postRoutes from './routes/postRoutes.js';
import waitlistRoutes from './routes/waitlistRoutes.js';
import periodTrackerRoutes from './routes/periodTrackerRoutes.js';
import Message from './models/Message.js';
import GlobalMessage from './models/GlobalMessage.js';
import Community from './models/Community.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND,
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: FRONTEND, credentials: true }));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connect error', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/parent', parentRoutes);
app.use("/api/cycles", cycleRoutes);
app.use("/api/symptoms", symptomsRoutes);
app.use("/api/pregnancy", pregnancyRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/global", globalRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/period-tracker", periodTrackerRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// SOCKET.IO SETUP
io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  // Join global chat room
  socket.on("joinGlobalChat", () => {
    socket.join("globalChat");
    console.log(`User ${socket.id} joined global chat`);
  });

  // Join a community room
  socket.on("joinCommunity", (communityId) => {
    socket.join(communityId);
    console.log(`User ${socket.id} joined community ${communityId}`);
  });

  // Handle sending message to community
  socket.on("sendMessage", async ({ communityId, sender, content, isAnonymous }) => {
    try {
      const newMessage = new Message({
        communityId,
        sender,
        content,
        isAnonymous,
      });

      await newMessage.save();

      // Update community message count
      const community = await Community.findById(communityId);
      if (community) {
        community.messageCount += 1;
        await community.save();
        console.log("Updated message count in db for community:", communityId);
      }

      await newMessage.populate("sender", "name username email");

      // Shape response: hide sender if anonymous
      const response = {
        _id: newMessage._id,
        communityId: newMessage.communityId,
        content: newMessage.content,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
        isAnonymous: newMessage.isAnonymous,
        sender: newMessage.isAnonymous
          ? { name: "Anonymous", username: "Anonymous", email: null }
          : newMessage.sender,
      };

      // Emit to all users in that community
      io.to(communityId).emit("newMessage", response);
    } catch (err) {
      console.error("Error saving message:", err);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });

  // Handle updating community message
  socket.on("updateMessage", async ({ messageId, content, isAnonymous, userId, communityId }) => {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        socket.emit("messageError", { error: "Message not found" });
        return;
      }

      // Check if user owns the message
      if (message.sender.toString() !== userId) {
        socket.emit("messageError", { error: "Not authorized to update this message" });
        return;
      }

      // Update message fields
      if (content !== undefined) message.content = content;
      if (isAnonymous !== undefined) message.isAnonymous = isAnonymous;

      const updatedMessage = await message.save();
      await updatedMessage.populate("sender", "name username email");

      // Shape response
      const response = {
        _id: updatedMessage._id,
        communityId: updatedMessage.communityId,
        content: updatedMessage.content,
        createdAt: updatedMessage.createdAt,
        updatedAt: updatedMessage.updatedAt,
        isAnonymous: updatedMessage.isAnonymous,
        sender: updatedMessage.isAnonymous
          ? { name: "Anonymous", username: "Anonymous", email: null }
          : updatedMessage.sender,
      };

      // Emit to all users in that community
      io.to(communityId).emit("messageUpdated", response);
    } catch (err) {
      console.error("Error updating message:", err);
      socket.emit("messageError", { error: "Failed to update message" });
    }
  });

  // Handle deleting community message
  socket.on("deleteMessage", async ({ messageId, userId, communityId }) => {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        socket.emit("messageError", { error: "Message not found" });
        return;
      }

      // Check if user owns the message
      if (message.sender.toString() !== userId) {
        socket.emit("messageError", { error: "Not authorized to delete this message" });
        return;
      }

      await Message.findByIdAndDelete(messageId);

      // Update community message count
      const community = await Community.findById(communityId);
      if (community) {
        community.messageCount -= 1;
        await community.save();
        console.log("Updated message count in db for community:", communityId);
      }

      // Emit to all users in that community
      io.to(communityId).emit("messageDeleted", { messageId });
    } catch (err) {
      console.error("Error deleting message:", err);
      socket.emit("messageError", { error: "Failed to delete message" });
    }
  });

  // Handle sending global message
  socket.on("sendGlobalMessage", async ({ sender, content, isAnonymous, mediaUrl }) => {
    try {
      const newMessage = new GlobalMessage({
        sender,
        content,
        isAnonymous,
        mediaUrl,
      });

      await newMessage.save();

      // Populate sender information for response
      await newMessage.populate("sender", "name email");

      // Shape response: hide sender if anonymous but preserve original for ownership
      const response = {
        _id: newMessage._id,
        content: newMessage.content,
        mediaUrl: newMessage.mediaUrl,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
        isAnonymous: newMessage.isAnonymous,
        sender: newMessage.sender, // Keep original sender for ownership checking
        displaySender: newMessage.isAnonymous
          ? { _id: "anonymous", name: "Anonymous", email: null }
          : newMessage.sender,
      };

      // Emit to all users in global chat
      io.to("globalChat").emit("newGlobalMessage", response);
    } catch (err) {
      console.error("Error saving global message:", err);
      socket.emit("globalMessageError", { error: "Failed to send message" });
    }
  });

  // Handle updating global message
  socket.on("updateGlobalMessage", async ({ messageId, content, userId }) => {
    try {
      const message = await GlobalMessage.findById(messageId);

      if (!message) {
        socket.emit("globalMessageError", { error: "Message not found" });
        return;
      }

      // Check if user owns the message
      if (message.sender.toString() !== userId) {
        socket.emit("globalMessageError", { error: "Not authorized to update this message" });
        return;
      }

      message.content = content;
      const updatedMessage = await message.save();
      await updatedMessage.populate("sender", "name email");

      // Shape response
      const response = {
        _id: updatedMessage._id,
        content: updatedMessage.content,
        mediaUrl: updatedMessage.mediaUrl,
        createdAt: updatedMessage.createdAt,
        updatedAt: updatedMessage.updatedAt,
        isAnonymous: updatedMessage.isAnonymous,
        sender: updatedMessage.sender, // Keep original sender for ownership checking
        displaySender: updatedMessage.isAnonymous
          ? { _id: "anonymous", name: "Anonymous", email: null }
          : updatedMessage.sender,
      };

      // Emit to all users in global chat
      io.to("globalChat").emit("globalMessageUpdated", response);
    } catch (err) {
      console.error("Error updating global message:", err);
      socket.emit("globalMessageError", { error: "Failed to update message" });
    }
  });

  // Handle deleting global message
  socket.on("deleteGlobalMessage", async ({ messageId, userId }) => {
    try {
      const message = await GlobalMessage.findById(messageId);

      if (!message) {
        socket.emit("globalMessageError", { error: "Message not found" });
        return;
      }

      // Check if user owns the message
      if (message.sender.toString() !== userId) {
        socket.emit("globalMessageError", { error: "Not authorized to delete this message" });
        return;
      }

      await GlobalMessage.findByIdAndDelete(messageId);

      // Emit to all users in global chat
      io.to("globalChat").emit("globalMessageDeleted", { messageId });
    } catch (err) {
      console.error("Error deleting global message:", err);
      socket.emit("globalMessageError", { error: "Failed to delete message" });
    }
  });

  // Handle updating message anonymity
  socket.on("updateGlobalMessageAnonymity", async ({ messageId, isAnonymous, userId }) => {
    try {
      const message = await GlobalMessage.findById(messageId);

      if (!message) {
        socket.emit("globalMessageError", { error: "Message not found" });
        return;
      }

      // Check if user owns the message
      if (message.sender.toString() !== userId) {
        socket.emit("globalMessageError", { error: "Not authorized to update this message" });
        return;
      }

      message.isAnonymous = isAnonymous;
      const updatedMessage = await message.save();
      await updatedMessage.populate("sender", "name email");

      // Shape response
      const response = {
        _id: updatedMessage._id,
        content: updatedMessage.content,
        mediaUrl: updatedMessage.mediaUrl,
        createdAt: updatedMessage.createdAt,
        updatedAt: updatedMessage.updatedAt,
        isAnonymous: updatedMessage.isAnonymous,
        sender: updatedMessage.sender, // Keep original sender for ownership checking
        displaySender: updatedMessage.isAnonymous
          ? { _id: "anonymous", name: "Anonymous", email: null }
          : updatedMessage.sender,
      };

      // Emit to all users in global chat
      io.to("globalChat").emit("globalMessageAnonymityUpdated", response);
    } catch (err) {
      console.error("Error updating global message anonymity:", err);
      socket.emit("globalMessageError", { error: "Failed to update message anonymity" });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
