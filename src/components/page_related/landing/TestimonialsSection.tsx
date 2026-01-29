import React, { useState } from "react";
import styles from "@/styles/TestimonialsSection.module.css";

const testimonials = [
    {
        id: 1,
        text: "I've always loved cooking, but after moving to the U.S., I struggled to find work that matched my skills. DesiHelpers changed everything. I got my first catering order for a birthday party and slowly started getting repeat customers. Now I make over $3,000 a month from catering gigs through this platform. What started as a side hustle has become a proper income stream, and it gives me pride that people here love my food.",
        name: "Arjun Reddy",
        location: "Seattle, Washington",
        rating: 5,
        userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // High quality portrait
        video: true,
    },
    {
        id: 2,
        text: "As a new mom, I really needed a mother's helper for a few hours a day. I found a kind and reliable lady through DesiHelpers who made life so much easier. This site is a lifesaver for families.",
        name: "Neha Sharma",
        location: "Dallas, Texas",
        rating: 5,
        userImage: "https://randomuser.me/api/portraits/women/44.jpg",
        video: false,
    },
    {
        id: 3,
        text: "Finding trustworthy childcare is tough, but DesiHelpers connected us with a responsible babysitter. The peace of mind is priceless. I'll keep using this site for sure.",
        name: "Deepak Nair",
        location: "Boston, Massachusetts",
        rating: 5,
        userImage: "https://randomuser.me/api/portraits/men/64.jpg",
        video: false,
    },
];

export const TestimonialsSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const activeTestimonial = testimonials[activeIndex];

    return (
        <section className={styles.testimonialsSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>What Our Members Have To Say</h2>
                    <p className={styles.subtitle}>Real stories from real people</p>
                </div>

                <div className={styles.contentWrapper}>
                    {/* Left Side - Image/Video Card */}
                    <div className={styles.imageCard}>
                        {/* Key ensures animation restarts on change */}
                        <div className={styles.imageWrapper} key={activeTestimonial.id}>
                            <img
                                src={activeTestimonial.userImage}
                                alt={activeTestimonial.name}
                                className={styles.mainImage}
                                onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/400x500";
                                }}
                            />
                            <button className={styles.playButton}>
                                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.playIcon}>
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </button>
                        </div>
                        {/* Decorative colored box behind */}
                        <div className={styles.decorativeBox}></div>
                    </div>

                    {/* Right Side - Quote and Text */}
                    <div className={styles.textContent} key={`text-${activeTestimonial.id}`}>
                        <div className={styles.stars}>
                            {"★".repeat(activeTestimonial.rating)}
                        </div>
                        <p className={styles.quoteText}>"{activeTestimonial.text}"</p>

                        <div className={styles.authorInfo}>
                            <h4 className={styles.authorName}>{activeTestimonial.name}</h4>
                            <div className={styles.location}>
                                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                                {activeTestimonial.location}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className={styles.navigation}>
                            <div className={styles.dots}>
                                {testimonials.map((_, idx) => (
                                    <button
                                        key={idx}
                                        className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
                                        onClick={() => setActiveIndex(idx)}
                                    />
                                ))}
                            </div>
                            <div className={styles.arrows}>
                                <button className={styles.arrowBtn} onClick={handlePrev}>
                                    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" width="20" height="20" strokeWidth="2">
                                        <path d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button className={styles.arrowBtn} onClick={handleNext}>
                                    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" width="20" height="20" strokeWidth="2">
                                        <path d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
