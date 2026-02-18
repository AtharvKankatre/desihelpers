import React, { useState } from "react";
import { Box, Typography, Button, Paper, TextField, Modal } from "@mui/material";
import { FaStar } from "react-icons/fa";

interface CFeedbackModalProps {
    open: boolean;
    onClose: () => void;
}

export const CFeedbackModal: React.FC<CFeedbackModalProps> = ({ open, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="feedback-modal-title"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper
                sx={{
                    width: "450px",
                    borderRadius: "16px",
                    p: 4,
                    position: "relative",
                    outline: "none",
                }}
                elevation={24}
            >
                <Button
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        minWidth: "auto",
                        p: 0,
                        color: "#666",
                        fontSize: "1.2rem",
                    }}
                >
                    ✕
                </Button>

                <Typography id="feedback-modal-title" variant="h5" sx={{ fontWeight: 700, color: "#003366", mb: 1 }}>
                    Give Feedback
                </Typography>
                <Typography variant="body2" sx={{ color: "#888", mb: 3 }}>
                    Your feedback matters!
                </Typography>

                <Typography variant="subtitle2" sx={{ color: "#555", mb: 1, fontWeight: 600 }}>
                    Rate Your Interaction with <b>Mr. Raman</b>
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                    {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                            <FaStar
                                key={index}
                                size={32}
                                color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(ratingValue)}
                                style={{ cursor: "pointer", transition: "color 200ms" }}
                            />
                        );
                    })}
                </Box>

                <Typography variant="subtitle2" sx={{ color: "#555", mb: 1, fontWeight: 600 }}>
                    Add Testimonial
                </Typography>
                <TextField
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Enter your remark here"
                    variant="outlined"
                    sx={{
                        mb: 1,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                        },
                    }}
                />
                <Typography variant="caption" sx={{ display: "block", textAlign: "right", color: "#999", mb: 3 }}>
                    0/250 words
                </Typography>

                <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            flex: 1,
                            borderRadius: "24px",
                            textTransform: "none",
                            borderColor: "#003366",
                            color: "#003366",
                            fontWeight: 600,
                            borderWidth: "1px",
                            py: 1.5,
                            "&:hover": { borderWidth: "1px", backgroundColor: "#f5f9ff" }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            flex: 1,
                            borderRadius: "24px",
                            textTransform: "none",
                            backgroundColor: "#fd7e14",
                            fontWeight: 600,
                            py: 1.5,
                            "&:hover": { backgroundColor: "#e36d0c" },
                        }}
                    >
                        Submit
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};
