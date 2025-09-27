/* eslint-disable */

"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "next/font/google";

const cookie = Cookie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cookie'
});
import {
    Users,
    MessageSquare,
    TrendingUp,
    Bookmark,
    Bell,
    CheckCircle,
    AlertCircle,
    User,
    XCircle,
    Flame,
    Star,
    Trophy,
    Flower,
    Dumbbell,
    Brain,
    Baby,
    BookOpen,
    Shield,
    Mail,
    Lock,
    HelpCircle,
    Search,
    Image as ImageIcon,
    PlusCircle,

} from "lucide-react";
import CommunityChat from "./CommunityChat";
import { getCommunities, joinCommunity, leaveCommunity, Community } from "@/lib/communities";
import { getProfile } from '@/lib/auth';
import { useAuthStatus } from '@/hooks/useAuthStatus';

interface User {
    _id: string;
    name: string;
    email: string;
}


const postTags = [
    "PCOS",
    "Menstruation",
    "Hormones",
    "Wellness",
    "Diet",
    "Exercise",
    "Mental Health",
    "Support",
    "Q&A",
    "Experience",
    "Tips",
    "Research",
];

// Add reaction types with emojis and labels
// const reactionTypes = [
//     { emoji: "👍", label: "Helpful", count: 0 },
//     { emoji: "❤️", label: "Support", count: 0 },
//     { emoji: "🤗", label: "Hug", count: 0 },
//     { emoji: "💡", label: "Insightful", count: 0 },
//     { emoji: "🙏", label: "Thanks", count: 0 },
// ];

// Update CreatePost component to receive forumCategories as a prop
type ForumCategory = {
    _id: string;
    name: string;
    slug: string;
    description: string;
    createdBy: string;
    members: string[];
    postCount: number;
    messageCount: number;
    createdAt: string;
    updatedAt: string;
    icon?: React.ReactNode;
    color?: string;
};

// type CreatePostProps = {
//     isOpen: boolean;
//     onClose: () => void;
//     onSubmit: (formData: any) => Promise<void>;
//     forumCategories: ForumCategory[];
// };

// const CreatePost: React.FC<CreatePostProps> = ({ isOpen, onClose, onSubmit, forumCategories }) => {
//     const [formData, setFormData] = useState<{
//         title: string;
//         content: string;
//         category: string;
//         tags: string[];
//         visibility: string;
//         image: string | null;
//     }>({
//         title: "",
//         content: "",
//         category: "",
//         tags: [],
//         visibility: "public",
//         image: null,
//     });
//     const [error, setError] = useState("");
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);

//     interface ChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> { }

//     const handleChange = (e: ChangeEvent) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     interface HandleTagToggle {
//         (tag: string): void;
//     }

//     const handleTagToggle: HandleTagToggle = (tag) => {
//         setFormData((prev) => ({
//             ...prev,
//             tags: prev.tags.includes(tag)
//                 ? prev.tags.filter((t: string) => t !== tag)
//                 : [...prev.tags, tag],
//         }));
//     };

//     interface ImageUploadEvent extends React.ChangeEvent<HTMLInputElement> { }

//     const handleImageUpload = (e: ImageUploadEvent) => {
//         const file: File | undefined = e.target.files?.[0];
//         if (file) {
//             const reader: FileReader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreview(reader.result);
//                 setFormData((prev) => ({
//                     ...prev,
//                     image: typeof reader.result === "string" ? reader.result : null,
//                 }));
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     interface SubmitEvent extends React.FormEvent<HTMLFormElement> { }

//     interface SubmitError extends Error {
//         message: string;
//     }

//     const handleSubmit = async (e: SubmitEvent) => {
//         e.preventDefault();
//         setError("");
//         setIsSubmitting(true);

//         try {
//             if (
//                 !formData.title.trim() ||
//                 !formData.content.trim() ||
//                 !formData.category
//             ) {
//                 throw new Error("Please fill in all required fields");
//             }

//             await onSubmit(formData);
//             onClose();
//         } catch (err) {
//             setError((err as SubmitError).message);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4"
//             onClick={(e) => {
//                 if (e.target === e.currentTarget) {
//                     onClose();
//                 }
//             }}
//         >
//             <motion.div
//                 initial={{ scale: 0.95 }}
//                 animate={{ scale: 1 }}
//                 className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="flex justify-between items-center mb-6">
//                         <h3 className="text-2xl font-semibold text-gray-800">
//                             Create New Post
//                         </h3>
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="text-gray-400 hover:text-gray-600 transition-colors"
//                         >
//                             <XCircle className="h-6 w-6" />
//                         </button>
//                     </div>

