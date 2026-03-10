// =====================================================================
// CHANGE: Replaced ALL hardcoded mock notification data with real API calls
// This context now fetches notifications from the backend, marks them as
// read via API, and provides real-time unread count to the entire app
// =====================================================================
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import ApiService from '@/services/data/crud/crud'; // CHANGE: Import API service for backend calls
import { APIDetails } from '@/services/data/constants/ApiDetails'; // CHANGE: Import API endpoint definitions
import Cookies from 'js-cookie'; // CHANGE: Import to check if user is logged in
import { cookieParams } from '@/constants/ECookieParams'; // CHANGE: Import cookie param names

// CHANGE: Updated interface to match backend schema (added _id, type, createdAt)
export interface NotificationItem {
    _id: string; // CHANGE: MongoDB document ID (was previously 'id: number')
    userId: string; // CHANGE: Added userId field from backend
    message: string;
    name: string;
    type: string; // CHANGE: Added notification type field
    isRead: boolean;
    createdAt: string; // CHANGE: Added createdAt timestamp from backend
    updatedAt: string; // CHANGE: Added updatedAt timestamp from backend
}

interface NotificationContextProps {
    notifications: NotificationItem[];
    unreadCount: number;
    markAsRead: (id: string) => void; // CHANGE: Changed id type from number to string (MongoDB ObjectId)
    markAllAsRead: () => void;
    fetchNotifications: () => void; // CHANGE: Added fetchNotifications to allow manual refresh
    loading: boolean; // CHANGE: Added loading state for UI feedback
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // CHANGE: Removed all hardcoded mock notification data
    // CHANGE: Start with empty array — will be populated from API
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // CHANGE: Added loading state

    // CHANGE: Fetch notifications from backend API
    const fetchNotifications = useCallback(async () => {
        const accessToken = Cookies.get(cookieParams.accessToken);
        if (!accessToken) return; // CHANGE: Only fetch if user is logged in

        setLoading(true);
        try {
            const result = await ApiService.crud(APIDetails.getNotifications);
            if (result[0]) {
                setNotifications(result[1]); // CHANGE: Set notifications from API response
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // CHANGE: Fetch notifications on mount when user is logged in
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // CHANGE: Updated markAsRead to call backend API instead of just local state
    const markAsRead = async (id: string) => {
        // Optimistically update UI first
        setNotifications((prev) =>
            prev.map((notif) => (notif._id === id ? { ...notif, isRead: true } : notif))
        );

        // CHANGE: Call backend API to persist the read status
        try {
            await ApiService.crud(APIDetails.markNotificationRead, `${id}/read`);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            // Revert on failure
            fetchNotifications();
        }
    };

    // CHANGE: Updated markAllAsRead to call backend API instead of just local state
    const markAllAsRead = async () => {
        // Optimistically update UI first
        setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, isRead: true }))
        );

        // CHANGE: Call backend API to persist all-read status
        try {
            await ApiService.crud(APIDetails.markAllNotificationsRead, {});
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
            // Revert on failure
            fetchNotifications();
        }
    };

    // PERF: Memoize context value to prevent unnecessary re-renders of all consumers
    const contextValue = React.useMemo(() => ({
        notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications, loading
    }), [notifications, unreadCount, loading]);

    return (
        // CHANGE: Added fetchNotifications and loading to context value
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};
