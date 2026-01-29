import React from "react";
import styles from "@/styles/CTASection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CTASection: React.FC = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.contentColumn}>
                    <h2 className={styles.heading}>Ready to Get Started?</h2>
                    <p className={styles.description}>
                        Join our community today and experience the difference of working with verified, trusted professionals.
                    </p>
                </div>
                <div className={styles.buttonColumn}>
                    <button className={styles.ctaButton}>Join the community</button>
                </div>
            </div>
        </section>
    );
};
