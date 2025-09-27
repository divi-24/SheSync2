/* eslint-disable */

"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    Edit3,
    Trash2,
    Flag,
    Clock,
    User,
    Play,
    ChevronLeft,
    ChevronRight,
    X,
    Users
} from 'lucide-react';
import { Post } from '@/lib/posts';

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
    onEdit?: (postId: string) => void;
    onDelete?: (postId: string) => void;
    onShare?: (postId: string) => void;
    currentUserId?: string;
    className?: string;
}

const PostCard: React.FC<PostCardProps> = ({
    post,
    onLike,
    onComment,
    onEdit,
    onDelete,
    onShare,
    currentUserId,
    className = ""
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [showMediaModal, setShowMediaModal] = useState(false);

    const isOwner = currentUserId === post.author._id;
    const isLiked = post.likes.includes(currentUserId || '');
    const hasMedia = post.media && post.media.length > 0;

    const formatTimeAgo = (date: string) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return postDate.toLocaleDateString();
    };

    const nextMedia = () => {
        if (hasMedia && post.media) {
            setCurrentMediaIndex((prev) => (prev + 1) % post.media.length);
        }
    };

    const prevMedia = () => {
        if (hasMedia && post.media) {
            setCurrentMediaIndex((prev) => (prev - 1 + post.media.length) % post.media.length);
        }
    };



    const MediaModal = () => {
        if (!showMediaModal || !hasMedia) return null;

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
                onClick={() => setShowMediaModal(false)}
            >
                <button
                    onClick={() => setShowMediaModal(false)}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                >
                    <X className="h-8 w-8" />
                </button>

                <div className="relative max-w-4xl max-h-4xl">
                    {post.media && post.media[currentMediaIndex] && (
                        <>
                            {post.media[currentMediaIndex].type === 'video' ? (
                                <video
                                    src={post.media[currentMediaIndex].url}
                                    controls
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <img
                                    src={post.media[currentMediaIndex].url}
                                    alt="Post media"
                                    className="max-w-full max-h-full object-contain"
                                />
                            )}                            {post.media.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                        {currentMediaIndex + 1} / {post.media.length}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100 ${className}`}
            >
                {/* Header */}
                <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                                    <span className="text-gray-400">•</span>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {formatTimeAgo(post.createdAt)}
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-purple-600 mt-1">
                                    <Users className="h-3 w-3 mr-1" />
                                    {post.communityId.name}
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <MoreHorizontal className="h-5 w-5 text-gray-500" />
                            </button>

                            {showDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 z-10 min-w-[150px]"
                                >
                                    {isOwner && onEdit && (
                                        <button
                                            onClick={() => {
                                                onEdit(post._id);
                                                setShowDropdown(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                            <span>Edit</span>
                                        </button>
                                    )}
                                    {isOwner && onDelete && (
                                        <button
                                            onClick={() => {
                                                onDelete(post._id);
                                                setShowDropdown(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span>Delete</span>
                                        </button>
                                    )}
                                    {!isOwner && (
                                        <button
                                            onClick={() => {
                                                // Handle report functionality
                                                setShowDropdown(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 flex items-center space-x-2"
                                        >
                                            <Flag className="h-4 w-4" />
                                            <span>Report</span>
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Title */}
                {post.title && (
                    <div className="px-6 pb-2">
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">{post.title}</h2>
                    </div>
                )}

                {/* Content */}
                <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Media */}
                {hasMedia && post.media && (
                    <div className="relative mx-6 mb-4">
                        <div
                            className="relative bg-gray-100 rounded-2xl overflow-hidden cursor-pointer"
                            onClick={() => setShowMediaModal(true)}
                        >
                            {post.media[currentMediaIndex].type === 'video' ? (
                                <div className="relative">
                                    <video
                                        src={post.media[currentMediaIndex].url}
                                        className="w-full h-80 object-cover"
                                        poster=""
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                            <Play className="h-8 w-8 text-white ml-1" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={post.media[currentMediaIndex].url}
                                    alt="Post media"
                                    className="w-full h-80 object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/assets/SheAgent.jpeg'; // Fallback image
                                    }}
                                />
                            )}

                            {post.media.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                        {currentMediaIndex + 1} / {post.media.length}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onLike(post._id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${isLiked
                                        ? 'bg-red-50 text-red-600'
                                        : 'hover:bg-gray-50 text-gray-600'
                                    }`}
                            >
                                <Heart
                                    className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
                                />
                                <span className="font-medium">{post.likes.length}</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onComment(post._id)}
                                className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-50 text-gray-600 transition-all"
                            >
                                <MessageCircle className="h-5 w-5" />
                                <span className="font-medium">{post.comments.length}</span>
                            </motion.button>
                        </div>

                        {onShare && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onShare(post._id)}
                                className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-50 text-gray-600 transition-all"
                            >
                                <Share2 className="h-5 w-5" />
                                <span className="font-medium">Share</span>
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Comments preview */}
                {post.comments.length > 0 && (
                    <div className="px-6 pb-4">
                        <button
                            onClick={() => onComment(post._id)}
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                            View all {post.comments.length} comments
                        </button>
                    </div>
                )}
            </motion.div>

            <MediaModal />

            {/* Backdrop for dropdown */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </>
    );
};

export default PostCard;
