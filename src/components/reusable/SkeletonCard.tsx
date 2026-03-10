import React from 'react';
import styles from '@/styles/Skeleton.module.css';

interface SkeletonCardProps {
    count?: number;
    showAvatar?: boolean;
}

// PERF: Reusable skeleton card component for loading states (shimmer effect)
const SkeletonCard: React.FC<{ showAvatar?: boolean }> = ({ showAvatar = true }) => (
    <div className={styles.skeletonCard}>
        {showAvatar && (
            <div className={styles.skeletonRow}>
                <div className={styles.skeletonAvatar} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className={styles.skeletonTitle} />
                    <div className={styles.skeletonTextShort} />
                </div>
            </div>
        )}
        <div className={styles.skeletonText} />
        <div className={styles.skeletonText} />
        <div className={styles.skeletonTextShort} />
        <div className={styles.skeletonRow}>
            <div className={styles.skeletonButton} />
        </div>
    </div>
);

// PERF: Grid of skeleton cards matching the job/profile listing layout
export const SkeletonGrid: React.FC<SkeletonCardProps> = ({ count = 6, showAvatar = true }) => (
    <div className={styles.skeletonGrid}>
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} showAvatar={showAvatar} />
        ))}
    </div>
);

// PERF: Wrapper to add fade-in animation when content loads
export const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={styles.fadeIn}>
        {children}
    </div>
);

export default SkeletonCard;
