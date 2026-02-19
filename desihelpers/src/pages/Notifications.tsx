import React, { useState } from "react";
import Head from "next/head";
import { Box, GlobalStyles, Button, Container } from "@mui/material";
import { CHeader } from "@/components/global/header/CHeader";
import { FaBell } from "react-icons/fa";

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState([
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

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, isRead: true }))
        );
    };

    const groupedNotifications = notifications.reduce((groups, notification) => {
        const date = notification.date;
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
                        <Box component="span">Home</Box>
                        <Box component="span">›</Box>
                        <Box component="span">Notifications</Box>
                    </Box>

                    {/* Heading */}
                    <Box component="h1" sx={{ fontSize: "2.5rem", fontWeight: 700, mb: 2, textAlign: "center" }}>
                        Notifications
                    </Box>
                    <Box component="p" sx={{ opacity: 0.9, maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
                        Stay updated with all your important notifications and activity.
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
                            Notifications
                        </h3>
                        <Button
                            onClick={markAllAsRead}
                            sx={{
                                color: "#fd7e14",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                fontSize: "0.875rem",
                                "&:hover": {
                                    backgroundColor: "rgba(253, 126, 20, 0.1)",
                                },
                            }}
                        >
                            Mark All as Read
                        </Button>
                    </Box>

                    {/* Notifications List */}
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
                                        key={notification.id}
                                        sx={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "8px",
                                            padding: "1.25rem",
                                            mb: 2,
                                            display: "flex",
                                            gap: 2,
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                            position: "relative",
                                        }}
                                    >
                                        {/* Bell Icon */}
                                        <Box
                                            sx={{
                                                backgroundColor: "#FFE8D6",
                                                borderRadius: "50%",
                                                width: "40px",
                                                height: "40px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <FaBell color="#fd7e14" size={18} />
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
                                                <Button
                                                    variant="text"
                                                    sx={{
                                                        color: "#333",
                                                        fontWeight: 600,
                                                        minWidth: "auto",
                                                        padding: "4px 8px",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(0,0,0,0.05)",
                                                        },
                                                    }}
                                                >
                                                    YES
                                                </Button>
                                                <Button
                                                    variant="text"
                                                    sx={{
                                                        color: "#333",
                                                        fontWeight: 600,
                                                        minWidth: "auto",
                                                        padding: "4px 8px",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(0,0,0,0.05)",
                                                        },
                                                    }}
                                                >
                                                    No
                                                </Button>
                                            </Box>

                                            {/* Timestamp */}
                                            <p
                                                style={{
                                                    color: "#999",
                                                    fontSize: "0.875rem",
                                                    margin: 0,
                                                }}
                                            >
                                                {notification.time}
                                            </p>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default Notifications;
