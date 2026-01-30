import React, { useRef, useState, useEffect } from "react";
import styles from "@/styles/TestimonialsGrid.module.css";

const testimonialsData = [
    {
        id: 1,
        name: "Ravi Patel",
        location: "Fremont, California",
        rating: 5,
        text: "Finding trustworthy childcare is tough, but DesiHelpers connected us with a responsible babysitter. The peace of mind is priceless. I'll keep using this site for sure.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: 2,
        name: "Deepak Nair",
        location: "Boston, Massachusetts",
        rating: 5,
        text: "Finding trustworthy childcare is tough, but DesiHelpers connected us with a responsible babysitter. The peace of mind is priceless. I'll keep using this site for sure.",
        image: "https://randomuser.me/api/portraits/men/64.jpg",
    },
    {
        id: 3,
        name: "Neha Sharma",
        location: "Dallas, Texas",
        rating: 5,
        text: "As a new mom, I really needed a mother's helper for a few hours a day. I found a kind and reliable lady through DesiHelpers who made life so much easier. This site is a lifesaver for families.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: 4,
        name: "Pooja Joshi",
        location: "Houston, Texas",
        rating: 5,
        text: "I hired a catering team through DesiHelpers for my parents' anniversary. The food was authentic and homely, just like we wanted. All our guests kept asking where we found them!",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
        id: 5,
        name: "Arjun Reddy",
        location: "Seattle, Washington",
        rating: 5,
        text: "I recently moved here and was looking for weekend catering gigs. Signed up on DesiHelpers and got my first order for a small party in just a week. Great platform for side income!",
        image: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
        id: 6,
        name: "Kiran Malhotra",
        location: "San Jose, California",
        rating: 5,
        text: "I'm a baker and listed my services here. Within two weeks, I got three cake orders from families nearby. This platform really helps small business owners like me.",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        id: 7,
        name: "Suresh Kumar",
        location: "Chicago, Illinois",
        rating: 5,
        text: "Great service for finding a priest for our housewarming. He was very knowledgeable and performed the ceremony perfectly.",
        image: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
        id: 8,
        name: "Anita Desai",
        location: "Edison, New Jersey",
        rating: 5,
        text: "Found a fantastic cook who makes authentic Gujarati food. My family loves the meals, and it saves me so much time during the week.",
        image: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
        id: 9,
        name: "Vikram Singh",
        location: "Toronto, Ontario",
        rating: 5,
        text: "DesiHelpers made my move smooth with reliable movers. They handled everything with care and were very professional.",
        image: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
        id: 10,
        name: "Meera Iyer",
        location: "Atlanta, Georgia",
        rating: 5,
        text: "Found a wonderful classical dance teacher for my daughter. The classes are excellent and she is learning so much.",
        image: "https://randomuser.me/api/portraits/women/24.jpg",
    },
    {
        id: 11,
        name: "Rajesh Khanna",
        location: "London, UK",
        rating: 5,
        text: "Excellent platform for finding local community events. I've met so many new people and found great networking opportunities.",
        image: "https://randomuser.me/api/portraits/men/33.jpg",
    },
    {
        id: 12,
        name: "Priya Malik",
        location: "Sydney, Australia",
        rating: 5,
        text: "Connected with other moms in the area. We now have a great playgroup for our kids and support network for us.",
        image: "https://randomuser.me/api/portraits/women/34.jpg",
    },
    {
        id: 13,
        name: "Amit Shah",
        location: "Mumbai, India",
        rating: 5,
        text: "Used it to find a driver during my visit. Keep it up! Very helpful for finding reliable help quickly.",
        image: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
        id: 14,
        name: "Sneha Roy",
        location: "Austin, Texas",
        rating: 5,
        text: "Found a Hindi tutor for my kids. They are enjoying the lessons and improving their language skills rapidly.",
        image: "https://randomuser.me/api/portraits/women/55.jpg",
    },
];

