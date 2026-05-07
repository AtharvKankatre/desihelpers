import React from "react";
import styles from "@/styles/PageLoader.module.css";

type Props = {
    text?: string;
    inline?: boolean;
};

export const CSpinner: React.FC<Props> = ({ text = "Loading", inline = false }) => {
    return (
        <div className={inline ? styles.inlineLoaderContent : styles.loaderContent}>
            {/* Skeleton row 1 */}
            <div className={styles.skeletonRow}>
                <div className={`${styles.skeletonBone} ${styles.skeletonCircle}`} />
                <div className={styles.skeletonLines}>
                    <div className={`${styles.skeletonBone} ${styles.skeletonLine} ${styles.skeletonLineLong}`} />
                    <div className={`${styles.skeletonBone} ${styles.skeletonLine} ${styles.skeletonLineMed}`} />
                </div>
            </div>

            {/* Skeleton row 2 */}
            <div className={styles.skeletonRow}>
                <div className={`${styles.skeletonBone} ${styles.skeletonCircle}`} />
                <div className={styles.skeletonLines}>
                    <div className={`${styles.skeletonBone} ${styles.skeletonLine} ${styles.skeletonLineMed}`} />
                    <div className={`${styles.skeletonBone} ${styles.skeletonLine} ${styles.skeletonLineShort}`} />
                </div>
            </div>

            {/* Skeleton row 3 */}
            <div className={styles.skeletonRow}>
                <div className={`${styles.skeletonBone} ${styles.skeletonCircle}`} />
                <div className={styles.skeletonLines}>
                    <div className={`${styles.skeletonBone} ${styles.skeletonLine} ${styles.skeletonLineLong}`} />
                    <div className={`${styles.skeletonBone} ${styles.skeletonLine} ${styles.skeletonLineShort}`} />
                </div>
            </div>
        </div>
    );
};
