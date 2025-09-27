import { NextRequest, NextResponse } from 'next/server';

// GET /api/posts/community/[communityId] - Get posts by community
export async function GET(
    request: NextRequest,
    
) {
    try {
        const url = new URL(request.url);
        const communityId = url.pathname.split("/").pop();
        const page = parseInt(url.searchParams.get('page') || '1');
        // const limit = parseInt(url.searchParams.get('limit') || '10');

        // Mock filtered posts - in real app query database
        const mockCommunityPosts = [
            {
                _id: '1',
                title: 'Managing PCOS symptoms naturally',
                content: 'I wanted to share my journey with managing PCOS symptoms through diet and exercise.',
                author: {
                    _id: 'user1',
                    name: 'Sarah M.',
                    email: 'sarah@example.com'
                },
                communityId: {
                    _id: communityId,
                    name: 'PCOS Support'
                },
                media: [],
                likes: ['user2', 'user3'],
                likeCount: 2,
                comments: ['comment1', 'comment2'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        return NextResponse.json({
            success: true,
            data: mockCommunityPosts,
            pagination: {
                currentPage: page,
                totalPages: 1,
                totalPosts: mockCommunityPosts.length,
                hasNextPage: false,
                hasPrevPage: false
            }
        });
    } catch (error) {
        console.error('Error fetching community posts:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch community posts' },
            { status: 500 }
        );
    }
}