export const TestimonialsGrid: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Maximum pixels to translate columns during the scroll through the section
    const maxTranslate = 1000;

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const section = sectionRef.current;
            const rect = section.getBoundingClientRect();
            const sectionHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;

            // Calculate scroll progress when section is in view
            // Progress ranges from 0 to 1 as user scrolls through the section
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;

            // Check if section is currently visible in viewport
            // We expand the range slightly to ensure animation starts/ends smoothly
            if (sectionTop < windowHeight && sectionBottom > 0) {
                // Calculate progress (0 to 1) based on section position
                // 0 = section just entering from bottom
                // 1 = section just leaving at top
                const scrollableDistance = sectionHeight + windowHeight;
                const currentProgress = (windowHeight - sectionTop) / scrollableDistance;

                // Clamp between 0 and 1
                const clampedProgress = Math.max(0, Math.min(1, currentProgress));
                setScrollProgress(clampedProgress);
            }
        };

        // Throttle scroll event for better performance to hit 60fps
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll);
        // Initial calculation
        handleScroll();

        return () => {
            window.removeEventListener('scroll', throttledScroll);
        };
    }, []);

    // Calculate transforms based on scroll progress
    // Column 1 moves down (positive Y), Column 2 moves up (negative Y)
    const column1Transform = scrollProgress * maxTranslate;
    const column2Transform = -scrollProgress * maxTranslate;

    return (
        <section ref={sectionRef} className={styles.testimonialsSection}>
            <div className={styles.container}>
                {/* Left Panel - Info */}
                <div className={styles.leftPanel}>
                    {/* Large Quotation Marks Icon */}
                    <div className={styles.quoteIcon}>
                        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 60C0 48 2 37.3333 6 28C10.6667 18.6667 16.6667 11 24 5C32 -1 40.6667 -3.66667 50 -4V8C42 9.33333 35.3333 12.6667 30 18C24.6667 23.3333 21.6667 30 21 38H50V100H0V60Z" fill="#B8C5D9" />
                            <path d="M70 60C70 48 72 37.3333 76 28C80.6667 18.6667 86.6667 11 94 5C102 -1 110.667 -3.66667 120 -4V8C112 9.33333 105.333 12.6667 100 18C94.6667 23.3333 91.6667 30 91 38H120V100H70V60Z" fill="#B8C5D9" />
                        </svg>
                    </div>

                    <h2 className={styles.title}>What Our Members Have To Say</h2>
                    <p className={styles.description}>
                        DesiHelpers.com has saved me so much time in searching for ethnic help. I have deleted all the community Whatsapp groups now.
                    </p>
                    <button className={styles.connectBtn}>Connect Us</button>
                </div>

                {/* Right Panel - 2 Column Testimonials Grid with Scroll Animation */}
                <div className={styles.rightPanel}>
                    {/* Column 1 - Slides Down */}
                    <div
                        className={styles.column}
                        style={{
                            transform: `translateY(${column1Transform}px)`,
                            marginTop: `-${maxTranslate}px`
                        }}
                    >
                        {testimonialsData.slice(0, 7).map((testimonial) => (
                            <div key={testimonial.id} className={styles.testimonialCard}>
                                <div className={styles.stars}>
                                    {"★".repeat(testimonial.rating)}
                                </div>
                                <p className={styles.quote}>"{testimonial.text}"</p>
                                <div className={styles.author}>
                                    <img src={testimonial.image} alt={testimonial.name} className={styles.avatar} />
                                    <div className={styles.authorInfo}>
                                        <h4 className={styles.authorName}>{testimonial.name}</h4>
                                        <div className={styles.location}>
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                            {testimonial.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Column 2 - Slides Up */}
                    <div
                        className={styles.column}
                        style={{
                            transform: `translateY(${column2Transform}px)`
                        }}
                    >
                        {testimonialsData.slice(7, 14).map((testimonial) => (
                            <div key={testimonial.id} className={styles.testimonialCard}>
                                <div className={styles.stars}>
                                    {"★".repeat(testimonial.rating)}
                                </div>
                                <p className={styles.quote}>"{testimonial.text}"</p>
                                <div className={styles.author}>
                                    <img src={testimonial.image} alt={testimonial.name} className={styles.avatar} />
                                    <div className={styles.authorInfo}>
                                        <h4 className={styles.authorName}>{testimonial.name}</h4>
                                        <div className={styles.location}>
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                            {testimonial.location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsGrid;
