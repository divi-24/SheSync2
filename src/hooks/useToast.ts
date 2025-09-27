"use client";
import { useState, useCallback } from 'react';

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning';
    message: string;
    duration?: number;
}

export const useToast = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };

        setToasts(prev => [...prev, newToast]);

        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message: string, duration?: number) => {
        return addToast({ type: 'success', message, duration });
    }, [addToast]);

    const error = useCallback((message: string, duration?: number) => {
        return addToast({ type: 'error', message, duration });
    }, [addToast]);

    const warning = useCallback((message: string, duration?: number) => {
        return addToast({ type: 'warning', message, duration });
    }, [addToast]);

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
    };
};