import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface NotificationItem {
    id: number;
    message: string;
    name: string;
    time: string;
    date: string;
    isRead: boolean;
}

interface NotificationContextProps {
    notifications: NotificationItem[];
    unreadCount: number;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initial mocked notification state migrated from Notifications.tsx
    const [notifications, setNotifications] = useState<NotificationItem[]>([
        {
            id: 1,
            message: "Good news! Mr. Jasbinder just viewed your profile. Keep your details updated to get hired faster.",
            name: "Mr. Jasbinder",
            time: "30 mins ago",
            date: "Today",
            isRead: false,
        },
        {
            id: 2,
            message: "You recently visited Tania's profile. Did you provide services to them? Share your feedback to build trust.",
            name: "Tania",
            time: "2 hrs ago",
            date: "Today",
            isRead: false,
        },
        {
            id: 3,
            message: "Did you and Mr. Raman connect for work? If yes, let us know your experience by leaving a quick rating.",
            name: "Mr. Raman",
            time: "Yesterday",
            date: "Yesterday",
            isRead: false,
        },
        {
            id: 4,
            message: "Help the community grow! Rate your recent engagement with Sara and add a short testimonial.",
            name: "Sara",
            time: "Yesterday",
            date: "Yesterday",
            isRead: false,
        },
        {
            id: 5,
            message: "Your opinion matters! Leave a quick review for Mrs. Meea and strengthen their chances of getting hired.",
            name: "Mrs. Meea",
            time: "Yesterday",
            date: "2 Oct, 25",
            isRead: false,
        },
        {
            id: 6,
            message: "Did you recently connect with miss. Nagma? Share your experience to help others hire with confidence.",
            name: "miss. Nagma",
            time: "Yesterday",
            date: "2 Oct, 25",
            isRead: false,
        },
        {
            id: 7,
            message: "Trust grows with feedback — rate your recent interaction with [Name] to build credibility in the community.",
            name: "[Name]",
            time: "Yesterday",
            date: "2 Oct, 25",
            isRead: false,
        },
        {
            id: 8,
            message: "Help the community grow! Rate your recent engagement with Sara and add a short testimonial.",
            name: "Sara",
            time: "Yesterday",
            date: "2 Oct, 25",
            isRead: false,
        },
    ]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, isRead: true }))
        );
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
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
