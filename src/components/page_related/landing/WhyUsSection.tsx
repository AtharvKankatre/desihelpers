import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/WhyUsSection.module.css";
import { useAuth } from "@/services/authorization/AuthContext";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";

export const WhyUsSection: React.FC = () => {
    const router = useRouter();
    const { isActive } = useAuth();
    const [completionPercent, setCompletionPercent] = useState(0);

    useEffect(() => {
        if (!isActive) return;

        const fetchProfile = async () => {
            try {
                const result = await ApiService.crud(APIDetails.getUserProfile);
                if (result[0] && result[1]) {
                    const p = result[1];

                    // Calculate completion based on key profile fields
                    const fields = [
                        p.firstName,
                        p.lastName,
                        p.email,
                        p.mobile || p.phone,
                        p.addressLine1,
                        p.city,
                        p.state,
                        p.zipCode,
                        p.languagesSpoken && p.languagesSpoken.length > 0 ? "filled" : "",
                        p.aboutMe,
                        p.gender,
                        p.displayName,
                    ];
                    const filled = fields.filter(
                        (f) => f !== undefined && f !== null && f !== ""
                    ).length;
                    const percent = Math.round((filled / fields.length) * 100);
                    setCompletionPercent(percent);
                }
            } catch (err) {
                console.error("Error fetching profile for completion:", err);
            }
        };

        fetchProfile();
    }, [isActive]);

    const handleGetStarted = () => {
        if (isActive) {
            router.push("/profile");
            return;
        }
        router.push("/Login?mode=signup");
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
                        {isActive ? (completionPercent === 100 ? "See Your Profile" : "Complete Your Profile") : "Get Started"}
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
