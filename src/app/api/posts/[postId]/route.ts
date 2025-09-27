import { NextRequest, NextResponse } from 'next/server';

interface Post {
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

// Mock posts data - in real app this would come from database
const mockPosts: Post[] = [];

// GET /api/posts/[postId] - Get single post
export async function GET(
    request: NextRequest
) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split("/").pop();

        const post = mockPosts.find(p => p._id === id);

        if (!post) {
            return NextResponse.json(
                { success: false, error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
}

// PUT /api/posts/[postId] - Update post
export async function PUT(
    request: NextRequest
) {
    try {
        const url = new URL(request.url);
        const postId = url.pathname.split("/").pop();
        const { title, content } = await request.json();

        const postIndex = mockPosts.findIndex(p => p._id === postId);

        if (postIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Post not found' },
                { status: 404 }
            );
        }

        // Update post
        mockPosts[postIndex] = {
            ...mockPosts[postIndex],
            title: title || mockPosts[postIndex].title,
            content: content || mockPosts[postIndex].content,
            updatedAt: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            data: mockPosts[postIndex]
        });
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update post' },
            { status: 500 }
        );
    }
}

// DELETE /api/posts/[postId] - Delete post
export async function DELETE(
    request: NextRequest,

) {
    try {
        const url = new URL(request.url);
        const postId = url.pathname.split("/").pop();

        const postIndex = mockPosts.findIndex(p => p._id === postId);

        if (postIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Post not found' },
                { status: 404 }
            );
        }

        // Remove post
        mockPosts.splice(postIndex, 1);

        return NextResponse.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}