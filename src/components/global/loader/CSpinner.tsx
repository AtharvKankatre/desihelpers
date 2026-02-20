import React from "react";
import Image from "next/image";
import styles from "@/styles/PageLoader.module.css";

type Props = {
    text?: string;
    inline?: boolean;
};

export const CSpinner: React.FC<Props> = ({ text = "Loading", inline = false }) => {
    return (
        <div className={inline ? styles.inlineLoaderContent : styles.loaderContent}>
            <div className={styles.spinnerRing}>
                {/* Central Logo */}
                <div style={{ position: 'relative', width: '50px', height: '50px' }}>
                    <Image
                        src="/DesiHelpers_colored.svg"
                        alt="DesiHelpers Loading"
                        fill
                        style={{ objectFit: 'contain' }}
                        className={styles.logoImage}
                        priority
                    />
                </div>
            </div>

            {/* Loading text with animated dots */}
            <div className={styles.loaderText}>
                {text}
                <div className={styles.dots} style={{ display: 'inline-flex', gap: '2px' }}>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </div>
            </div>
        </div>
    );
};
