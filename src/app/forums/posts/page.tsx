"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PostList from '@/components/PostList';
import { getCommunities, Community as CommunityType } from '@/lib/communities';
import { getProfile } from '@/lib/auth';
import { useAuthStatus } from '@/hooks/useAuthStatus';


interface User {
    _id: string;
    name: string;
    email: string;
}

const PostsPage: React.FC = () => {
    const router = useRouter();
    const authenticated = useAuthStatus();
    const [user, setUser] = useState<User | null>(null);
    const [communities, setCommunities] = useState<CommunityType[]>([]);
    const [loadingCommunities, setLoadingCommunities] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);

    // Get user data
    useEffect(() => {
        const getUserData = async () => {
            if (authenticated) {
                try {
                    const userData = await getProfile();
                    // Map auth user to local user format
                    const mappedUser: User = {
                        _id: userData.id,
                        name: userData.name,
                        email: userData.email
                    };
                    setUser(mappedUser);
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                    // Mock user data as fallback
                    const mockUser: User = {
                        _id: 'current_user_id',
                        name: 'Current User',
                        email: 'user@example.com'
                    };
                    setUser(mockUser);
                }
            }
            setAuthLoading(false);
        };

        getUserData();
    }, [authenticated]);

    // Fetch real communities data
    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const communityData = await getCommunities();
                setCommunities(communityData);
            } catch (error) {
                console.error('Failed to fetch communities:', error);
                // Fallback to mock data
                const mockCommunities: CommunityType[] = [
                    {
                        _id: '1',
                        name: 'PCOS Support',
                        slug: 'pcos-support',
                        description: 'Support and advice for managing PCOS',
                        createdBy: 'user1',
                        members: ['user1', 'user2', 'user3'],
                        postCount: 34,
                        messageCount: 156,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        _id: '2',
                        name: 'Pregnancy Journey',
                        slug: 'pregnancy-journey',
                        description: 'Share your pregnancy experiences',
                        createdBy: 'user1',
                        members: ['user1', 'user4', 'user5'],
                        postCount: 45,
                        messageCount: 189,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        _id: '3',
                        name: 'Mental Wellness',
                        slug: 'mental-wellness',
                        description: 'Mental health support and resources',
                        createdBy: 'user2',
                        members: ['user2', 'user3', 'user6'],
                        postCount: 28,
                        messageCount: 98,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        _id: '4',
                        name: 'Cycle Tracking',
                        slug: 'cycle-tracking',
                        description: 'Period tracking tips and experiences',
                        createdBy: 'user1',
                        members: ['user1', 'user2', 'user4'],
                        postCount: 22,
                        messageCount: 67,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ];
                setCommunities(mockCommunities);
            } finally {
                setLoadingCommunities(false);
            }
        };

        fetchCommunities();
    }, []);

    if (authLoading || loadingCommunities) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pink-50">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className=" backdrop-blur-sm  sticky top-0 z-40"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <motion.button
                                onClick={() => router.back()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </motion.button>

                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Community Posts</h1>
                                    <p className="text-sm text-gray-600">Share, connect, and inspire</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                                <Users className="h-4 w-4" />
                                <span>{communities.length} Communities</span>
                            </div>

                            {user && (
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                                        {user.name}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-3xl shadow-lg p-6 border border-pink-100 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <Users className="h-5 w-5 text-pink-500 mr-2" />
                                Communities
                            </h2>

                            <div className="space-y-3">
                                {communities.map((community) => (
                                    <div
                                        key={community._id}
                                        className="p-3 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-semibold">
                                                    {community.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate">
                                                    {community.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {community.members.length} members
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Wellness Tips */}
                            <div className="mt-8 p-4 bg-pink-50 rounded-2xl border border-pink-100">
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <Sparkles className="h-4 w-4 text-pink-500 mr-1" />
                                    Wellness Tip
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    💝 Your story has the power to heal and inspire others. Every shared experience creates a ripple of hope and connection.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3"
                    >
                        <PostList
                            communities={communities}
                            currentUserId={user?._id}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Floating Action Button for Mobile */}
            <div className="lg:hidden fixed bottom-6 right-6 z-50">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center"
                    onClick={() => {
                        // Trigger create post modal
                        const event = new CustomEvent('openCreatePost');
                        window.dispatchEvent(event);
                    }}
                >
                    <Sparkles className="h-6 w-6" />
                </motion.button>
            </div>
        </div>
    );
};

export default PostsPage;
