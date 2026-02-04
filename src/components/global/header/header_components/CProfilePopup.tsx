import React, { useState } from "react";
import { Box, Typography, Button, Paper, LinearProgress, Avatar, Zoom } from "@mui/material";
import { styled } from "@mui/system";
import { FaUserCircle, FaShareAlt, FaSignOutAlt, FaPencilAlt, FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import { Routes } from "@/services/routes/Routes"; // Adjust import path if needed

interface CProfilePopupProps {
    user: {
        name: string;
        location: string;
        lastLogin: string;
        profileCompletion: number;
        avatarUrl?: string;
    };
    onLogout: () => void;
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

const PopupContainer = styled(Paper)(({ theme }) => ({
    position: "absolute",
    top: "100%", // Below the avatar
    right: 0,
    width: "320px",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
    overflow: "hidden",
    zIndex: 1500,
    marginTop: "12px",
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    backgroundColor: "#fff5f0", // Light peach background
    padding: "16px",
    position: "relative",
}));

const ActionRow = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    cursor: "pointer",
    color: "#444",
    "&:hover": {
        backgroundColor: "#f9f9f9",
    },
}));

export const CProfilePopup: React.FC<CProfilePopupProps> = ({ user, onLogout, open, onClose }) => {
    return (
        <Zoom in={open} style={{ transformOrigin: 'top right' }}>
            <PopupContainer>
                {/* Header */}
                <HeaderSection>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#fd7e14" }}>
                                {user.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#666", display: "flex", alignItems: "center", gap: 0.5 }}>
                                <span style={{ fontSize: "14px" }}>📍</span> {user.location}
                            </Typography>
                            <Typography variant="caption" sx={{ display: "block", color: "#666", mt: 0.5, fontSize: "0.75rem" }}>
                                Last Login : {user.lastLogin}
                            </Typography>
                        </Box>
                        <FaPencilAlt size={14} color="#666" style={{ cursor: "pointer" }} />
                    </Box>
                </HeaderSection>

                <Box sx={{ p: 2 }}>
                    {/* My Profile Link */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                        <Box sx={{
                            width: 32, height: 32, borderRadius: "50%", backgroundColor: "#fff0e0",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <FaUserCircle color="#fd7e14" size={18} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
                            My Profile
                        </Typography>
                    </Box>

                    {/* Progress Bar */}
                    <Box sx={{ backgroundColor: "#f8f9fa", p: 1.5, borderRadius: "8px", mb: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: "#333" }}>Complete Your Profile</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: "#00bfa5" }}>{user.profileCompletion}%</Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={user.profileCompletion}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: "#e0e0e0",
                                "& .MuiLinearProgress-bar": { backgroundColor: "#00bfa5" }
                            }}
                        />
                        <Typography variant="caption" sx={{ display: "block", color: "#888", mt: 1, fontSize: "0.7rem", fontStyle: "italic", lineHeight: 1.3 }}>
                            Complete your profile to build trust and improve your chances of getting hired or hiring the right person.
                        </Typography>
                    </Box>

                    {/* List As Dropdown */}
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                            <Box sx={{
                                width: 32, height: 32, borderRadius: "50%", backgroundColor: "#fff0e0",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                {/* Icon similar to "List Your Profile As" */}
                                <Box component="span" sx={{ color: "#fd7e14", fontWeight: 700, fontSize: "14px" }}>@</Box>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
                                List Your Profile As
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 1 }}>
                            Control your visibility — list yourself as,
                        </Typography>
                        <Box sx={{
                            border: "1px solid #ddd", borderRadius: "8px", p: "8px 12px",
                            display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer"
                        }}>
                            <Typography variant="body2" sx={{ color: "#333" }}>Both</Typography>
                            <FaChevronDown size={12} color="#666" />
                        </Box>
                    </Box>

                    <Box sx={{ borderTop: "1px solid #f0f0f0", my: 1 }} />

                    {/* Share Profile */}
                    <ActionRow>
                        <Box sx={{
                            width: 32, height: 32, borderRadius: "8px", backgroundColor: "#fff0e0",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <FaShareAlt color="#fd7e14" size={16} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>Share Your Profile</Typography>
                    </ActionRow>

                    {/* Logout */}
                    <ActionRow onClick={onLogout}>
                        <Box sx={{
                            width: 32, height: 32, borderRadius: "8px", backgroundColor: "#fff0e0",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <FaSignOutAlt color="#fd7e14" size={16} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>Logout</Typography>
                    </ActionRow>

                </Box>
            </PopupContainer>
        </Zoom>
    );
};
