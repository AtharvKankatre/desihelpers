import React from "react";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Button,
    styled,
} from "@mui/material";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: "24px",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    border: "1px solid #f0f0f0",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0px 12px 30px rgba(0,0,0,0.08)",
    },
}));

interface BlogCardProps {
    id: number;
    image: string;
    category: string;
    date: string;
    title: string;
    description: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({ id, image, category, date, title, description }) => {
    return (
        <Link href={`/resources/${id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <StyledCard>
                <Box sx={{ position: "relative", height: "240px", overflow: "hidden", borderTopLeftRadius: "24px", borderTopRightRadius: "24px" }}>
                    <CardMedia
                        component="img"
                        height="100%"
                        image={image || "https://via.placeholder.com/400x240"}
                        alt={title}
                        sx={{ objectFit: "cover", transition: "transform 0.5s ease", "&:hover": { transform: "scale(1.05)" } }}
                    />
                </Box>
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: "#fd7e14", fontWeight: 700, textTransform: "uppercase", fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                            {category}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#999", fontSize: '0.75rem' }}>
                            {date}
                        </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#003366", mb: 2, lineHeight: 1.3, fontSize: '1.1rem', minHeight: '3em' }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 3, flexGrow: 1, lineHeight: 1.6 }}>
                        {description.length > 80 ? description.substring(0, 80) + "..." : description}
                    </Typography>

                    <Box sx={{ mt: "auto" }}>
                        <Button
                            endIcon={<FaArrowRight size={12} />}
                            sx={{
                                textTransform: "none",
                                color: "#005DE1",
                                fontWeight: 600,
                                p: 0,
                                fontSize: '0.9rem',
                                "&:hover": { background: "none", textDecoration: "underline" }
                            }}
                        >
                            Read more
                        </Button>
                    </Box>
                </CardContent>
            </StyledCard>
        </Link>
    );
};
