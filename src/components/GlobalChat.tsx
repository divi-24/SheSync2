/* eslint-disable */

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    MessageSquare,
    Edit3,
    Trash2,
    Eye,
    EyeOff,
    AlertCircle
} from 'lucide-react';
import {
    initializeGlobalChatSocket,
    getGlobalChatSocket,
    disconnectGlobalChatSocket,
    getGlobalMessages,
    sendGlobalMessageViaSocket,
    updateGlobalMessageViaSocket,
    deleteGlobalMessageViaSocket,
    updateGlobalMessageAnonymityViaSocket,
    onNewGlobalMessage,
    onGlobalMessageUpdated,
    onGlobalMessageDeleted,
    onGlobalMessageAnonymityUpdated,
    onGlobalMessageError,
    removeGlobalChatListeners,
    GlobalMessage
} from '@/lib/globalChat';
import { getProfile, User as AuthUser } from '@/lib/auth';

interface GlobalChatProps {
    className?: string;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ className = "" }) => {
    const [messages, setMessages] = useState<GlobalMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const [editingMessage, setEditingMessage] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const initializeChat = async () => {
            try {
                setLoading(true);

                // Get current user
                const user = await getProfile().catch(() => null);
                setCurrentUser(user);

                // Initialize socket connection
                initializeGlobalChatSocket();

                // Remove any existing listeners to prevent duplicates
                removeGlobalChatListeners();

                // Fetch initial messages
                const initialMessages = await getGlobalMessages();
                // Reverse the array to show oldest first (newest at bottom)
                setMessages(initialMessages.reverse());

                // Set up socket event listeners
                onNewGlobalMessage((message: GlobalMessage) => {
                    setMessages(prev => {
                        // Check if message already exists to prevent duplicates
                        const messageExists = prev.some(msg => msg._id === message._id);
                        if (messageExists) {
                            return prev;
                        }
                        // Add new message to the end (bottom) instead of beginning
                        return [...prev, message];
                    });
                });

                onGlobalMessageUpdated((message: GlobalMessage) => {
                    setMessages(prev => prev.map(msg =>
                        msg._id === message._id ? message : msg
                    ));
                });

                onGlobalMessageDeleted(({ messageId }) => {
                    setMessages(prev => prev.filter(msg => msg._id !== messageId));
                });

                onGlobalMessageAnonymityUpdated((message: GlobalMessage) => {
                    setMessages(prev => prev.map(msg =>
                        msg._id === message._id ? message : msg
                    ));
                });

                onGlobalMessageError(({ error }) => {
                    setError(error);
                    setTimeout(() => setError(""), 5000);
                });

            } catch (err) {
                console.error('Error initializing global chat:', err);
                setError(err instanceof Error ? err.message : 'Failed to load chat');
            } finally {
                setLoading(false);
            }
        };

        initializeChat();

        return () => {
            removeGlobalChatListeners();
            disconnectGlobalChatSocket();
        };
    }, []);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !currentUser) return;

        try {
            sendGlobalMessageViaSocket({
                sender: currentUser.id,
                content: newMessage.trim(),
                isAnonymous,
            });
            setNewMessage("");
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send message');
        }
    };

    const handleEditMessage = (messageId: string, content: string) => {
        setEditingMessage(messageId);
        setEditContent(content);
    };

    const handleUpdateMessage = (messageId: string) => {
        if (!editContent.trim() || !currentUser) return;

        try {
            updateGlobalMessageViaSocket(messageId, editContent.trim(), currentUser.id);
            setEditingMessage(null);
            setEditContent("");
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update message');
        }
    };

    const handleDeleteMessage = (messageId: string) => {
        if (!currentUser) return;

        try {
            deleteGlobalMessageViaSocket(messageId, currentUser.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete message');
        }
    };

    const handleToggleAnonymity = (messageId: string, currentAnonymity: boolean) => {
        if (!currentUser) return;

        try {
            updateGlobalMessageAnonymityViaSocket(messageId, !currentAnonymity, currentUser.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to toggle anonymity');
        }
    };

    const isOwnMessage = (message: GlobalMessage) => {
        return currentUser && message.sender._id === currentUser.id;
    };

    if (loading) {
        return (
            <div className={`flex flex-col justify-center items-center py-16 ${className}`}>
                <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500 absolute top-0 left-0"></div>
                </div>
                <span className="mt-4 text-gray-600 font-medium">Connecting to your community...</span>
                <span className="mt-1 text-sm text-gray-400">Building bridges, one conversation at a time</span>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full bg-transparent ${className}`}>
            {/* Error Display */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 text-sm rounded-xl m-4 shadow-sm"
                    >
                        <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-white/30 to-pink-50/20 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-pink-100 rounded-full flex items-center justify-center shadow-sm">
                            <MessageSquare className="h-8 w-8 text-pink-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Start the Conversation</h3>
                        <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
                            Be the first to share something positive and inspiring. Your voice matters here.
                        </p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'} mb-4`}
                            >
                                <div className={`relative max-w-[85%] sm:max-w-sm lg:max-w-md`}>
                                    {/* Message Bubble */}
                                    <div
                                        className={`px-4 py-2 min-w-32 rounded-2xl shadow-sm ${isOwnMessage(message)
                                                ? 'bg-gradient-to-br from-pink-500 to-pink-500/70 text-white'
                                                : 'bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-100'
                                            }`}
                                    >
                                        {/* User Info */}
                                        <div className="flex items-center mb-2">
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isOwnMessage(message) ? 'bg-white/80' : 'bg-pink-400'
                                                }`}></div>
                                            <span className={`text-xs font-medium ${isOwnMessage(message) ? 'text-white/90' : 'text-gray-600'
                                                }`}>
                                                {(message.displaySender || message.sender).name}
                                            </span>
                                            {message.isAnonymous && (
                                                <EyeOff className={`h-3 w-3 ml-2 ${isOwnMessage(message) ? 'text-white/70' : 'text-gray-400'
                                                    }`} />
                                            )}
                                        </div>

                                        {/* Message Content */}
                                        {editingMessage === message._id ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full p-3 text-sm bg-white/95 border border-pink-200 rounded-xl resize-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                                                    rows={3}
                                                    placeholder="Share your thoughts..."
                                                />
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => setEditingMessage(null)}
                                                        className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateMessage(message._id)}
                                                        className="text-xs px-3 py-1.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                                                    >
                                                        Update
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm leading-relaxed mb-3 break-words">{message.content}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-xs ${isOwnMessage(message) ? 'text-white/70' : 'text-gray-400'
                                                        }`}>
                                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                    {isOwnMessage(message) && (
                                                        <div className="flex space-x-1">
                                                            <button
                                                                onClick={() => handleToggleAnonymity(message._id, message.isAnonymous)}
                                                                className="text-xs p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                                                                title={message.isAnonymous ? "Make public" : "Make anonymous"}
                                                            >
                                                                {message.isAnonymous ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditMessage(message._id, message.content)}
                                                                className="text-xs p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                                                                title="Edit message"
                                                            >
                                                                <Edit3 className="h-3 w-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteMessage(message._id)}
                                                                className="text-xs p-1.5 rounded-lg hover:bg-red-400/20 transition-colors"
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

                                    {/* Message Tail */}
                                    <div className={`absolute top-3 w-2 h-2 transform rotate-45 ${isOwnMessage(message)
                                            ? 'bg-gradient-to-br from-pink-500 to-pink-500 -right-0.5'
                                            : 'bg-white/90 border-l border-t border-gray-100 -left-0.5'
                                        }`}></div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {currentUser ? (
                <div className="bg-white/70 backdrop-blur-sm border-t border-gray-200/50 py-2 px-4">
                    <div className="space-y-2">
                        {/* Wellness Tip - Compact */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500 italic">
                                💝 Your words have power to heal and inspire others
                            </p>
                        </div>

                        {/* Input Area */}
                        <div className="flex items-center justify-center space-x-3">
                            <div className="flex-1">
                                {/* Anonymous Toggle - Inline */}
                                <div className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id="anonymous"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                        className="rounded border-pink-300 text-pink-500 focus:ring-pink-400 focus:ring-offset-0 h-3 w-3"
                                    />
                                    <label htmlFor="anonymous" className="text-xs text-gray-600 cursor-pointer ml-2 flex items-center">
                                        <EyeOff className="h-3 w-3 mr-1" />
                                        Send anonymously
                                    </label>
                                </div>

                                <div className="flex justify-center items-center gap-5 px-8">
                                    <div className='relative min-w-full '>

                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Share something positive, ask for support, or just say hello... ✨"
                                        className="w-full p-2 pr-16 border-2 border-pink-200 rounded-2xl resize-none bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 focus:outline-none transition-all duration-200 text-sm"
                                        rows={2}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                        Enter to send
                                    </div>
                                    </div>
                                                                <motion.button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-3 h-12 w-12 bg-gradient-to-r from-pink-500 to-pink-500/70 text-white rounded-2xl hover:from-pink-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex flex-col items-center justify-center "
                            >
                                <Send className="h-4 w-4" />
                            </motion.button>
                                </div>
                            </div>


                        </div>

                        {/* Encouraging Message - Compact */}
                        <div className="text-center">
                            <p className="text-xs text-gray-400">
                                💬 Safe space • Be kind • Share love • Spread positivity
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white/70 backdrop-blur-sm border-t border-gray-200/50 p-4 text-center">
                    <div className="bg-pink-50/80 rounded-xl p-4 border border-pink-200">
                        <MessageSquare className="h-6 w-6 text-pink-400 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium mb-1 text-sm">Join the Conversation</p>
                        <p className="text-xs text-gray-500">
                            Please log in to share your thoughts and connect with our supportive community
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalChat;
