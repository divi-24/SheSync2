import { apiFetch } from './api';
import { io, Socket } from 'socket.io-client';

export interface GlobalMessage {
    _id: string;
    content: string;
    mediaUrl?: string;
    createdAt: string;
    updatedAt: string;
    isAnonymous: boolean;
    sender: {
        _id?: string;
        name: string;
        email: string | null;
    };
    displaySender?: {
        _id?: string;
        name: string;
        email: string | null;
    };
}

export interface GlobalMessageResponse {
    success: boolean;
    data?: GlobalMessage | GlobalMessage[];
    message?: string;
    error?: string;
}

export interface CreateGlobalMessageData {
    content: string;
    isAnonymous: boolean;
    mediaUrl?: string;
}

// WebSocket connection
let socket: Socket | null = null;

export const initializeGlobalChatSocket = (serverUrl: string = 'http://localhost:5000') => {
    if (!socket) {
        socket = io(serverUrl, {
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log('Connected to global chat socket');
            socket?.emit('joinGlobalChat');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from global chat socket');
        });
    }
    return socket;
};

export const getGlobalChatSocket = () => socket;

export const disconnectGlobalChatSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

// REST API functions
export async function getGlobalMessages(): Promise<GlobalMessage[]> {
    const { ok, body } = await apiFetch<GlobalMessageResponse>('/api/global/global-chat', {
        method: 'GET',
    });

    if (!ok || !body.success) {
        throw new Error(body?.message || 'Failed to fetch global messages');
    }

    return Array.isArray(body.data) ? body.data : [];
}

export async function createGlobalMessage(messageData: CreateGlobalMessageData): Promise<GlobalMessage> {
    const { ok, body } = await apiFetch<GlobalMessage>('/api/global/global-chat', {
        method: 'POST',
        body: JSON.stringify(messageData),
    });

    if (!ok) {
        throw new Error('Failed to create global message');
    }

    return body;
}

export async function updateGlobalMessage(messageId: string, content: string): Promise<GlobalMessage> {
    const { ok, body } = await apiFetch<GlobalMessageResponse>(`/api/global/global-chat/${messageId}`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
    });

    if (!ok || !body.success) {
        throw new Error(body?.message || 'Failed to update global message');
    }

    return body.data as GlobalMessage;
}

export async function deleteGlobalMessage(messageId: string): Promise<void> {
    const { ok, body } = await apiFetch<GlobalMessageResponse>(`/api/global/global-chat/${messageId}`, {
        method: 'DELETE',
    });

    if (!ok || !body.success) {
        throw new Error(body?.message || 'Failed to delete global message');
    }
}

export async function updateGlobalMessageAnonymity(
    messageId: string,
    isAnonymous: boolean
): Promise<GlobalMessage> {
    const { ok, body } = await apiFetch<GlobalMessageResponse>(
        `/api/global/global-chat/${messageId}/anonymous`,
        {
            method: 'PATCH',
            body: JSON.stringify({ isAnonymous }),
        }
    );

    if (!ok || !body.success) {
        throw new Error(body?.message || 'Failed to update message anonymity');
    }

    return body.data as GlobalMessage;
}

// WebSocket functions for real-time messaging
export const sendGlobalMessageViaSocket = (messageData: {
    sender: string;
    content: string;
    isAnonymous: boolean;
    mediaUrl?: string;
}) => {
    if (socket && socket.connected) {
        socket.emit('sendGlobalMessage', messageData);
    } else {
        throw new Error('Socket not connected');
    }
};

export const updateGlobalMessageViaSocket = (messageId: string, content: string, userId: string) => {
    if (socket && socket.connected) {
        socket.emit('updateGlobalMessage', { messageId, content, userId });
    } else {
        throw new Error('Socket not connected');
    }
};

export const deleteGlobalMessageViaSocket = (messageId: string, userId: string) => {
    if (socket && socket.connected) {
        socket.emit('deleteGlobalMessage', { messageId, userId });
    } else {
        throw new Error('Socket not connected');
    }
};

export const updateGlobalMessageAnonymityViaSocket = (
    messageId: string,
    isAnonymous: boolean,
    userId: string
) => {
    if (socket && socket.connected) {
        socket.emit('updateGlobalMessageAnonymity', { messageId, isAnonymous, userId });
    } else {
        throw new Error('Socket not connected');
    }
};

// Socket event listeners
export const onNewGlobalMessage = (callback: (message: GlobalMessage) => void) => {
    if (socket) {
        socket.on('newGlobalMessage', callback);
    }
};

export const onGlobalMessageUpdated = (callback: (message: GlobalMessage) => void) => {
    if (socket) {
        socket.on('globalMessageUpdated', callback);
    }
};

export const onGlobalMessageDeleted = (callback: (data: { messageId: string }) => void) => {
    if (socket) {
        socket.on('globalMessageDeleted', callback);
    }
};

export const onGlobalMessageAnonymityUpdated = (callback: (message: GlobalMessage) => void) => {
    if (socket) {
        socket.on('globalMessageAnonymityUpdated', callback);
    }
};

export const onGlobalMessageError = (callback: (error: { error: string }) => void) => {
    if (socket) {
        socket.on('globalMessageError', callback);
    }
};

// Cleanup function
export const removeGlobalChatListeners = () => {
    if (socket) {
        socket.off('newGlobalMessage');
        socket.off('globalMessageUpdated');
        socket.off('globalMessageDeleted');
        socket.off('globalMessageAnonymityUpdated');
        socket.off('globalMessageError');
    }
};
