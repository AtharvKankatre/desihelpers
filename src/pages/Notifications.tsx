// =====================================================================
// CHANGE: Updated Notifications page to work with real API data
// - Changed from hardcoded 'id' (number) to '_id' (string) from MongoDB
// - Added loading spinner and empty state
// - Dates now computed from 'createdAt' timestamp instead of hardcoded strings
// =====================================================================
import React from "react";
import Head from "next/head";
import { Box, GlobalStyles, Button, Container, CircularProgress } from "@mui/material";
import { CHeader } from "@/components/global/header/CHeader";
import { FaBell } from "react-icons/fa";
import { useNotification, NotificationItem } from "@/context/NotificationContext";
import useTranslation from "next-translate/useTranslation";

// CHANGE: Helper function to format createdAt timestamp into relative time string
function formatTimeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hrs ago`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "2-digit" });
}

// CHANGE: Helper function to group notifications by date label
function getDateLabel(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const notifDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (notifDate.getTime() === today.getTime()) return "Today";
    if (notifDate.getTime() === yesterday.getTime()) return "Yesterday";
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "2-digit" });
}

const Notifications: React.FC = () => {
    const { notifications, markAllAsRead, markAsRead, loading } = useNotification();
    const { t } = useTranslation('common');

    // CHANGE: Group notifications by date label computed from createdAt
    const groupedNotifications = notifications.reduce((groups, notification) => {
        const date = getDateLabel(notification.createdAt); // CHANGE: Use createdAt instead of hardcoded 'date'
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(notification);
        return groups;
    }, {} as Record<string, typeof notifications>);

    return (
        <>
            <Head>
                <title>Notifications | DesiHelpers</title>
            </Head>

            <GlobalStyles
                styles={{
                    header: {
                        background: "transparent !important",
                        backgroundColor: "transparent !important",
                        boxShadow: "none !important",
                        position: "absolute !important",
                        width: "100% !important",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    },
                    "header a:not(.notification-popup *):not(.notification-popup):not(.language-dropdown *):not(.language-dropdown)": {
                        color: "#ffffff !important",
                    },
                    "header button:not(.notification-popup *):not(.notification-popup):not(.language-dropdown *):not(.language-dropdown)": {
                        color: "#ffffff !important",
                    },
                    "header .langButton": {
                        color: "#ffffff !important",
                    },
                    // Force notification popup text to be visible
                    ".notification-popup": {
                        color: "#000000 !important",
                    },
                    ".notification-popup *": {
                        color: "#000000 !important",
                    },
                    ".notification-popup .MuiTypography-root": {
                        color: "#000000 !important",
                    },
                    ".notification-popup b": {
                        color: "#000000 !important",
                    },
                    // Force language dropdown text to be visible
                    ".language-dropdown": {
                        color: "#000000 !important",
                    },
                    ".language-dropdown *": {
                        color: "#000000 !important",
                    },
                    ".language-dropdown button": {
                        color: "#000000 !important",
                    },
                }}
            />

            <CHeader />

            {/* Hero Section */}
            <Box
                sx={{
                    background: "linear-gradient(180deg, #00132F 0%, #003E95 100%)",
                    color: "#ffffff",
                    pt: 15,
                    pb: 5,
                    textAlign: "center",
                }}
            >
                <Container>
                    {/* Breadcrumbs */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1,
                            mb: 3,
                            opacity: 0.8,
                        }}
                    >
                        <Box component="span">{t('notif.home')}</Box>
                        <Box component="span">›</Box>
                        <Box component="span">{t('notif.title')}</Box>
                    </Box>

                    {/* Heading */}
                    <Box component="h1" sx={{ fontSize: "2.5rem", fontWeight: 700, mb: 2, textAlign: "center" }}>
                        {t('notif.title')}
                    </Box>
                    <Box component="p" sx={{ opacity: 0.9, maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
                        {t('notif.subtitle')}
                    </Box>
                </Container>
            </Box>

            {/* Notifications Content */}
            <Box sx={{ backgroundColor: "#ffffff", minHeight: "100vh", py: 5 }}>
                <Container maxWidth="md">
                    {/* Header with Mark All as Read */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                        }}
                    >
                        <h3 style={{ color: "#003E95", fontWeight: 600, margin: 0 }}>
                            {t('notif.title')}
                        </h3>
                        <Button onClick={markAllAsRead} sx={{ color: "#fd7e14", fontWeight: 600, textTransform: "uppercase", fontSize: "0.875rem", "&:hover": { backgroundColor: "rgba(253, 126, 20, 0.1)" } }}>
                            {t('notif.mark_all_read')}
                        </Button>
                    </Box>

                    {/* CHANGE: Added loading spinner while fetching notifications */}
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                            <CircularProgress sx={{ color: "#fd7e14" }} />
                        </Box>
                    ) : notifications.length === 0 ? (
                        /* CHANGE: Added empty state when no notifications exist */
                        <Box
                            sx={{
                                backgroundColor: "#f9f9f9",
                                borderRadius: "12px",
                                padding: "4rem 2rem",
                                textAlign: "center",
                            }}
                        >
                            <FaBell color="#ccc" size={48} />
                            <p style={{ color: "#999", fontSize: "1.1rem", marginTop: "1rem" }}>
                                {t('notif.empty')}
                            </p>
                        </Box>
                    ) : (
                        /* Notifications List */
                        <Box
                            sx={{
                                backgroundColor: "#f9f9f9",
                                borderRadius: "12px",
                                padding: "2rem",
                            }}
                        >
                            {Object.entries(groupedNotifications).map(([date, notifs]) => (
                                <Box key={date} sx={{ mb: 3 }}>
                                    {/* Date Header */}
                                    <h5
                                        style={{
                                            color: "#666",
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        {date}
                                    </h5>

                                    {/* Notification Items */}
                                    {notifs.map((notification) => (
                                        <Box
                                            key={notification._id} // CHANGE: Use _id instead of id
                                            onClick={() => markAsRead(notification._id)} // CHANGE: Use _id instead of id
                                            sx={{
                                                backgroundColor: notification.isRead ? "#f9f9f9" : "#ffffff",
                                                borderRadius: "8px",
                                                padding: "1.25rem",
                                                mb: 2,
                                                display: "flex",
                                                gap: 2,
                                                boxShadow: notification.isRead ? "none" : "0 1px 3px rgba(0,0,0,0.1)",
                                                border: notification.isRead ? "1px solid #eee" : "none",
                                                position: "relative",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {/* Bell Icon */}
                                            <Box
                                                sx={{
                                                    backgroundColor: notification.isRead ? "#eee" : "#FFE8D6",
                                                    borderRadius: "50%",
                                                    width: "40px",
                                                    height: "40px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <FaBell color={notification.isRead ? "#999" : "#fd7e14"} size={18} />
                                            </Box>

                                            {/* Content */}
                                            <Box sx={{ flex: 1 }}>
                                                <p
                                                    style={{
                                                        color: "#333",
                                                        margin: "0 0 0.75rem 0",
                                                        lineHeight: 1.6,
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: notification.message.replace(
                                                            notification.name,
                                                            `<strong>${notification.name}</strong>`
                                                        ),
                                                    }}
                                                />

                                                {/* Action Buttons */}
                                                <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                                                    <Button variant="text" sx={{ color: "#333", fontWeight: 600, minWidth: "auto", padding: "4px 8px", "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" } }}>
                                                        {t('common.yes')}
                                                    </Button>
                                                    <Button variant="text" sx={{ color: "#333", fontWeight: 600, minWidth: "auto", padding: "4px 8px", "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" } }}>
                                                        {t('common.no')}
                                                    </Button>
                                                </Box>

                                                {/* CHANGE: Timestamp now computed from createdAt instead of hardcoded 'time' */}
                                                <p
                                                    style={{
                                                        color: "#999",
                                                        fontSize: "0.875rem",
                                                        margin: 0,
                                                    }}
                                                >
                                                    {formatTimeAgo(notification.createdAt)}
                                                </p>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            ))}
                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default Notifications;
