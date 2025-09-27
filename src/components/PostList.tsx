/* eslint-disable */

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Filter,
    Search,
    Sparkles,
    Heart,
    MessageCircle,
    Users,
    RefreshCw,
    AlertCircle,
    Image as ImageIcon,
    Loader2
} from 'lucide-react';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import CommentsModal from './CommentsModal';
import EditPostModal from './EditPostModal';
import {
    getAllPosts,
    getPostsByCommunity,
    togglePostLike,
    deletePost,
    Post
} from '@/lib/posts';

interface Community {
    _id: string;
    name: string;
    description: string;
    members: string[];
}

interface PostListProps {
    communities: Community[];
    currentUserId?: string;
    selectedCommunityId?: string;
}

const PostList: React.FC<PostListProps> = ({
    communities,
    currentUserId,
    selectedCommunityId
}) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string>('');
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
    const [filterCommunity, setFilterCommunity] = useState(selectedCommunityId || '');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const limit = 10;

    // Load posts
    const loadPosts = async (pageNum: number = 1, isRefresh: boolean = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else if (pageNum === 1) {
                setLoading(true);
            }
            setError('');

            if (filterCommunity) {
                const response = await getPostsByCommunity(filterCommunity, pageNum, limit);

                if (pageNum === 1 || isRefresh) {
                    setPosts(response.posts);
                } else {
                    setPosts(prev => [...prev, ...response.posts]);
                }

                setHasMore(response.posts.length === limit);
            } else {
                const allPosts = await getAllPosts();

                // Client-side pagination for getAllPosts
                const startIndex = (pageNum - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedPosts = allPosts.slice(startIndex, endIndex);

                if (pageNum === 1 || isRefresh) {
                    setPosts(allPosts.slice(0, endIndex));
                } else {
                    setPosts(prev => [...prev, ...paginatedPosts]);
                }

                setHasMore(endIndex < allPosts.length);
            }

            setPage(pageNum);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load posts');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadPosts(1);
    }, [filterCommunity]);

    // Listen for create post event from floating button
    useEffect(() => {
        const handleOpenCreatePost = () => {
            setShowCreateModal(true);
        };

        window.addEventListener('openCreatePost', handleOpenCreatePost);
        return () => {
            window.removeEventListener('openCreatePost', handleOpenCreatePost);
        };
    }, []);

    // Handle like
    const handleLike = async (postId: string) => {
        try {
            await togglePostLike(postId);
            setPosts(prev => prev.map(post => {
                if (post._id === postId) {
                    const isLiked = post.likes.includes(currentUserId || '');
                    return {
                        ...post,
                        likes: isLiked
                            ? post.likes.filter(id => id !== currentUserId)
                            : [...post.likes, currentUserId || ''],
                        likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1
                    };
                }
                return post;
            }));
        } catch (err) {
            console.error('Failed to like post:', err);
        }
    };

    // Handle comment (open comments modal)
    const handleComment = (postId: string) => {
        setSelectedPostId(postId);
        setShowCommentsModal(true);
    };

    // Handle edit post
    const handleEdit = (postId: string) => {
        const post = posts.find(p => p._id === postId);
        if (post) {
            setEditingPost(post);
            setShowEditModal(true);
        }
    };

    // Handle delete post
    const handleDelete = async (postId: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(postId);
                setPosts(prev => prev.filter(post => post._id !== postId));
            } catch (err) {
                console.error('Failed to delete post:', err);
                alert('Failed to delete post. Please try again.');
            }
        }
    };

    // Handle post updated
    const handlePostUpdated = (updatedPost: Post) => {
        setPosts(prev => prev.map(post =>
            post._id === updatedPost._id ? updatedPost : post
        ));
        setShowEditModal(false);
        setEditingPost(null);
    };

    // Handle post creation
    const handlePostCreated = () => {
        loadPosts(1, true);
    };

    // Filter and sort posts
    const filteredAndSortedPosts = posts
        .filter(post =>
            !searchQuery ||
            post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'popular':
                    return b.likeCount - a.likeCount;
                default:
                    return 0;
            }
        });

    // Load more posts
    const loadMore = () => {
        if (!loading && hasMore) {
            loadPosts(page + 1);
        }
    };

    if (loading && posts.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="bg-white rounded-3xl shadow-lg p-6 border border-pink-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Community Posts</h1>
                                <p className="text-gray-600 text-sm">Share stories, get support, inspire others</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => loadPosts(1, true)}
                                disabled={refreshing}
                                className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
                            >
                                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                            </button>

                            <motion.button
                                onClick={() => setShowCreateModal(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg"
                            >
                                <Plus className="h-5 w-5" />
                                <span className="font-medium">Create Post</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all"
                            />
                        </div>

                        {/* Community Filter */}
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <select
                                value={filterCommunity}
                                onChange={(e) => setFilterCommunity(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all appearance-none bg-white"
                            >
                                <option value="">All Communities</option>
                                {communities.map(community => (
                                    <option key={community._id} value={community._id}>
                                        {community.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
                                className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all appearance-none bg-white"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3"
                >
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700">{error}</p>
                </motion.div>
            )}

            {/* Posts */}
            <div className="space-y-6">
                <AnimatePresence>
                    {filteredAndSortedPosts.length > 0 ? (
                        filteredAndSortedPosts.map((post, index) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <PostCard
                                    post={post}
                                    onLike={handleLike}
                                    onComment={handleComment}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    currentUserId={currentUserId}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ImageIcon className="h-12 w-12 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No posts found</h3>
                            <p className="text-gray-600 mb-6">
                                {searchQuery
                                    ? "Try adjusting your search terms"
                                    : filterCommunity
                                        ? "This community hasn't shared any posts yet"
                                        : "Be the first to share your story"}
                            </p>
                            <motion.button
                                onClick={() => setShowCreateModal(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg"
                            >
                                Create First Post
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Load More */}
            {hasMore && filteredAndSortedPosts.length > 0 && (
                <div className="text-center mt-8">
                    <motion.button
                        onClick={loadMore}
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white border-2 border-pink-200 text-purple-600 px-8 py-3 rounded-full hover:border-pink-300 hover:bg-pink-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <RefreshCw className="h-5 w-5" />
                        )}
                        <span>{loading ? 'Loading...' : 'Load More Posts'}</span>
                    </motion.button>
                </div>
            )}

            {/* Stats */}
            {filteredAndSortedPosts.length > 0 && (
                <div className="mt-8 bg-pink-50 rounded-3xl p-6 border border-pink-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="flex items-center justify-center mb-2">
                                <MessageCircle className="h-5 w-5 text-purple-500 mr-1" />
                                <span className="text-2xl font-bold text-purple-600">
                                    {filteredAndSortedPosts.reduce((sum, post) => sum + post.comments.length, 0)}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm">Total Comments</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center mb-2">
                                <Heart className="h-5 w-5 text-pink-500 mr-1" />
                                <span className="text-2xl font-bold text-pink-600">
                                    {filteredAndSortedPosts.reduce((sum, post) => sum + post.likeCount, 0)}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm">Total Likes</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center mb-2">
                                <Sparkles className="h-5 w-5 text-purple-500 mr-1" />
                                <span className="text-2xl font-bold text-purple-600">
                                    {filteredAndSortedPosts.length}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm">Posts Shown</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onPostCreated={handlePostCreated}
                communities={communities}
            />

            {/* Comments Modal */}
            <CommentsModal
                isOpen={showCommentsModal}
                onClose={() => setShowCommentsModal(false)}
                postId={selectedPostId}
                currentUserId={currentUserId}
            />

            {/* Edit Post Modal */}
            <EditPostModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingPost(null);
                }}
                onPostUpdated={handlePostUpdated}
                post={editingPost}
                communities={communities}
            />
        </div>
    );
};

export default PostList;
