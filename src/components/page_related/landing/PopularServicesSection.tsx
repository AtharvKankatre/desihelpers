import React from "react";
import { useRouter } from "next/router";
import styles from "@/styles/PopularServices.module.css";

// Sample data for popular services - mix of jobs, helpers, and ads
const popularServices = [
    {
        id: 1,
        type: "job",
        title: "Nanny",
        description: "Nanny for 3-month-old baby",
        location: "Bothell, Washington",
        date: "Mon 25, 2025",
        rate: "$25-$35 / hr",
        image: "/assets/illustrations/nanny.png",
        urgent: true,
    },
    {
        id: 2,
        type: "helper",
        name: "Sukhreet Kaur",
        location: "Bothell, Washington",
        image: "/assets/helpers/helper1.jpg",
        skills: ["babysitting", "cooking", "cleaning", "tutoring"],
    },
    {
        id: 3,
        type: "job",
        title: "Tiffin",
        description: "Looking for Maharashtrian food",
        location: "Oakland, California",
        date: "Oct 1, 2025",
        rate: "$15-$20 / meal",
        image: "https://cdn-icons-png.flaticon.com/512/3014/3014520.png", // Transparent lunchbox icon
        urgent: true,
    },
    {
        id: 4,
        type: "job",
        title: "Cake Bakers",
        description: "Cake Bakers Services",
        location: "Adair County, Kentucky",
        date: "Sep 19, 2025",
        rate: "$25-$35 / hr",
        image: "/assets/illustrations/cake_bakers.png",
        urgent: true,
    },
    {
        id: 5,
        type: "helper",
        name: "Sukhreet Kaur",
        location: "Bothell, Washington",
        image: "/assets/helpers/helper2.jpg",
        skills: ["babysitting", "cooking", "cleaning", "tutoring"],
    },
    {
        id: 6,
        type: "job",
        title: "Servers",
        description: "need servers to serve in party",
        location: "Morrisville, Pennsylvania",
        date: "Jul 1, 2025",
        rate: "$15-$25 / hr",
        image: "/assets/illustrations/servers.png",
        urgent: true,
    },
    {
        id: 7,
        type: "helper",
        name: "Sukhreet Kaur",
        location: "Bothell, Washington",
        image: "/assets/helpers/helper3.jpg",
        skills: ["babysitting", "cooking", "cleaning", "tutoring"],
    },
];

// Skill icon mapping
const skillIcons: { [key: string]: string } = {
    babysitting: "👶",
    cooking: "🍳",
    cleaning: "🧹",
    tutoring: "📚",
};

export const PopularServicesSection: React.FC = () => {
    const router = useRouter();

    const handleSignIn = () => {
        router.push("/Login");
    };

    return (
        <section className={styles.popularSection}>
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Popular Services</h2>
                    <p className={styles.subtitle}>Trending Jobs and Top rated Helpers</p>
                </div>

                {/* Cards Grid */}
                <div className={styles.cardsGrid}>
                    {popularServices.map((item, index) => (
                        <div key={item.id} className={styles.card}>
                            {/* Job Card */}
                            {item.type === "job" && (
                                <>
                                    {item.urgent && <span className={styles.urgentBadge}>URGENT</span>}
                                    <div className={styles.jobImageContainer}>
                                        <img src={item.image} alt={item.title} className={styles.jobImage} />
                                    </div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <p className={styles.cardDescription}>{item.description}</p>
                                    <div className={styles.cardLocation}>
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                        {item.location}
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.cardDate}>{item.date}</span>
                                        <span className={styles.cardRate}>{item.rate}</span>
                                    </div>
                                    <div className={styles.skillIcons}>
                                        {Object.values(skillIcons).map((icon, idx) => (
                                            <span key={idx} className={styles.skillIcon}>{icon}</span>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Helper Card */}
                            {item.type === "helper" && (
                                <>
                                    <div className={styles.helperImageContainer}>
                                        <img src={item.image} alt={item.name} className={styles.helperImage} />
                                    </div>
                                    <h3 className={styles.cardTitle}>{item.name}</h3>
                                    <div className={styles.cardLocation}>
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                        {item.location}
                                    </div>
                                    <div className={styles.skillIcons}>
                                        {item.skills?.map((skill, idx) => (
                                            <span key={idx} className={styles.skillIcon}>
                                                {skillIcons[skill] || "✨"}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Advertisement Card */}
                            {item.type === "ad" && (
                                <>
                                    <span className={styles.advtBadge}>ADVT</span>
                                    <div className={styles.adContainer}>
                                        <div className={styles.adPlaceholder}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21,15 16,10 5,21" />
                                            </svg>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Sign In Button */}
                <div className={styles.ctaContainer}>
                    <button className={styles.signInButton} onClick={handleSignIn}>
                        Sign In for More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PopularServicesSection;
