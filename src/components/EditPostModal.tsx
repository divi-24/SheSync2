/* eslint-disable */

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Send,
    Image as ImageIcon,
    AlertCircle,
    Sparkles
} from 'lucide-react';
import { updatePost, Post } from '@/lib/posts';

interface Community {
    _id: string;
    name: string;
    description: string;
    members: string[];
}

interface EditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostUpdated: (updatedPost: Post) => void;
    post: Post | null;
    communities: Community[];
}

const EditPostModal: React.FC<EditPostModalProps> = ({
    isOpen,
    onClose,
    onPostUpdated,
    post,
    communities
}) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [existingMedia, setExistingMedia] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Initialize form with post data
    useEffect(() => {
        if (post && isOpen) {
            setTitle(post.title || '');
            setContent(post.content || '');
            setSelectedCommunity(typeof post.communityId === 'string' ? post.communityId : post.communityId._id);
            setExistingMedia(post.media || []);
            setSelectedFiles([]);
            setError('');
        }
    }, [post, isOpen]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingMedia = (index: number) => {
        setExistingMedia(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Content is required');
            return;
        }

        if (!post) return;

        setLoading(true);
        setError('');

        try {
            const updatedPost = await updatePost(post._id, {
                title: title.trim(),
                content: content.trim(),
                media: selectedFiles
            });

            onPostUpdated(updatedPost);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTitle('');
        setContent('');
        setSelectedFiles([]);
        setExistingMedia([]);
        setError('');
        onClose();
    };

    if (!isOpen || !post) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Edit Post</h2>
                                <p className="text-sm text-gray-600">Update your story</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3"
                                >
                                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                    <p className="text-red-700 text-sm">{error}</p>
                                </motion.div>
                            )}

                            {/* Community (Read-only) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Community
                                </label>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <p className="text-gray-600">
                                        {communities.find(c => c._id === selectedCommunity)?.name || 'Unknown Community'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Community cannot be changed when editing
                                    </p>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Title (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Give your post a title..."
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                    maxLength={100}
                                />
                                <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Share your story *
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="What's on your mind? Share your experience, ask a question, or offer support..."
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                                    rows={6}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">{content.length} characters</p>
                            </div>

                            {/* Existing Media */}
                            {existingMedia.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Current Media
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {existingMedia.map((media, index) => (
                                            <div key={index} className="relative group">
                                                {media.type === 'image' ? (
                                                    <img
                                                        src={media.url}
                                                        alt="Existing media"
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <video
                                                        src={media.url}
                                                        className="w-full h-24 object-cover rounded-lg"
                                                        controls={false}
                                                    />
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingMedia(index)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Media Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Add New Media (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-pink-300 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="media-upload"
                                    />
                                    <label htmlFor="media-upload" className="cursor-pointer">
                                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-600 font-medium">Add photos or videos</p>
                                        <p className="text-gray-500 text-sm mt-1">Drag and drop or click to browse</p>
                                    </label>
                                </div>

                                {/* New File Previews */}
                                {selectedFiles.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">New files to upload:</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {selectedFiles.map((file, index) => (
                                                <div key={index} className="relative group">
                                                    {file.type.startsWith('image/') ? (
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt="Preview"
                                                            className="w-full h-24 object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <video
                                                            src={URL.createObjectURL(file)}
                                                            className="w-full h-24 object-cover rounded-lg"
                                                            controls={false}
                                                        />
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 p-6">
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !content.trim()}
                                    className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    <span>{loading ? 'Updating...' : 'Update Post'}</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditPostModal;
