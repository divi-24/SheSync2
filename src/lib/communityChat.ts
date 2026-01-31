import { apiFetch } from './api';
import { io, Socket } from 'socket.io-client';

export interface CommunityMessage {
    _id: string;
    communityId: string;
    sender: {
        _id: string;
        name?: string;
        username?: string;
        email: string;
    } | null;
    content: string;
    isAnonymous: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CommunityMessageResponse {
    success: boolean;
    data?: CommunityMessage | CommunityMessage[];
    message?: string;
    error?: string;
}

export interface CreateCommunityMessageData {
    communityId: string;
    content: string;
    isAnonymous: boolean;
}

// WebSocket connection
let socket: Socket | null = null;
let connectionPromise: Promise<Socket> | null = null;

export const initializeCommunitySocket = (serverUrl: string = 'http://localhost:8000'): Promise<Socket> => {
    if (socket && socket.connected) {
        return Promise.resolve(socket);
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    connectionPromise = new Promise((resolve, reject) => {
        if (!socket) {
            socket = io(serverUrl, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
                timeout: 10000,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000
            });

            socket.on('connect', () => {
                console.log('Connected to community socket');
                resolve(socket!);
            });

            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                connectionPromise = null;
                reject(new Error('Failed to connect to server. Please check if the server is running.'));
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from community socket');
                connectionPromise = null;
            });

            socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        } else {
            resolve(socket);
        }
    });

    return connectionPromise;
};

export const getCommunitySocket = () => socket;

export const disconnectCommunitySocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        connectionPromise = null;
    }
};

// Join a specific community room
export const joinCommunityRoom = async (communityId: string) => {
    try {
        const connectedSocket = await initializeCommunitySocket();
        if (connectedSocket && connectedSocket.connected) {
            connectedSocket.emit('joinCommunity', communityId);
            console.log(`Joined community room: ${communityId}`);
        } else {
            throw new Error('Socket not connected');
        }
    } catch (error) {
        console.error('Error joining community room:', error);
        throw error;
    }
};

// REST API functions
export async function getCommunityMessages(communityId: string): Promise<CommunityMessage[]> {
    const { ok, body } = await apiFetch<CommunityMessageResponse>(`/api/messages/${communityId}`, {
        method: 'GET',
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to fetch community messages');
    }

    return Array.isArray(body.data) ? body.data : [];
}

export async function createCommunityMessage(messageData: CreateCommunityMessageData): Promise<CommunityMessage> {
    const { ok, body } = await apiFetch<CommunityMessageResponse>('/api/messages', {
        method: 'POST',
        body: JSON.stringify(messageData),
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to create community message');
    }

    return body.data as CommunityMessage;
}

export async function updateCommunityMessage(
    messageId: string,
    updates: { content?: string; isAnonymous?: boolean }
): Promise<CommunityMessage> {
    const { ok, body } = await apiFetch<CommunityMessageResponse>(`/api/messages/${messageId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to update community message');
    }

    return body.data as CommunityMessage;
}

export async function deleteCommunityMessage(messageId: string): Promise<void> {
    const { ok, body } = await apiFetch<CommunityMessageResponse>(`/api/messages/${messageId}`, {
        method: 'DELETE',
    });

    if (!ok || !body.success) {
        throw new Error(body?.error || 'Failed to delete community message');
    }
}

// WebSocket functions for real-time messaging
export const sendCommunityMessageViaSocket = async (messageData: {
    communityId: string;
    sender: string;
    content: string;
    isAnonymous: boolean;
}) => {
    try {
        const connectedSocket = await initializeCommunitySocket();
        if (connectedSocket && connectedSocket.connected) {
            connectedSocket.emit('sendMessage', messageData);
        } else {
            throw new Error('Socket not connected');
        }
    } catch (error) {
        console.error('Error sending message via socket:', error);
        throw error;
    }
};

// Update message via WebSocket
export const updateCommunityMessageViaSocket = async (messageData: {
    messageId: string;
    content?: string;
    isAnonymous?: boolean;
    userId: string;
    communityId: string;
}) => {
    try {
        const connectedSocket = await initializeCommunitySocket();
        if (connectedSocket && connectedSocket.connected) {
            connectedSocket.emit('updateMessage', messageData);
        } else {
            throw new Error('Socket not connected');
        }
    } catch (error) {
        console.error('Error updating message via socket:', error);
        throw error;
    }
};

// Delete message via WebSocket
export const deleteCommunityMessageViaSocket = async (messageData: {
    messageId: string;
    userId: string;
    communityId: string;
}) => {
    try {
        const connectedSocket = await initializeCommunitySocket();
        if (connectedSocket && connectedSocket.connected) {
            connectedSocket.emit('deleteMessage', messageData);
        } else {
            throw new Error('Socket not connected');
        }
    } catch (error) {
        console.error('Error deleting message via socket:', error);
        throw error;
    }
};

// Socket event listeners
export const onNewCommunityMessage = async (callback: (message: CommunityMessage) => void) => {
    try {
        const connectedSocket = await initializeCommunitySocket();
        if (connectedSocket) {
            connectedSocket.on('newMessage', callback);
        }
    } catch (error) {
        console.error('Error setting up message listener:', error);
    }
};

export const onCommunityMessageUpdated = async (callback: (message: CommunityMessage) => void) => {
    try {
        const connectedSocket = await initializeCommunitySocket();
        if (connectedSocket) {
            connectedSocket.on('messageUpdated', callback);
        }
    } catch (error) {
        console.error('Error setting up message update listener:', error);
    }
};

export const onCommunityMessageDeleted = async (callback: (data: { messageId: string }) => void) => {
    try {
        const connectedSocket = await initializeCommunitySocket();
        if (connectedSocket) {
            connectedSocket.on('messageDeleted', callback);
        }
    } catch (error) {
        console.error('Error setting up message delete listener:', error);
    }
};

export const onCommunityMessageError = async (callback: (error: { error: string }) => void) => {
    try {
        const connectedSocket = await initializeCommunitySocket();
        if (connectedSocket) {
            connectedSocket.on('messageError', callback);
        }
    } catch (error) {
        console.error('Error setting up error listener:', error);
    }
};

// Cleanup function
export const removeCommunityMessageListeners = () => {
    if (socket) {
        socket.off('newMessage');
        socket.off('messageUpdated');
        socket.off('messageDeleted');
        socket.off('messageError');
        console.log('Removed community message listeners');
    }
};

// Clean disconnect
export const cleanDisconnectCommunitySocket = () => {
    removeCommunityMessageListeners();
    disconnectCommunitySocket();
};
