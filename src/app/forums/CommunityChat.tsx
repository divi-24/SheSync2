/* eslint-disable */

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  ArrowLeft,
  Users,
  MessageSquare,
  Bell,
  HelpCircle,
  Star,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Clock
} from 'lucide-react';
import {
  initializeCommunitySocket,
  joinCommunityRoom,
  getCommunityMessages,
  createCommunityMessage,
  sendCommunityMessageViaSocket,
  updateCommunityMessage,
  deleteCommunityMessage,
  updateCommunityMessageViaSocket,
  deleteCommunityMessageViaSocket,
  onNewCommunityMessage,
  onCommunityMessageUpdated,
  onCommunityMessageDeleted,
  onCommunityMessageError,
  cleanDisconnectCommunitySocket,
  CommunityMessage
} from '@/lib/communityChat';
import { getProfile, User as AuthUser } from '@/lib/auth';

// Simple User Avatar
const UserAvatar = ({ name }: { name: string }) => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
    {name.charAt(0).toUpperCase()}
  </div>
);

interface Community {
  _id: string;
  name: string;
  description?: string;
  members: string[];
  postCount: number;
  messageCount: number;
}

interface CommunityChatProps {
  isOpen: boolean;
  onClose: () => void;
  community: Community;
}

const CommunityChat: React.FC<CommunityChatProps> = ({ isOpen, onClose, community }) => {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listenersSetup = useRef(false);

  // Utility function to remove duplicate messages
  const deduplicateMessages = (msgs: CommunityMessage[]): CommunityMessage[] => {
    const seen = new Set<string>();
    const unique: CommunityMessage[] = [];

    for (const msg of msgs) {
      const key = `${msg._id}-${msg.content}-${msg.createdAt}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(msg);
      }
    }

    return unique;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;

    let isComponentMounted = true;

    const initializeChat = async () => {
      try {
        setLoading(true);
        setError('');

        // Get current user
        const user = await getProfile().catch(() => null);
        if (!isComponentMounted) return;

        setCurrentUser(user);

        if (!user) {
          setError('Please log in to participate in community chat');
          setLoading(false);
          return;
        }

        // Clear any existing messages to prevent duplicates
        setMessages([]);

        // Initialize socket connection
        try {
          await initializeCommunitySocket();
          if (!isComponentMounted) return;
        } catch (socketError) {
          if (!isComponentMounted) return;
          console.error('Socket initialization failed:', socketError);
          setError('Unable to connect to chat server. Some features may not work properly.');
          // Continue with REST API only mode
        }

        // Join the community room
        try {
          await joinCommunityRoom(community._id);
          if (!isComponentMounted) return;
        } catch (joinError) {
          if (!isComponentMounted) return;
          console.error('Failed to join community room:', joinError);
          // Continue without real-time updates
        }

        // Fetch initial messages
        const initialMessages = await getCommunityMessages(community._id);
        if (!isComponentMounted) return;

        // Deduplicate and reverse messages
        const uniqueMessages = deduplicateMessages(initialMessages);
        setMessages(uniqueMessages.reverse()); // Reverse to show oldest first

        // Set up socket event listeners only once
        if (!listenersSetup.current) {
          listenersSetup.current = true;

          try {
            await onNewCommunityMessage((message: CommunityMessage) => {
              if (!isComponentMounted) return;
              setMessages(prev => {
                // Enhanced duplicate check: by ID, content, and timestamp
                const exists = prev.some(msg =>
                  msg._id === message._id ||
                  (msg.content === message.content &&
                    msg.sender?._id === message.sender?._id &&
                    Math.abs(new Date(msg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 1000)
                );
                if (exists) {
                  console.log('Duplicate message detected, skipping:', message._id);
                  return prev;
                }
                console.log('Adding new message:', message._id);
                return [...prev, message];
              });
            });

            await onCommunityMessageUpdated((message: CommunityMessage) => {
              if (!isComponentMounted) return;
              console.log('Message updated via socket:', message._id);
              setMessages(prev => prev.map(msg =>
                msg._id === message._id ? message : msg
              ));
            });

            await onCommunityMessageDeleted(({ messageId }) => {
              if (!isComponentMounted) return;
              console.log('Message deleted via socket:', messageId);
              setMessages(prev => prev.filter(msg => msg._id !== messageId));
            });

            await onCommunityMessageError(({ error }) => {
              if (!isComponentMounted) return;
              setError(error);
              setTimeout(() => {
                if (isComponentMounted) setError("");
              }, 5000);
            });
          } catch (listenerError) {
            console.error('Failed to set up socket listeners:', listenerError);
            // Continue without real-time updates
          }
        }
      } catch (err) {
        if (!isComponentMounted) return;
        console.error('Error initializing community chat:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chat');
      } finally {
        if (isComponentMounted) setLoading(false);
      }
    };

    initializeChat();

    return () => {
      isComponentMounted = false;
      listenersSetup.current = false;
      cleanDisconnectCommunitySocket();
    };
  }, [isOpen, community._id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanDisconnectCommunitySocket();
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const messageContent = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX

    try {
      // Send via socket for real-time delivery
      await sendCommunityMessageViaSocket({
        communityId: community._id,
        sender: currentUser.id,
        content: messageContent,
        isAnonymous,
      });
    } catch (err) {
      console.error('Socket send failed, falling back to REST API:', err);
      // Fallback to REST API if socket fails
      try {
        const message = await createCommunityMessage({
          communityId: community._id,
          content: messageContent,
          isAnonymous,
        });

        // Only add to local state if not already present (socket might have worked)
        setMessages(prev => {
          const allMessages = [...prev, message];
          return deduplicateMessages(allMessages);
        });
      } catch (restErr) {
        setError(restErr instanceof Error ? restErr.message : 'Failed to send message');
        setNewMessage(messageContent); // Restore message content on error
      }
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessage(messageId);
    setEditContent(content);
  };

  const handleUpdateMessage = async (messageId: string) => {
    if (!editContent.trim() || !currentUser) return;

    try {
      // Try WebSocket first for real-time update
      await updateCommunityMessageViaSocket({
        messageId,
        content: editContent.trim(),
        userId: currentUser.id,
        communityId: community._id,
      });

      setEditingMessage(null);
      setEditContent("");
    } catch (err) {
      console.error('WebSocket update failed, falling back to REST API:', err);
      // Fallback to REST API if socket fails
      try {
        const updatedMessage = await updateCommunityMessage(messageId, {
          content: editContent.trim(),
        });

        setMessages(prev => prev.map(msg =>
          msg._id === messageId ? { ...msg, ...updatedMessage } : msg
        ));

        setEditingMessage(null);
        setEditContent("");
      } catch (restErr) {
        setError(restErr instanceof Error ? restErr.message : 'Failed to update message');
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to delete this message?') || !currentUser) return;

    try {
      // Try WebSocket first for real-time deletion
      await deleteCommunityMessageViaSocket({
        messageId,
        userId: currentUser.id,
        communityId: community._id,
      });
    } catch (err) {
      console.error('WebSocket delete failed, falling back to REST API:', err);
      // Fallback to REST API if socket fails
      try {
        await deleteCommunityMessage(messageId);
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
      } catch (restErr) {
        setError(restErr instanceof Error ? restErr.message : 'Failed to delete message');
      }
    }
  };

  const handleToggleAnonymity = async (messageId: string, currentAnonymity: boolean) => {
    if (!currentUser) return;

    try {
      // Try WebSocket first for real-time update
      await updateCommunityMessageViaSocket({
        messageId,
        isAnonymous: !currentAnonymity,
        userId: currentUser.id,
        communityId: community._id,
      });
    } catch (err) {
      console.error('WebSocket anonymity toggle failed, falling back to REST API:', err);
      // Fallback to REST API if socket fails
      try {
        const updatedMessage = await updateCommunityMessage(messageId, {
          isAnonymous: !currentAnonymity,
        });

        setMessages(prev => prev.map(msg =>
          msg._id === messageId ? { ...msg, ...updatedMessage } : msg
        ));
      } catch (restErr) {
        setError(restErr instanceof Error ? restErr.message : 'Failed to toggle anonymity');
      }
    }
  };

  const isOwnMessage = (message: CommunityMessage) => {
    return currentUser && message.sender?._id === currentUser.id;
  };

  const getDisplayName = (message: CommunityMessage) => {
    if (message.isAnonymous) return "Anonymous";
    return message.sender?.name || message.sender?.email || "Unknown User";
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;
  useEffect(() => {
    console.log("Messages updated:", messages);
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 "
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col shadow-xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-pink-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="transition-colors"
            >
              <ArrowLeft className="h-6 w-6 stroke-pink-500 hover:stroke-pink-600 transition-colors" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full w-3 h-3 border-2 border-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  {community.name}
                  <Star className="h-4 w-4 text-pink-400 fill-pink-400" />
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {community.members.length} members •
                  <MessageSquare className="h-4 w-4" />
                  {messages.length} messages
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-white ring-1 ring-pink-200 text-pink-500 hover:bg-pink-50 transition dark:bg-gray-800 dark:ring-gray-600">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full bg-white ring-1 ring-pink-200 text-pink-500 hover:bg-pink-50 transition dark:bg-gray-800 dark:ring-gray-600">
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 text-sm"
            >
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-pink-50/30 to-white dark:from-gray-900 dark:to-gray-950">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              <span className="ml-3 text-gray-600">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Be the first to start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={`${message._id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwnMessage(message) ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${isOwnMessage(message) ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <UserAvatar name={getDisplayName(message)} />
                    <div className={`px-4 py-3 rounded-2xl shadow-sm ${isOwnMessage(message)
                      ? 'bg-gradient-to-r from-pink-500 to-pink-400 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                      }`}>
                      <div className="flex items-center mb-1">
                        <span className="text-xs font-medium opacity-75">
                          {getDisplayName(message)}
                        </span>
                        {message.isAnonymous && (
                          <EyeOff className="h-3 w-3 ml-1 opacity-60" />
                        )}
                      </div>

                      {editingMessage === message._id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-2 text-sm bg-white dark:bg-gray-900 border rounded resize-none text-gray-800 dark:text-gray-200"
                            rows={2}
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingMessage(null)}
                              className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateMessage(message._id)}
                              className="text-xs px-2 py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 opacity-50" />
                              <span className="text-xs opacity-75">
                                {formatTime(message.createdAt)}
                              </span>
                              {message.updatedAt !== message.createdAt && (
                                <span className="text-xs opacity-50">(edited)</span>
                              )}
                            </div>
                            {isOwnMessage(message) && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleToggleAnonymity(message._id, message.isAnonymous)}
                                  className="text-xs p-1 rounded hover:bg-black/10"
                                  title={message.isAnonymous ? "Make public" : "Make anonymous"}
                                >
                                  {message.isAnonymous ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                </button>
                                <button
                                  onClick={() => handleEditMessage(message._id, message.content)}
                                  className="text-xs p-1 rounded hover:bg-black/10"
                                  title="Edit message"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(message._id)}
                                  className="text-xs p-1 rounded hover:bg-red-500/20"
                                  title="Delete message"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {currentUser ? (
          <form onSubmit={handleSendMessage} className="p-4 border-t border-pink-100 bg-pink-50/50 dark:bg-gray-800 dark:border-gray-700 rounded-b-lg">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-600 dark:text-gray-400">
                  Send anonymously
                </label>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-xl transition hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="border-t p-4 text-center text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
            Please log in to participate in the community chat
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CommunityChat;