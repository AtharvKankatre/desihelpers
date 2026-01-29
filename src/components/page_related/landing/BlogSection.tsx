import React from "react";
import styles from "@/styles/BlogSection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const blogPosts = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Articles",
        date: "October 2, 2025",
        title: "Finding Trusted Help in the U.S. – How the DESI Community Supports Each Other",
        excerpt: "Moving to the U.S. can be exciting, but it often comes with challenges like finding reliable help..."
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Articles",
        date: "October 1, 2025",
        title: "From Side Hustle to Success: How DESI Skills Are Turning Into Income Abroad",
        excerpt: "For many Indian immigrants in the U.S., moving to a new country means adapting to a new lifestyle..."
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Articles",
        date: "September 30, 2025",
        title: "Parenting Made Easier: How Indian Families Find Nannies & Helpers in U.S",
        excerpt: "Raising children in a new country comes with its unique set of joys and hurdles..."
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
                        <div key={post.id} className={styles.card}>
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
                                <a href="#" className={styles.readMore}>
                                    Read more <FontAwesomeIcon icon={faArrowRight} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <button className={styles.viewAllButton}>View All</button>
            </div>
        </section>
    );
};
