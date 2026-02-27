import React from "react";
import { useRouter } from "next/router";
import styles from "@/styles/CTASection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CTASectionProps {
    sx?: React.CSSProperties;
    className?: string;
    variant?: 'default' | 'blue';
}

export const CTASection: React.FC<CTASectionProps> = ({ sx, className, variant = 'default' }) => {
    const router = useRouter();

    const handleJoinCommunity = () => {
        router.push("/Login?mode=signup");
    };

    return (
        <section className={`${styles.section} ${variant === 'blue' ? styles.blueVariant : ''} ${className || ''}`} style={sx}>
            <div className={styles.container}>
                <div className={styles.contentColumn}>
                    <h2 className={styles.heading}>Ready to Get Started?</h2>
                    <p className={styles.description}>
                        Join our community today and experience the difference of working with verified, trusted professionals.
                    </p>
                </div>
                <div className={styles.buttonColumn}>
                    <button className={styles.ctaButton} onClick={handleJoinCommunity}>Join the community</button>
                </div>
            </div>
        </section>
    );
};