//                     {error && (
//                         <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
//                             {error}
//                         </div>
//                     )}

//                     <input
//                         type="text"
//                         name="title"
//                         placeholder="Post Title"
//                         value={formData.title}
//                         onChange={handleChange}
//                         className="w-full p-3 border border-pink-100 rounded-xl
//                      bg-white text-gray-700
//                      placeholder-gray-400
//                      focus:ring-2 focus:ring-pink-200 focus:border-transparent
//                      transition-all duration-200"
//                         required
//                     />

//                     <select
//                         name="category"
//                         value={formData.category}
//                         onChange={handleChange}
//                         className="w-full p-3 border border-pink-100 rounded-xl
//                      bg-white text-gray-700
//                      focus:ring-2 focus:ring-pink-200 focus:border-transparent
//                      transition-all duration-200"
//                         required
//                     >
//                         <option value="" className="text-gray-400">
//                             Select Category
//                         </option>
//                         {forumCategories.map((category: ForumCategory) => (
//                             <option
//                                 key={category._id}
//                                 value={category.name}
//                                 className="text-gray-700"
//                             >
//                                 {category.name}
//                             </option>
//                         ))}
//                     </select>

//                     <div className="flex flex-wrap gap-2">
//                         {postTags.map((tag) => (
//                             <button
//                                 type="button"
//                                 key={tag}
//                                 onClick={() => handleTagToggle(tag)}
//                                 className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
//                   ${formData.tags.includes(tag)
//                                         ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
//                                         : "bg-gray-50 text-gray-600 hover:bg-gray-100"
//                                     }`}
//                             >
//                                 #{tag}
//                             </button>
//                         ))}
//                     </div>

//                     <div className="flex space-x-3">
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 const input = document.getElementById("image-upload");
//                                 if (input) input.click();
//                             }}
//                             className="flex items-center space-x-2 px-4 py-2 rounded-xl
//                        bg-pink-50 hover:bg-pink-100
//                        text-pink-600 transition-all duration-200"
//                         >
//                             <ImageIcon className="h-5 w-5" />
//                             <span>Add Image</span>
//                         </button>
//                         <input
//                             id="image-upload"
//                             type="file"
//                             accept="image/*"
//                             className="hidden"
//                             onChange={handleImageUpload}
//                         />
//                         <select
//                             name="visibility"
//                             value={formData.visibility}
//                             onChange={handleChange}
//                             className="px-4 py-2 rounded-xl
//                        bg-pink-50 text-pink-600
//                        border border-pink-100
//                        focus:ring-2 focus:ring-pink-200 focus:border-transparent
//                        transition-all duration-200"
//                         >
//                             <option value="public" className="text-gray-700 bg-white">
//                                 Public
//                             </option>
//                             <option value="private" className="text-gray-700 bg-white">
//                                 Private
//                             </option>
//                             <option value="anonymous" className="text-gray-700 bg-white">
//                                 Anonymous
//                             </option>
//                         </select>
//                     </div>

//                     {imagePreview && (
//                         <div className="relative w-full h-48">
//                             <img
//                                 src={typeof imagePreview === "string" ? imagePreview : undefined}
//                                 alt="Preview"
//                                 className="w-full h-full object-cover rounded-xl"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     setImagePreview(null);
//                                     setFormData((prev) => ({ ...prev, image: null }));
//                                 }}
//                                 className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white
//                              text-gray-600 rounded-full transition-all duration-200"
//                             >
//                                 X
//                             </button>
//                         </div>
//                     )}

//                     <textarea
//                         name="content"
//                         placeholder="Write your post content..."
//                         value={formData.content}
//                         onChange={handleChange}
//                         className="w-full p-4 min-h-[200px] border border-pink-100 rounded-xl
//                      bg-white text-gray-700
//                      placeholder-gray-400
//                      focus:ring-2 focus:ring-pink-200 focus:border-transparent
//                      transition-all duration-200
//                      resize-none"
//                         required
//                     />

//                     <div className="flex justify-end space-x-3 mt-6">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-6 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100
//                        text-gray-600 font-medium
//                        transition-all duration-200"
//                             disabled={isSubmitting}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="px-6 py-2.5 rounded-xl bg-pink-400
//                        text-white font-medium shadow-sm
//                        hover:shadow-md hover:scale-[1.02]
//                        transition-all duration-200 disabled:opacity-50
//                        flex items-center space-x-2"
//                         >
//                             {isSubmitting ? (
//                                 <>
//                                     <span className="animate-spin">⌛</span>
//                                     <span>Posting...</span>
//                                 </>
//                             ) : (
//                                 <>
//                                     <PlusCircle className="h-5 w-5" />
//                                     <span>Post</span>
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </motion.div>
//         </motion.div>
//     );
// };

