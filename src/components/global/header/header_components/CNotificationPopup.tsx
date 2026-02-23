import React from "react";
import { Box, Typography, Paper, Button, IconButton, Fade, Zoom } from "@mui/material";
import { styled } from "@mui/system";
import { FaBell } from "react-icons/fa";
import Link from "next/link";
import { useNotification } from "@/context/NotificationContext";

const NotificationItem = styled(Box)(({ theme }) => ({
    padding: "16px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    gap: "12px",
    "&:last-child": {
        borderBottom: "none",
    },
    "&:hover": {
        backgroundColor: "#fafafa",
    },
}));

const NotificationIcon = styled(Box)({
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#fff0e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
});

interface CNotificationPopupProps {
    open: boolean;
    onClose: () => void;
    onFeedbackClick: () => void;
}

export const CNotificationPopup: React.FC<CNotificationPopupProps> = ({ open, onClose, onFeedbackClick }) => {
    const { notifications, markAllAsRead, markAsRead } = useNotification();
    const recentNotifications = notifications.slice(0, 3);

    return (
        <Zoom in={open} style={{ transformOrigin: 'top right' }}>
            <Paper
                elevation={4}
                className="notification-popup"
                style={{ color: '#000' }}
                sx={{
                    position: "absolute",
                    top: { xs: "55px", sm: "60px" },
                    right: { xs: "5vw", sm: "20px" },
                    width: { xs: "90vw", sm: "360px" },
                    maxWidth: "360px",
                    borderRadius: "12px",
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 1400,
                    backgroundColor: "white",
                    overflow: "hidden",
                    '& *': {
                        color: '#000 !important',
                    },
                }}
            >
                <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#003366 !important" }}>
                        Notifications
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ color: "#fd7e14 !important", fontWeight: 700, cursor: "pointer" }}
                        onClick={markAllAsRead}
                    >
                        MARK ALL AS READ
                    </Typography>
                </Box>
                <Box sx={{ maxHeight: { xs: "60vh", sm: "400px" }, overflowY: "auto" }}>
                    {recentNotifications.length > 0 ? (
                        recentNotifications.map((notif) => (
                            <NotificationItem key={notif.id} onClick={() => markAsRead(notif.id)}>
                                <NotificationIcon>
                                    <FaBell color="#fd7e14" size={16} />
                                </NotificationIcon>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ color: "#444 !important", mb: 1, fontSize: "0.9rem" }} dangerouslySetInnerHTML={{ __html: notif.message.replace(notif.name, `<b style="color: #444 !important">${notif.name}</b>`) }} />
                                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 0.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#333 !important", cursor: "pointer", "&:hover": { color: "#fd7e14 !important" } }} onClick={(e) => { e.stopPropagation(); if (notif.id === 3) { onFeedbackClick(); onClose(); } }}>YES</Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#333 !important", cursor: "pointer", "&:hover": { color: "#fd7e14 !important" } }} onClick={(e) => { e.stopPropagation(); }}>No</Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: "#999 !important" }}>{notif.time}</Typography>
                                </Box>
                                {!notif.isRead && (
                                    <Box sx={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fd7e14", mt: 1 }} />
                                )}
                            </NotificationItem>
                        ))
                    ) : (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: "#666 !important" }}>No new notifications</Typography>
                        </Box>
                    )}
                </Box>
                <Box sx={{ p: 1.5, textAlign: "center", borderTop: "1px solid #eee" }}>
                    <Link href="/Notifications" passHref style={{ textDecoration: 'none' }}>
                        <Typography
                            variant="caption"
                            sx={{ color: "#fd7e14 !important", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
                            onClick={onClose}
                        >
                            VIEW ALL
                        </Typography>
                    </Link>
                </Box>
            </Paper>
        </Zoom>
    );
};
