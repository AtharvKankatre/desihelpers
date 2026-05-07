import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/PageLoader.module.css";

export const PageLoader: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Show loader only for prioritized pages
        const handleStart = (url: string) => {
            const prioritizedRoutes = ['/jobs', '/seekers', '/profile', '/Messages', '/user_profile', '/admin'];
            const basePath = url.split('?')[0]; 
            const shouldShowLoader = prioritizedRoutes.some(route => basePath.startsWith(route));

            if (url !== router.asPath && shouldShowLoader) {
                setLoading(true);
            }
        };

        const handleComplete = () => {
            setLoading(false);
        };

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        };
    }, [router.events, router.asPath]);

    return (
        <div className={`${styles.loaderOverlay} ${loading ? styles.loaderOverlayActive : ""}`}>
            <div className={styles.loaderContent}>
                {/* ── Skeleton Nav Bar ── */}
                <div className={styles.skeletonNav}>
                    <div className={`${styles.skeletonBone} ${styles.skeletonNavLogo}`} />
                    <div className={`${styles.skeletonBone} ${styles.skeletonNavLink}`} />
                    <div className={`${styles.skeletonBone} ${styles.skeletonNavLink}`} />
                    <div className={`${styles.skeletonBone} ${styles.skeletonNavLink}`} />
                    <div className={`${styles.skeletonBone} ${styles.skeletonNavAvatar}`} />
                </div>

                {/* ── Hero Banner ── */}
                <div className={styles.skeletonHero}>
                    <div className={`${styles.skeletonBone} ${styles.skeletonHeroBanner}`} />
                </div>

                {/* ── Body Content ── */}
                <div className={styles.skeletonBody}>
                    <div className={`${styles.skeletonBone} ${styles.skeletonSectionTitle}`} />

                    <div className={styles.skeletonCardGrid}>
                        {[0, 1, 2, 3].map((i) => (
                            <div className={styles.skeletonCard} key={i}>
                                <div className={`${styles.skeletonBone} ${styles.skeletonCardImage}`} />
                                <div className={styles.skeletonCardBody}>
                                    <div className={`${styles.skeletonBone} ${styles.skeletonCardTitle}`} />
                                    <div className={`${styles.skeletonBone} ${styles.skeletonCardText}`} />
                                    <div className={`${styles.skeletonBone} ${styles.skeletonCardTextShort}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
