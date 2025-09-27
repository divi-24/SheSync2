/* eslint-disable */

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Image as ImageIcon,
    Send,
    Heart,
    Smile,
    Globe,
    Lock,
    Users,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import { createPost, CreatePostData } from '@/lib/posts';

interface Community {
    _id: string;
    name: string;
    description: string;
    members: string[];
}

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated: () => void;
    communities: Community[];
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
    isOpen,
    onClose,
    onPostCreated,
    communities
}) => {
    const [formData, setFormData] = useState<{
        title: string;
        content: string;
        communityId: string;
        media: File[];
        visibility: 'public' | 'members';
    }>({
        title: '',
        content: '',
        communityId: '',
        media: [],
        visibility: 'public'
    });

    const [mediaPreview, setMediaPreview] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setFormData(prev => ({
                ...prev,
                media: [...prev.media, ...files].slice(0, 4) // Limit to 4 files
            }));

            // Create previews
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        setMediaPreview(prev => [...prev, e.target!.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeMedia = (index: number) => {
        setFormData(prev => ({
            ...prev,
            media: prev.media.filter((_, i) => i !== index)
        }));
        setMediaPreview(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (!formData.content.trim()) {
                throw new Error('Content is required');
            }
            if (!formData.communityId) {
                throw new Error('Please select a community');
            }

            const postData: CreatePostData = {
                title: formData.title.trim(),
                content: formData.content.trim(),
                communityId: formData.communityId,
                media: formData.media.length > 0 ? formData.media : undefined
            };

            await createPost(postData);

            // Reset form
            setFormData({
                title: '',
                content: '',
                communityId: '',
                media: [],
                visibility: 'public'
            });
            setMediaPreview([]);

            onPostCreated();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Share Your Story</h2>
                                    <p className="text-pink-100 text-sm">Connect, inspire, and support others</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                        {/* Error Display */}
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

                        {/* Community Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                <Users className="h-4 w-4 text-pink-500" />
                                <span>Choose Community</span>
                            </label>
                            <select
                                name="communityId"
                                value={formData.communityId}
                                onChange={handleInputChange}
                                className="w-full p-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all"
                                required
                            >
                                <option value="">Select a community...</option>
                                {communities.map(community => (
                                    <option key={community._id} value={community._id}>
                                        {community.name} ({community.members.length} members)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Title (Optional) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                <Heart className="h-4 w-4 text-pink-500" />
                                <span>Title (Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Give your post a meaningful title..."
                                className="w-full p-3 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all"
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                <Smile className="h-4 w-4 text-pink-500" />
                                <span>Share your thoughts</span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                placeholder="What's on your mind? Share your experience, ask for support, or offer encouragement..."
                                rows={6}
                                className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all resize-none"
                                required
                            />
                        </div>

                        {/* Media Upload */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                <ImageIcon className="h-4 w-4 text-pink-500" />
                                <span>Add Images/Videos (Optional)</span>
                            </label>

                            <div className="border-2 border-dashed border-pink-200 rounded-xl p-6 text-center hover:border-pink-300 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={handleMediaUpload}
                                    className="hidden"
                                    id="media-upload"
                                />
                                <label htmlFor="media-upload" className="cursor-pointer">
                                    <ImageIcon className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Click to upload images or videos</p>
                                    <p className="text-xs text-gray-400 mt-1">Up to 4 files, max 10MB each</p>
                                </label>
                            </div>

                            {/* Media Preview */}
                            {mediaPreview.length > 0 && (
                                <div className="grid grid-cols-2 gap-3">
                                    {mediaPreview.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeMedia(index)}
                                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Visibility */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-pink-500" />
                                <span>Visibility</span>
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="public"
                                        checked={formData.visibility === 'public'}
                                        onChange={handleInputChange}
                                        className="text-pink-500 focus:ring-pink-400"
                                    />
                                    <Globe className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-gray-700">Public</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="members"
                                        checked={formData.visibility === 'members'}
                                        onChange={handleInputChange}
                                        className="text-pink-500 focus:ring-pink-400"
                                    />
                                    <Lock className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm text-gray-700">Members Only</span>
                                </label>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            💝 Remember: Your story can inspire and heal others
                        </p>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <motion.button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.content.trim() || !formData.communityId}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                                <span>{isSubmitting ? 'Sharing...' : 'Share Post'}</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CreatePostModal;
