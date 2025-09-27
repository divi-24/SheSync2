import { apiFetch } from './api';

export interface Community {
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
}

export interface CommunityResponse {
    success: boolean;
    data?: Community | Community[];
    message?: string;
    error?: string;
    count?: number;
}

export interface JoinLeaveResponse {
    success: boolean;
    message: string;
    data?: {
        communityId: string;
        membersCount: number;
    };
    error?: string;
}

// Get all communities
export async function getCommunities(): Promise<Community[]> {
    const { ok, body } = await apiFetch<CommunityResponse>('/api/communities', {
        method: 'GET',
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to fetch communities');
    }

    return Array.isArray(body.data) ? body.data : [];
}

// Get single community
export async function getCommunity(id: string): Promise<Community> {
    const { ok, body } = await apiFetch<CommunityResponse>(`/api/communities/${id}`, {
        method: 'GET',
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to fetch community');
    }

    return body.data as Community;
}

// Create a new community
export async function createCommunity(name: string, description: string): Promise<Community> {
    const { ok, body } = await apiFetch<CommunityResponse>('/api/communities', {
        method: 'POST',
        body: JSON.stringify({ name, description }),
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to create community');
    }

    return body.data as Community;
}

// Join a community
export async function joinCommunity(communityId: string): Promise<JoinLeaveResponse> {
    const { ok, body } = await apiFetch<JoinLeaveResponse>(`/api/communities/join/${communityId}`, {
        method: 'POST',
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to join community');
    }

    return body;
}

// Leave a community
export async function leaveCommunity(communityId: string): Promise<JoinLeaveResponse> {
    const { ok, body } = await apiFetch<JoinLeaveResponse>(`/api/communities/leave/${communityId}`, {
        method: 'POST',
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to leave community');
    }

    return body;
}
