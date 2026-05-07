import React from "react";
import { useRouter } from "next/router";
import styles from "@/styles/CTASection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useTranslation from "next-translate/useTranslation";

interface CTASectionProps {
    sx?: React.CSSProperties;
    className?: string;
    variant?: 'default' | 'blue';
}

export const CTASection: React.FC<CTASectionProps> = ({ sx, className, variant = 'default' }) => {
    const router = useRouter();
    const { t } = useTranslation('common');

    const handleJoinCommunity = () => {
        router.push("/Login?mode=signup");
    };

    return (
        <section className={`${styles.section} ${variant === 'blue' ? styles.blueVariant : ''} ${className || ''}`} style={sx}>
            <div className={styles.container}>
                <div className={styles.contentColumn}>
                    <h2 className={styles.heading}>{t('cta.heading')}</h2>
                    <p className={styles.description}>
                        {t('cta.description')}
                    </p>
                </div>
                <div className={styles.buttonColumn}>
                    <button className={styles.ctaButton} onClick={handleJoinCommunity}>{t('cta.button')}</button>
                </div>
            </div>
        </section>
    );
};
