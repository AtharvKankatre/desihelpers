import React, { useState } from "react";
import Head from "next/head";
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Button,
    Chip,
    styled,
    GlobalStyles,
} from "@mui/material";
import { FooterSection } from "@/components/page_related/landing/FooterSection";
import { CHeader } from "@/components/global/header/CHeader";
import { BlogCard } from "@/components/page_related/landing/BlogCard";
import { FaArrowRight } from "react-icons/fa";

// Global style for transparent header on this page
const CustomNavbarStyles = (
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
);

const HeroSection = styled(Box)(({ theme }) => ({
    background: "linear-gradient(180deg, #00132F 0%, #003E95 100%)",
    color: "#ffffff",
    paddingTop: "180px",
    paddingBottom: "100px",
    textAlign: "center",
    width: "100%",
    position: "relative",
}));

const CategoryTab = styled(Button, {
    shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
    textTransform: "none",
    color: active ? "#fd7e14" : "#666",
    fontWeight: active ? 700 : 500,
    fontSize: "1rem",
    borderBottom: active ? "2px solid #fd7e14" : "2px solid transparent",
    borderRadius: 0,
    padding: "8px 16px",
    "&:hover": {
        backgroundColor: "transparent",
        color: "#fd7e14",
    },
}));



const OrangeButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#fd7e14",
    color: "white",
    padding: "10px 24px",
    borderRadius: "24px",
    textTransform: "none",
    fontWeight: 600,
    "&:hover": {
        backgroundColor: "#e36d0c",
    },
}));

// Mock Data
const articles = [
    {
        id: 1,
        image: "/newassets/motherbaby.png", // Mom & child in grass
        category: "ARTICLES",
        date: "October 2, 2025",
        title: "Finding Trusted Help in the U.S. – How the DESI Community Supports Each Other",
        description: "Moving to the U.S. can be exciting, but it often comes with challenges like finding reliable help...",
    },
    {
        id: 2,
        image: "/newassets/study.png", // Woman teaching child
        category: "ARTICLES",
        date: "October 1, 2025",
        title: "From Side Hustle to Success: How DESI Skills Are Turning Into Income Abroad",
        description: "For many Indian immigrants in the U.S., moving to a new country means adapting to a new lifestyle...",
    },
    {
        id: 3,
        image: "/newassets/motherchild1.png", // Placeholder for "Parenting/Lunchbox" (Missing img) - reusing pro woman or existing
        category: "ARTICLES",
        date: "September 30, 2025",
        title: "Parenting Made Easier: How Indian Families Find Nannies & Helpers in U.S",
        description: "Raising children in a new country comes with its unique set of joys and hurdles...",
    },
    {
        id: 4,
        image: "/newassets/card1.png", // Men shaking hands
        category: "CATEGORY",
        date: "September 23, 2025",
        title: "Blog title heading will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
    {
        id: 5,
        image: "",
        category: "",
        date: "",
        title: "",
        description: "",
        isEmpty: true,
    },
    {
        id: 6,
        image: "/newassets/card2.png", // Coffee shop lady
        category: "CATEGORY",
        date: "September 07, 2025",
        title: "Blog title heading will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
    {
        id: 7,
        image: "/newassets/card3nanny.png", // Elderly lady
        category: "CATEGORY",
        date: "August 22, 2025",
        title: "Blog title heading will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
    {
        id: 8,
        image: "/newassets/card3nanny.png", // Elderly lady
        category: "CATEGORY",
        date: "August 10, 2025",
        title: "Blog title heading will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
    {
        id: 9,
        image: "/newassets/card3nanny.png", // Elderly lady
        category: "CATEGORY",
        date: "July 22, 2025",
        title: "Blog title heading will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
];

const Resources = () => {
    const [activeTab, setActiveTab] = useState("All");
    const categories = ["All", "Category 1", "Category 2", "Category 3", "Category 4", "Category 5"];

    return (
        <>
            <Head>
                <title>Resources - Tips, Stories & Inspiration | DesiHelpers</title>
            </Head>
            {CustomNavbarStyles}
            <CHeader /> {/* Ensure Header is present */}

            {/* Hero Section */}
            <HeroSection>
                <Container maxWidth="md">
                    <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 500, opacity: 0.8 }}>
                        BLOG
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                        Tips, Stories & Inspiration For You
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto", lineHeight: 1.6 }}>
                        Real experiences from our DESI community—helpful tips, inspiring journeys, and stories that make life in the U.S. feel a little more like home.
                    </Typography>
                </Container>
            </HeroSection>

            {/* Main Content */}
            <Box sx={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
                <Container maxWidth="lg" sx={{ py: 8 }}>

                    {/* Category Tabs */}
                    <Box sx={{ borderBottom: "1px solid #eee", mb: 6, display: "flex", gap: 2, overflowX: "auto" }}>
                        {categories.map((cat) => (
                            <CategoryTab
                                key={cat}
                                active={activeTab === cat}
                                onClick={() => setActiveTab(cat)}
                            >
                                {cat}
                            </CategoryTab>
                        ))}
                    </Box>

                    <Grid container spacing={4}>
                        {articles.map((article) => (
                            <Grid item xs={12} sm={6} md={4} key={article.id}>
                                {article.isEmpty ? (
                                    /* Empty Placeholder Card */
                                    <Box sx={{ height: "100%", minHeight: "300px", backgroundColor: "#f0f0f0", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Box component="span" sx={{ fontSize: "3rem", color: "#ccc" }}>📷</Box>
                                    </Box>
                                ) : (
                                    <BlogCard
                                        id={article.id}
                                        image={article.image}
                                        category={article.category}
                                        date={article.date}
                                        title={article.title}
                                        description={article.description}
                                    />
                                )}
                            </Grid>
                        ))}
                    </Grid>

                    {/* View All Button */}
                    <Box sx={{ textAlign: "center", mt: 8 }}>
                        <OrangeButton>
                            View All
                        </OrangeButton>
                    </Box>

                </Container>
            </Box>

            {/* <FooterSection /> Duplicate footer removed */}
        </>
    );
};

export default Resources;
