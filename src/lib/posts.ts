import { apiFetch } from './api';

export interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        name: string;
        email: string;
    };
    communityId: {
        _id: string;
        name: string;
    };
    media: Array<{
        url: string;
        type: 'image' | 'video';
    }>;
    likes: string[];
    likeCount: number;
    comments: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CreatePostData {
    title: string;
    content: string;
    communityId?: string;
    media?: File[];
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PostResponse {
    success: boolean;
    data?: Post | Post[];
    message?: string;
    error?: string;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalPosts: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

// Create a new post
export const createPost = async (postData: CreatePostData): Promise<Post> => {
    const formData = new FormData();

    if (postData.title) {
        formData.append('title', postData.title);
    }
    formData.append('content', postData.content);
    if (postData.communityId) {
        formData.append('communityId', postData.communityId);
    }

    if (postData.media && postData.media.length > 0) {
        postData.media.forEach((file) => {
            formData.append('media', file);
        });
    }

    const { ok, body } = await apiFetch<PostResponse>('/api/posts', {
        method: 'POST',
        body: formData,
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to create post');
    }

    return body.data as Post;
};

// Get all posts
export const getAllPosts = async (): Promise<Post[]> => {
    const { ok, body } = await apiFetch<PostResponse>('/api/posts', {
        method: 'GET',
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to fetch posts');
    }

    return body.data as Post[];
};

// Get posts by community
export const getPostsByCommunity = async (
    communityId: string,
    page: number = 1,
    limit: number = 10
): Promise<{ posts: Post[]; pagination: PaginationInfo }> => {
    const { ok, body } = await apiFetch<PostResponse>(
        `/api/posts/community/${communityId}?page=${page}&limit=${limit}`,
        {
            method: 'GET',
        }
    );

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to fetch community posts');
    }

    return {
        posts: body.data as Post[],
        pagination: body.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalPosts: 0,
            hasNextPage: false,
            hasPrevPage: false
        }
    };
};

// Get single post
export const getPostById = async (postId: string): Promise<Post> => {
    const { ok, body } = await apiFetch<PostResponse>(`/api/posts/${postId}`, {
        method: 'GET',
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to fetch post');
    }

    return body.data as Post;
};

// Update post
export const updatePost = async (postId: string, updateData: Partial<CreatePostData>): Promise<Post> => {
    const { ok, body } = await apiFetch<PostResponse>(`/api/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to update post');
    }

    return body.data as Post;
};

// Delete post
export const deletePost = async (postId: string): Promise<void> => {
    const { ok, body } = await apiFetch<PostResponse>(`/api/posts/${postId}`, {
        method: 'DELETE',
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to delete post');
    }
};

// Toggle like on post
export const togglePostLike = async (postId: string): Promise<{ likes: number; liked: boolean }> => {
    const { ok, body } = await apiFetch<{ success: boolean; data: { likes: number; liked: boolean } }>(
        `/api/posts/${postId}/like`,
        {
            method: 'POST',
        }
    );

    if (!ok || !body.success) {
        throw new Error('Failed to toggle like');
    }

    return body.data;
};

// ================= COMMENT FUNCTIONS =================

export interface Comment {
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

// Get comments for a post
export const getCommentsByPost = async (postId: string): Promise<Comment[]> => {
    const { ok, body } = await apiFetch<{ success: boolean; data: Comment[] }>(
        `/api/posts/${postId}/comments`,
        {
            method: 'GET',
        }
    );

    if (!ok || !body.success) {
        throw new Error('Failed to fetch comments');
    }

    return body.data;
};

// Add comment to post
export const addComment = async (postId: string, content: string): Promise<Comment> => {
    const { ok, body } = await apiFetch<{ success: boolean; data: Comment }>(
        `/api/posts/${postId}/comments`,
        {
            method: 'POST',
            body: JSON.stringify({ content }),
        }
    );

    if (!ok || !body.success) {
        throw new Error('Failed to add comment');
    }

    return body.data;
};

// Update comment
export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
    const { ok, body } = await apiFetch<{ success: boolean; data: Comment }>(
        `/api/posts/comments/${commentId}`,
        {
            method: 'PUT',
            body: JSON.stringify({ content }),
        }
    );

    if (!ok || !body.success) {
        throw new Error('Failed to update comment');
    }

    return body.data;
};

// Delete comment
export const deleteComment = async (commentId: string): Promise<void> => {
    const { ok, body } = await apiFetch<{ success: boolean }>(
        `/api/posts/comments/${commentId}`,
        {
            method: 'DELETE',
        }
    );

    if (!ok || !body.success) {
        throw new Error('Failed to delete comment');
    }
};

// Toggle like on comment
export const toggleCommentLike = async (commentId: string): Promise<{ likes: number; liked: boolean }> => {
    const { ok, body } = await apiFetch<{ success: boolean; data: { likes: number; liked: boolean } }>(
        `/api/posts/comments/${commentId}/like`,
        {
            method: 'POST',
        }
    );

    if (!ok || !body.success) {
        throw new Error('Failed to toggle comment like');
    }

    return body.data;
};
