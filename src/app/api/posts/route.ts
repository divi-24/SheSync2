import { NextRequest, NextResponse } from 'next/server';

// Mock data for posts
const mockPosts = [
    {
        _id: '1',
        title: 'Managing PCOS symptoms naturally',
        content: 'I wanted to share my journey with managing PCOS symptoms through diet and exercise. After struggling for years, I found that a combination of low-carb eating and regular yoga has made a huge difference in my energy levels and cycle regularity.',
        author: {
            _id: 'user1',
            name: 'Sarah M.',
            email: 'sarah@example.com'
        },
        communityId: {
            _id: '1',
            name: 'PCOS Support'
        },
        media: [
            {
                url: '/assets/SheAgent.jpeg',
                type: 'image' as 'image' | 'video'
            }
        ],
        likes: ['user2', 'user3'],
        likeCount: 2,
        comments: ['comment1', 'comment2'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        _id: '2',
        title: '',
        content: 'Today marks 6 months since I started tracking my cycle properly. The difference it has made in understanding my body is incredible! To anyone just starting - be patient with yourself. Every cycle teaches you something new. 💕',
        author: {
            _id: 'user2',
            name: 'Emma K.',
            email: 'emma@example.com'
        },
        communityId: {
            _id: '4',
            name: 'Cycle Tracking'
        },
        media: [],
        likes: ['user1', 'user3', 'user4'],
        likeCount: 3,
        comments: ['comment3'],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        _id: '3',
        title: 'First trimester anxiety',
        content: 'Is it normal to feel this anxious during the first trimester? I keep worrying about everything - what I eat, how I sleep, every little symptom. My partner is supportive but I feel like I need to connect with others who understand.',
        author: {
            _id: 'user3',
            name: 'Lisa R.',
            email: 'lisa@example.com'
        },
        communityId: {
            _id: '2',
            name: 'Pregnancy Journey'
        },
        media: [],
        likes: ['user1'],
        likeCount: 1,
        comments: ['comment4', 'comment5', 'comment6'],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
        _id: '4',
        title: 'Self-care Sunday routine',
        content: 'Sharing my Sunday self-care routine that has been a game-changer for my mental health:\n\n🌸 Morning meditation (15 mins)\n🛁 Relaxing bath with essential oils\n📚 Reading something inspiring\n🍵 Herbal tea and journaling\n🎨 Creative time (painting or crafting)\n\nWhat are your favorite self-care activities?',
        author: {
            _id: 'user4',
            name: 'Maya P.',
            email: 'maya@example.com'
        },
        communityId: {
            _id: '3',
            name: 'Mental Wellness'
        },
        media: [
            {
                url: '/assets/globalchat.png',
                type: 'image' as 'image' | 'video'
            }
        ],
        likes: ['user1', 'user2', 'user3', 'user5'],
        likeCount: 4,
        comments: ['comment7', 'comment8'],
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
        _id: '5',
        title: 'Period pain relief tips',
        content: 'After years of terrible period pain, here are the things that actually help me:\n\n• Heat therapy (heating pad is my bestie)\n• Gentle yoga and stretching\n• Magnesium supplements\n• Staying hydrated\n• Anti-inflammatory foods\n\nDoes anyone have other natural remedies that work?',
        author: {
            _id: 'user5',
            name: 'Zoe L.',
            email: 'zoe@example.com'
        },
        communityId: {
            _id: '4',
            name: 'Cycle Tracking'
        },
        media: [],
        likes: ['user2', 'user4'],
        likeCount: 2,
        comments: ['comment9'],
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    }
];

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');

        // Sort by creation date (newest first)
        const sortedPosts = [...mockPosts].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json({
            success: true,
            data: sortedPosts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(sortedPosts.length / limit),
                totalPosts: sortedPosts.length,
                hasNextPage: page * limit < sortedPosts.length,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const title = formData.get('title') as string || '';
        const content = formData.get('content') as string;
        const communityId = formData.get('communityId') as string;
        const mediaFiles = formData.getAll('media') as File[];

        // Validate required fields
        if (!content || !communityId) {
            return NextResponse.json(
                { success: false, error: 'Content and community are required' },
                { status: 400 }
            );
        }

        // Process media files (in real app, upload to storage service)
        const mediaUrls = mediaFiles.map((file, index) => ({
            url: `/uploads/${Date.now()}_${index}_${file.name}`, // Mock URL
            type: (file.type.startsWith('video/') ? 'video' : 'image') as 'image' | 'video'
        }));

        // Mock community lookup
        const communityMap: Record<string, string> = {
            '1': 'PCOS Support',
            '2': 'Pregnancy Journey',
            '3': 'Mental Wellness',
            '4': 'Cycle Tracking'
        };

        const newPost = {
            _id: `post_${Date.now()}`,
            title: title || '',
            content,
            author: {
                _id: 'current_user_id',
                name: 'Current User',
                email: 'user@example.com'
            },
            communityId: {
                _id: communityId,
                name: communityMap[communityId] || 'Unknown Community'
            },
            media: mediaUrls,
            likes: [],
            likeCount: 0,
            comments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // In real app, save to database
        mockPosts.unshift(newPost);

        return NextResponse.json({
            success: true,
            data: newPost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
