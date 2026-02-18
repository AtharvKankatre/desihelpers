import React from "react";
import { useRouter } from "next/router";
import styles from "@/styles/WhyUsSection.module.css";

export const WhyUsSection: React.FC = () => {
    const router = useRouter();

    const handleGetStarted = () => {
        router.push("/Login");
    };

    return (
        <section className={styles.whyUsSection}>
            <div className={styles.container}>
                {/* Left Content */}
                <div className={styles.leftContent}>
                    <span className={styles.label}>WHY US</span>

                    <h2 className={styles.heading}>
                        Connecting <span className={styles.seekers}>Seekers</span> And{" "}
                        <span className={styles.providers}>Providers</span> In ONE Trusted DESI
                        Community Platform.
                    </h2>

                    <p className={styles.description}>
                        A trusted space where families and friends can easily find help, share
                        services, and support each other—just like asking a neighbors back home,
                        but online this time.
                    </p>

                    {/* Stats Grid */}
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>200+</span>
                            <span className={styles.statLabel}>Daily Visitors</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>1200+</span>
                            <span className={styles.statLabel}>Number of members</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>25+</span>
                            <span className={styles.statLabel}>Types of helper categories</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                4.8 <span className={styles.stars}>★★★★★</span>
                            </span>
                            <span className={styles.statLabel}>Avg Rating</span>
                        </div>
                    </div>

                    <button className={styles.getStartedButton} onClick={handleGetStarted}>
                        Get Started
                    </button>
                </div>

                {/* Right Image */}
                <div className={styles.rightContent}>
                    <div className={styles.imageContainer}>
                        <img
                            src="/assets/why-us-image.png"
                            alt="Service providers helping customers"
                            className={styles.heroImage}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyUsSection;
