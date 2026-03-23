import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/PageLoader.module.css";
import Image from "next/image";

export const PageLoader: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Show loader only for Find Job (/jobs) and Hire Help (/seekers) pages
        const handleStart = (url: string) => {
            const prioritizedRoutes = ['/jobs', '/seekers', '/profile', '/Messages', '/user_profile', '/admin'];
            const shouldShowLoader = prioritizedRoutes.some(route => url.startsWith(route));

            if (url !== router.asPath && shouldShowLoader) {
                setLoading(true);
            }
        };

        let timeoutId: NodeJS.Timeout;
        const handleComplete = () => {
            timeoutId = setTimeout(() => {
                setLoading(false);
            }, 800); // 800ms purposeful delay ensures underlying data fetches have time to resolve, preventing empty-screen flashing
        };

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [router]);

    return (
        <div className={`${styles.loaderOverlay} ${loading ? styles.loaderOverlayActive : ""}`}>
            <div className={styles.loaderContent}>
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
                    Loading
                    <div className={styles.dots} style={{ display: 'inline-flex', gap: '2px' }}>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