export default function Forum() {
    const navigate = useRouter();
    const [activeTab, setActiveTab] = useState("communities");
    const [searchTerm, setSearchTerm] = useState("");
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Welcome to SheSync Forums!", read: false },
        { id: 2, text: "3 new communities joined this week", read: false },
    ]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [filterBy, setFilterBy] = useState("all");
    const [selectedCommunity, setSelectedCommunity] = useState<ForumCategory | null>(null);
    const [showCommunityChat, setShowCommunityChat] = useState(false);
        const authenticated = useAuthStatus();
        const [user, setUser] = useState<User | null>(null);

    // Communities state
    const [communities, setCommunities] = useState<ForumCategory[]>([]);
    const [loadingCommunities, setLoadingCommunities] = useState(true);
    const [communityError, setCommunityError] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [joiningCommunities, setJoiningCommunities] = useState<Set<string>>(new Set());
        const [authLoading, setAuthLoading] = useState(true);
        // console.log("Authenticated:", authLoading);

    // Icon mapping for different community types
    const getIconForCommunity = (name: string) => {
        const nameNormalized = name.toLowerCase();
        if (nameNormalized.includes("health") || nameNormalized.includes("women")) return <Flower className="h-5 w-5 text-pink-500" />;
        if (nameNormalized.includes("fitness") || nameNormalized.includes("nutrition")) return <Dumbbell className="h-5 w-5 text-purple-500" />;
        if (nameNormalized.includes("mental") || nameNormalized.includes("wellness")) return <Brain className="h-5 w-5 text-blue-500" />;
        if (nameNormalized.includes("reproductive") || nameNormalized.includes("baby")) return <Baby className="h-5 w-5 text-green-500" />;
        if (nameNormalized.includes("sexual") || nameNormalized.includes("sex")) return <Shield className="h-5 w-5 text-red-500" />;
        if (nameNormalized.includes("menopause") || nameNormalized.includes("support")) return <BookOpen className="h-5 w-5 text-yellow-500" />;
        return <Users className="h-5 w-5 text-pink-500" />; // Default icon
    };
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

    // Fetch communities on component mount
    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                setLoadingCommunities(true);
                setCommunityError("");

                const [communitiesData, userProfile] = await Promise.all([
                    getCommunities(),
                    getProfile().catch(() => null) // Don't fail if user not authenticated
                ]);

                // Transform API data to match component structure
                const transformedCommunities = communitiesData.map(community => ({
                    ...community,
                    icon: getIconForCommunity(community.name),
                    color: "bg-white-100"
                }));

                setCommunities(transformedCommunities);
                setCurrentUser(userProfile);
            } catch (error) {
                console.error("Error fetching communities:", error);
                setCommunityError(error instanceof Error ? error.message : "Failed to load communities");
            } finally {
                setLoadingCommunities(false);
            }
        };

        fetchCommunities();
    }, []);

    // Handle joining a community
    const handleJoinCommunity = async (communityId: string) => {
        if (!currentUser) {
            alert("Please log in to join communities");
            return;
        }

        try {
            setJoiningCommunities(prev => new Set(prev).add(communityId));
            await joinCommunity(communityId);

            // Update local state to reflect the join
            setCommunities(prev => prev.map(community =>
                community._id === communityId
                    ? { ...community, members: [...community.members, currentUser.id] }
                    : community
            ));
        } catch (error) {
            console.error("Error joining community:", error);
            alert(error instanceof Error ? error.message : "Failed to join community");
        } finally {
            setJoiningCommunities(prev => {
                const newSet = new Set(prev);
                newSet.delete(communityId);
                return newSet;
            });
        }
    };

    // Handle leaving a community
    const handleLeaveCommunity = async (communityId: string) => {
        if (!currentUser) return;

        try {
            setJoiningCommunities(prev => new Set(prev).add(communityId));
            await leaveCommunity(communityId);

            // Update local state to reflect the leave
            setCommunities(prev => prev.map(community =>
                community._id === communityId
                    ? { ...community, members: community.members.filter(id => id !== currentUser.id) }
                    : community
            ));
        } catch (error) {
            console.error("Error leaving community:", error);
            alert(error instanceof Error ? error.message : "Failed to leave community");
        } finally {
            setJoiningCommunities(prev => {
                const newSet = new Set(prev);
                newSet.delete(communityId);
                return newSet;
            });
        }
    };

    // Check if user is member of a community
    const isUserMember = (community: ForumCategory) => {
        return currentUser && community.members.includes(currentUser.id);
    };



    // interface SearchEvent extends React.ChangeEvent<HTMLInputElement> { }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    const markNotificationRead = (id: number) => {
        setNotifications((notifications) =>
            notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    // const trendingTopics = [
    //     { title: "Menstrual Health", icon: <Flame className="h-4 w-4" />, discussions: 234 },
    //     { title: "Hormone Balance", icon: <Star className="h-4 w-4" />, discussions: 189 },
    //     { title: "PCOS Support", icon: <Trophy className="h-4 w-4" />, discussions: 156 },
    //     { title: "Fertility Tracking", icon: <TrendingUp className="h-4 w-4" />, discussions: 142 },
    //     { title: "Mental Wellness", icon: <HelpCircle className="h-4 w-4" />, discussions: 128 },
    // ];

const filteredForums = communities.filter((forum: ForumCategory) => {
    // Filter by search term (case-insensitive) and filterBy
    const matchesSearch =
        forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        forum.description.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    if (filterBy === "large") matchesFilter = forum.members.length > 10;
    if (filterBy === "active") matchesFilter = forum.postCount > 50;
    return matchesSearch && matchesFilter;
});


    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const ProfileMenu = () => (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 z-10 w-52 rounded-xl shadow-lg py-1 bg-pink-600 text-white border border-pink-700"
        >
            <button className="flex items-center w-full px-4 py-2 hover:bg-pink-500 transition-all duration-200">
                <User className="mr-3 h-5 w-5" /> Profile
            </button>
            <button className="flex items-center w-full px-4 py-2 hover:bg-pink-500 transition-all duration-200">
                <Bookmark className="mr-3 h-5 w-5" /> Bookmarks
            </button>
            <button className="flex items-center w-full px-4 py-2 hover:bg-pink-500 transition-all duration-200">
                <CheckCircle className="mr-3 h-5 w-5" /> My Solutions
            </button>
            <button className="flex items-center w-full px-4 py-2 hover:bg-pink-500 transition-all duration-200">
                <Mail className="mr-3 h-5 w-5" /> Messages
            </button>
            <button className="flex items-center w-full px-4 py-2 hover:bg-pink-500 transition-all duration-200">
                <Lock className="mr-3 h-5 w-5" /> Privacy Settings
            </button>
            <button className="flex items-center w-full px-4 py-2 hover:bg-pink-700 transition-all duration-200">
                <XCircle className="mr-3 h-5 w-5" /> Logout
            </button>
        </motion.div>
    );


    return (
        <motion.div
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`flex min-h-screen justify-center items-center mx-auto bg-gradient-to-br from-pink-50 via-white to-pink-100`}
        >
            <main
            className={`flex-1 p-6 overflow-auto transition-all duration-300 ease-in-out`}
            >
            <motion.div
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-6xl mx-auto space-y-8"
            >
                <div className="flex justify-center items-center  flex-col md:flex-row ">
                <div>
                    <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                    Forums : <span className={`${cookie.className} text-5xl text-gray-700`}>Connect and Share</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 text-lg">
                    Join communities, share experiences, and connect with others on women's health, wellness, and support topics.
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    {/* Navigation Tabs */}
                    <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex items-center space-x-2 bg-pink-50 rounded-xl p-1"
                    >
                    <button
                        onClick={() => setActiveTab("communities")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "communities"
                        ? "bg-pink-600 text-white shadow-sm"
                        : "text-pink-600 hover:bg-pink-100"
                        }`}
                    >
                        Communities
                    </button>
                    <button
                        onClick={() => navigate.push('/forums/posts')}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-pink-600 hover:bg-pink-100 transition-all"
                    >
                        Posts
                    </button>
                    <button
                        onClick={() => navigate.push('/forums/globalchat')}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-pink-600 hover:bg-pink-100 transition-all"
                    >
                        Global Chat
                    </button>
                    </motion.div>
                    <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 transition-colors"
                    >
                        <Bell className="h-6 w-6" />
                        {notifications.some((n) => !n.read) && (
                        <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full ring-2 ring-white dark:ring-zinc-800" />
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                            transition={{ duration: 0.3 }}
                            className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white text-zinc-800 dark:bg-zinc-800 dark:text-white border border-zinc-200 dark:border-zinc-700 z-10 backdrop-blur-md bg-opacity-80"
                        >
                            <div className="px-4 py-2 font-semibold border-b border-zinc-200 dark:border-zinc-700">
                            Notifications
                            </div>

                            {notifications.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-center text-zinc-500 dark:text-zinc-400">
                                No new notifications
                            </div>
                            ) : (
                            notifications.map((notification) => (
                                <div
                                key={notification.id}
                                className={`px-4 py-3 text-sm flex items-center justify-between ${!notification.read
                                    ? "bg-pink-50 dark:bg-zinc-700"
                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-700"
                                    }`}
                                >
                                <span className="text-sm text-zinc-700 dark:text-zinc-200">
                                    {notification.text}
                                </span>
                                {!notification.read && (
                                    <button
                                    onClick={() => markNotificationRead(notification.id)}
                                    className="ml-2 px-3 py-1 text-xs font-medium rounded bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-600 dark:hover:bg-zinc-500 dark:text-white text-zinc-800 transition"
                                    >
                                    Mark read
                                    </button>
                                )}
                                </div>
                            ))
                            )}
                        </motion.div>
                        )}
                    </AnimatePresence>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center p-1 rounded-full border-2 border-pink-400 bg-white dark:bg-zinc-800 hover:border-pink-500 transition-all"
                        >
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
                        </button>
                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute right-0 z-[9999]"
                                >
                                    <ProfileMenu />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                </div>

                <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
                >
     

                <div className="flex justify-center items-center ">
                    <div className="relative">
                    <Search className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-700" size={20} />

                    </div>
                    <input
                        type="text"
                        placeholder="Search Communities"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-10 z-0 pr-4 py-2 w-full rounded-full bg-white dark:bg-zinc-900 border border-pink-200 dark:border-zinc-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                    />
                   
                </div>
                </motion.div>

                {/* Communities Section */}
                {loadingCommunities ? (
                <motion.div
                    initial={{ opacity: 1, scale: 0.95, filter: "blur(0px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.4 }}
                    className="flex justify-center items-center py-12"
                >
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Loading communities...</span>
                </motion.div>
                ) : communityError ? (
                <motion.div
                    initial={{ opacity: 1, y: 20, filter: "blur(0px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.4 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center"
                >
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                    <p className="text-red-700 dark:text-red-300 font-medium">{communityError}</p>
                    <button
                    onClick={() => window.location.reload()}
                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                    Retry
                    </button>
                </motion.div>
                ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    {filteredForums.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.4 }}
                        className="col-span-full text-center py-12"
                    >
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
                        No communities found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500">
                        Try adjusting your search or filter criteria.
                        </p>
                    </motion.div>
                    ) : (
                    filteredForums.map((forum: ForumCategory, idx) => (
                        <motion.div
                        key={forum._id}
                        variants={cardVariants}
                        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ delay: idx * 0.07, duration: 0.4 }}
                        className={`${forum.color} dark:bg-gray-800 text-black p-6 rounded-xl shadow-md hover:shadow-lg transition-all backdrop-blur-md bg-opacity-90 z-0`}
                        >
                        <div className="flex items-center mb-4">
                            <div className="p-2 bg-white rounded-lg">{forum.icon}</div>
                            <h3 className="text-xl font-semibold ml-3 dark:text-gray-100">
                            {forum.name}
                            </h3>
                        </div>
                        <div className="flex justify-between text-sm dark:text-gray-400 mb-4">
                            <span className="flex items-center">
                            <Users className="mr-1" />{" "}
                            {forum.members.length.toLocaleString()} members
                            </span>
                            <span className="flex items-center">
                            <MessageSquare className="mr-1" />{" "}
                            {forum.postCount.toLocaleString()} posts
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <button
                            onClick={() => {
                                setSelectedCommunity(forum);
                                setShowCommunityChat(true);
                            }}
                            className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
                            >
                            View Forum
                            </button>
                            {currentUser && (
                            <button
                                onClick={() => {
                                if (isUserMember(forum)) {
                                    handleLeaveCommunity(forum._id);
                                } else {
                                    handleJoinCommunity(forum._id);
                                }
                                }}
                                disabled={joiningCommunities.has(forum._id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${isUserMember(forum)
                                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                : "bg-pink-500 text-white hover:bg-pink-600"
                                } disabled:opacity-50`}
                            >
                                {joiningCommunities.has(forum._id)
                                ? "..."
                                : isUserMember(forum)
                                    ? "Leave"
                                    : "Join"
                                }
                            </button>
                            )}
                        </div>
                        </motion.div>
                    ))
                    )}
                </motion.div>
                )}
                </motion.div>

          
            </main>

            <AnimatePresence>
            {showCommunityChat && selectedCommunity && (
                <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md"
                >
                <CommunityChat
                    isOpen={showCommunityChat}
                    onClose={() => setShowCommunityChat(false)}
                    community={selectedCommunity}
                />
                </motion.div>
            )}
            </AnimatePresence>
        </motion.div>
    );
}


