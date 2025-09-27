"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Send,
    Heart,
    MoreHorizontal,
    Edit3,
    Trash2,
    User,
    Flag
} from 'lucide-react';

interface Comment {
    _id: string;
    content: string;
    author: {
        _id: string;
        name: string;
        email: string;
    };
    likes: string[];
    likeCount: number;
    replies?: Comment[];
    createdAt: string;
    updatedAt: string;
}

interface CommentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: string;
    currentUserId?: string;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
    isOpen,
    onClose,
    postId,
    currentUserId
}) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Mock comments data - replace with actual API calls
    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                setComments([
                    {
                        _id: '1',
                        content: 'Thank you for sharing this! It\'s really helpful 💕',
                        author: {
                            _id: 'user1',
                            name: 'Sarah Johnson',
                            email: 'sarah@example.com'
                        },
                        likes: ['user2', 'user3'],
                        likeCount: 2,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        _id: '2',
                        content: 'I had a similar experience. Would love to connect and share more about this.',
                        author: {
                            _id: 'user2',
                            name: 'Emma Davis',
                            email: 'emma@example.com'
                        },
                        likes: ['user1'],
                        likeCount: 1,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ]);
                setLoading(false);
            }, 500);
        }
    }, [isOpen, postId]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || submitting) return;

        setSubmitting(true);
        try {
            // Mock API call - replace with actual implementation
            const mockNewComment: Comment = {
                _id: Date.now().toString(),
                content: newComment,
                author: {
                    _id: currentUserId || 'current-user',
                    name: 'You',
                    email: 'you@example.com'
                },
                likes: [],
                likeCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            setComments(prev => [mockNewComment, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLikeComment = (commentId: string) => {
        setComments(prev => prev.map(comment => {
            if (comment._id === commentId) {
                const isLiked = comment.likes.includes(currentUserId || '');
                return {
                    ...comment,
                    likes: isLiked
                        ? comment.likes.filter(id => id !== currentUserId)
                        : [...comment.likes, currentUserId || ''],
                    likeCount: isLiked ? comment.likeCount - 1 : comment.likeCount + 1
                };
            }
            return comment;
        }));
    };

    const handleDeleteComment = (commentId: string) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            setComments(prev => prev.filter(comment => comment._id !== commentId));
        }
    };

    const formatTimeAgo = (date: string) => {
        const now = new Date();
        const commentDate = new Date(date);
        const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Comments</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
                                <p className="text-gray-500 mt-2">Loading comments...</p>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="h-8 w-8 text-pink-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h3>
                                <p className="text-gray-500">Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment._id} className="border-b border-gray-50 pb-4 last:border-b-0">
                                    <div className="flex space-x-3">
                                        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-semibold">
                                                {comment.author.name.charAt(0)}
                                            </span>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="font-semibold text-gray-900 text-sm">
                                                        {comment.author.name}
                                                    </h4>
                                                    <span className="text-gray-500 text-xs">
                                                        {formatTimeAgo(comment.createdAt)}
                                                    </span>
                                                </div>

                                                <div className="relative">
                                                    <button
                                                        onClick={() => setActiveDropdown(
                                                            activeDropdown === comment._id ? null : comment._id
                                                        )}
                                                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                                    </button>

                                                    {activeDropdown === comment._id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]"
                                                        >
                                                            {comment.author._id === currentUserId ? (
                                                                <>
                                                                    <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                                                                        <Edit3 className="h-3 w-3" />
                                                                        <span>Edit</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteComment(comment._id)}
                                                                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                        <span>Delete</span>
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <button className="w-full px-3 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center space-x-2">
                                                                    <Flag className="h-3 w-3" />
                                                                    <span>Report</span>
                                                                </button>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                                                {comment.content}
                                            </p>

                                            <div className="flex items-center space-x-4 mt-2">
                                                <button
                                                    onClick={() => handleLikeComment(comment._id)}
                                                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-pink-600 transition-colors"
                                                >
                                                    <Heart
                                                        className={`h-4 w-4 ${comment.likes.includes(currentUserId || '')
                                                                ? 'text-pink-600 fill-current'
                                                                : ''
                                                            }`}
                                                    />
                                                    <span>{comment.likeCount}</span>
                                                </button>

                                                <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Comment Form */}
                    <div className="border-t border-gray-100 p-6">
                        <form onSubmit={handleSubmitComment} className="flex space-x-3">
                            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    rows={3}
                                />
                                <div className="flex justify-end mt-3">
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim() || submitting}
                                        className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                                    >
                                        {submitting ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                        <span>{submitting ? 'Posting...' : 'Post'}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CommentsModal;
