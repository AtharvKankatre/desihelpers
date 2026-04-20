import React from "react";
import styles from "@/styles/BlogSection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { styled } from '@mui/system';
import Link from 'next/link';

const blogPosts = [
    {
        id: 13,
        image: "/newassets/indian_realtor_vastu.png",
        category: "Articles",
        date: "April 13, 2026",
        title: "Finding a U.S. Realtor Who Understands Indian Housing Needs (Vastu, Culture & Tradeoffs)",
        excerpt: "What if your 'perfect home' in the U.S. checks every financial box—but still feels slightly off? For many Indian-American buyers, that feeling isn't random..."
    },
    {
        id: 12,
        image: "/newassets/indian_food_catering.png",
        category: "Articles",
        date: "April 13, 2026",
        title: "How to Choose a Caterer for Indian Food in the USA (Before It's Too Late)",
        excerpt: "When it comes to choosing a caterer for Indian food in the USA, the stakes are high. You're trusting someone to handle flavor, timing, hygiene..."
    },
    {
        id: 11,
        image: "/newassets/satya_narayan_puja.png",
        category: "Articles",
        date: "April 13, 2026",
        title: "Satya Narayan Puja: Complete Guide with Videos, Preparation & Checklist (USA Edition)",
        excerpt: "Satya Narayan Puja is one of the most meaningful Hindu rituals, dedicated to Lord Vishnu. This complete guide covers videos, preparation & more..."
    }
];

export const BlogSection: React.FC = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <span className={styles.label}>Blog</span>
                <h2 className={styles.heading}>Tips, Stories & Inspiration For You</h2>
                <p className={styles.subHeading}>
                    Real experiences from our DESI community—helpful tips, inspiring journeys,
                    and stories that make life in the U.S. feel a little more like home.
                </p>

                <div className={styles.grid}>
                    {blogPosts.map((post) => (
                        <Link key={post.id} href={`/resources/${post.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                            <div className={styles.card} style={{ cursor: 'pointer', height: '100%' }}>
                                <div className={styles.imageContainer}>
                                    <img src={post.image} alt={post.title} className={styles.image} />
                                </div>
                                <div className={styles.cardContent}>
                                    <div className={styles.metaRow}>
                                        <span className={styles.category}>{post.category}</span>
                                        <span className={styles.date}>{post.date}</span>
                                    </div>
                                    <h3 className={styles.cardTitle}>{post.title}</h3>
                                    <p className={styles.cardExcerpt}>{post.excerpt}</p>
                                    <span className={styles.readMore}>
                                        Read more <FontAwesomeIcon icon={faArrowRight} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <Link href="/resources" style={{ textDecoration: 'none' }}>
                    <button className={styles.viewAllButton} style={{ cursor: "pointer" }}>View All</button>
                </Link>
            </div>
        </section>
    );
};
