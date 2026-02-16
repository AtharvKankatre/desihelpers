import React from "react";
import { Box, Typography, Paper, Button, IconButton, Fade, Zoom } from "@mui/material";
import { styled } from "@mui/system";
import { FaBell } from "react-icons/fa";
import Link from "next/link";

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
    return (
        <Zoom in={open} style={{ transformOrigin: 'top right' }}>
            <Paper
                elevation={4}
                className="notification-popup"
                style={{ color: '#000' }}
                sx={{
                    position: "absolute",
                    top: "60px",
                    right: "20px",
                    width: "360px",
                    borderRadius: "8px",
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
                    <Typography variant="caption" sx={{ color: "#fd7e14 !important", fontWeight: 700, cursor: "pointer" }}>
                        MARK ALL AS READ
                    </Typography>
                </Box>
                <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
                    {/* Notification 1 */}
                    <NotificationItem>
                        <NotificationIcon>
                            <FaBell color="#fd7e14" size={16} />
                        </NotificationIcon>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ color: "#444 !important", mb: 1, fontSize: "0.9rem" }}>
                                Good news! <b style={{ color: "#444 !important" }}>Mr. Jasbinder</b> just viewed your profile. Keep your details updated to get hired faster.
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "#333 !important", cursor: "pointer" }}>YES</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "#333 !important", cursor: "pointer" }}>No</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: "#999 !important" }}>30 mins ago</Typography>
                        </Box>
                        <Box sx={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fd7e14", mt: 1 }} />
                    </NotificationItem>

                    {/* Notification 2 */}
                    <NotificationItem>
                        <NotificationIcon>
                            <FaBell color="#fd7e14" size={16} />
                        </NotificationIcon>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ color: "#444 !important", mb: 1, fontSize: "0.9rem" }}>
                                You recently visited <b style={{ color: "#444 !important" }}>Tania's</b> profile. Did you provide services to them? Share your feedback to build trust.
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "#333 !important", cursor: "pointer" }}>YES</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "#333 !important", cursor: "pointer" }}>No</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: "#999 !important" }}>2 hrs ago</Typography>
                        </Box>
                        <Box sx={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fd7e14", mt: 1 }} />
                    </NotificationItem>

                    {/* Notification 3 - Trigger for Feedback */}
                    <NotificationItem>
                        <NotificationIcon>
                            <FaBell color="#fd7e14" size={16} />
                        </NotificationIcon>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ color: "#444 !important", mb: 1, fontSize: "0.9rem" }}>
                                Did you and <b style={{ color: "#444 !important" }}>Mr. Raman</b> connect for work? If yes, let us know your experience by leaving a quick rating.
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 0.5 }}>
                                <Typography
                                    variant="caption"
                                    sx={{ fontWeight: 700, color: "#333 !important", cursor: "pointer", "&:hover": { color: "#fd7e14 !important" } }}
                                    onClick={() => {
                                        onFeedbackClick();
                                        onClose(); // Optional: close notifications when opening modal
                                    }}
                                >
                                    YES
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "#333 !important", cursor: "pointer" }}>No</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: "#999 !important" }}>10 hrs ago</Typography>
                        </Box>
                    </NotificationItem>
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
