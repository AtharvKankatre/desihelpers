import React from "react";
import styles from "@/styles/AdPlaceholders.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTimes } from "@fortawesome/free-solid-svg-icons";

export const AdPlaceholders: React.FC = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {[1, 2, 3].map((item) => (
                    <div key={item} className={styles.adCard}>
                        <span className={styles.badge}>ADVT</span>
                        <div className={styles.closeIcon}>
                            <FontAwesomeIcon icon={faTimes} style={{ fontSize: '8px' }} />
                        </div>
                        <FontAwesomeIcon icon={faImage} className={styles.icon} />
                    </div>
                ))}
            </div>
        </section>
    );
};
