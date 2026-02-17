import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/PopularServices.module.css";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { IJobs } from "@/models/Jobs";
import { IUserProfileModel } from "@/models/UserProfileModel";

// Sample data for popular services - fallback if API fails
const fallbackServices = [
    {
        id: 1,
        type: "job",
        title: "Nanny",
        description: "Nanny for 3-month-old baby",
        location: "Bothell, Washington",
        date: "Mon 25, 2025",
        rate: "$25-$35 / hr",
        image: "/assets/illustrations/nanny.png",
        urgent: true,
    },
    {
        id: 2,
        type: "helper",
        name: "Sukhreet Kaur",
        location: "Bothell, Washington",
        image: "/assets/helpers/helper1.jpg",
        skills: ["babysitting", "cooking", "cleaning", "tutoring"],
    },
    {
        id: 3,
        type: "job",
        title: "Tiffin",
        description: "Looking for Maharashtrian food",
        location: "Oakland, California",
        date: "Oct 1, 2025",
        rate: "$15-$20 / meal",
        image: "https://cdn-icons-png.flaticon.com/512/3014/3014520.png",
        urgent: true,
    },
    {
        id: 4,
        type: "job",
        title: "Cake Bakers",
        description: "Cake Bakers Services",
        location: "Adair County, Kentucky",
        date: "Sep 19, 2025",
        rate: "$25-$35 / hr",
        image: "/assets/illustrations/cake_bakers.png",
        urgent: true,
    },
    {
        id: 5,
        type: "helper",
        name: "Sukhreet Kaur",
        location: "Bothell, Washington",
        image: "/assets/helpers/helper2.jpg",
        skills: ["babysitting", "cooking", "cleaning", "tutoring"],
    },
    {
        id: 6,
        type: "job",
        title: "Servers",
        description: "need servers to serve in party",
        location: "Morrisville, Pennsylvania",
        date: "Jul 1, 2025",
        rate: "$15-$25 / hr",
        image: "/assets/illustrations/servers.png",
        urgent: true,
    },
    {
        id: 7,
        type: "helper",
        name: "Sukhreet Kaur",
        location: "Bothell, Washington",
        image: "/assets/helpers/helper3.jpg",
        skills: ["babysitting", "cooking", "cleaning", "tutoring"],
    },
];

// Skill icon mapping
const skillIcons: { [key: string]: string } = {
    babysitting: "👶",
    cooking: "🍳",
    cleaning: "🧹",
    tutoring: "📚",
};

import { Routes } from "@/services/routes/Routes";
import { useAuth } from "@/services/authorization/AuthContext";
import CookieService from "@/services/authorization/CookieService";

// ... existing imports ...

export const PopularServicesSection: React.FC = () => {
    const router = useRouter();
    const { isActive, setIsActive } = useAuth();
    const [popularServices, setPopularServices] = useState<any[]>(fallbackServices);
    const [isPaused, setIsPaused] = useState(false);

    // Force check login status on mount to ensure button visibility is correct
    useEffect(() => {
        const checkLogin = () => {
            const token = CookieService.accessToken();
            // If token exists but context says not active, update context
            if (token && !isActive) {
                setIsActive(true);
            }
        };
        checkLogin();
        // Also listen for event in case it changes while on this page
        window.addEventListener("isActiveChanged", checkLogin);
        return () => window.removeEventListener("isActiveChanged", checkLogin);
    }, [isActive, setIsActive]);

    useEffect(() => {
        const fetchPopularContent = async () => {
            try {
                console.log("Using API Base URL:", process.env.NEXT_PUBLIC_API_URL);
                // Fetch both jobs and seekers
                const [jobsRes, seekersRes] = await Promise.all([
                    ApiService.crud(APIDetails.getJobs, ""),
                    ApiService.crud(APIDetails.getSeekers, "")
                ]);

                console.log("API Response Jobs:", jobsRes);
                console.log("API Response Seekers:", seekersRes);

                let combinedRes: any[] = [];

                if (jobsRes[0] && jobsRes[1]) {
                    const apiJobs = jobsRes[1].slice(0, 4).map((job: IJobs) => ({
                        id: `job-${job._id || job.id}`,
                        type: "job",
                        title: job.jobType?.name || job.subCategory || "Job Opportunity",
                        description: job.aboutRequirement || "Looking for help",
                        location: `${job.city || ""}, ${job.state || ""}`.trim() || "Location specified",
                        date: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently",
                        rate: job.payRange || "-",
                        image: job.jobType?.image || "/assets/illustrations/nanny.png",
                        urgent: job.urgent || false,
                    }));
                    combinedRes = [...combinedRes, ...apiJobs];
                }

                if (seekersRes[0] && seekersRes[1]) {
                    const apiSeekers = seekersRes[1].slice(0, 3).map((seeker: IUserProfileModel) => ({
                        id: `seeker-${seeker._id || seeker.id}`,
                        type: "helper",
                        name: seeker.displayName || `${seeker.firstName || ""} ${seeker.lastName || ""}`.trim() || "Helper",
                        location: `${seeker.city || ""}, ${seeker.state || ""}`.trim() || "Location specified",
                        image: seeker.profilePhoto || "/assets/helpers/helper1.jpg",
                        skills: seeker.jobDetails?.map((jd: any) => jd.jobType).filter(Boolean).slice(0, 4) || ["babysitting", "cooking"]
                    }));
                    combinedRes = [...combinedRes, ...apiSeekers];
                }

                if (combinedRes.length > 0) {
                    // Try to alternate if possible, or just shuffle/sort
                    setPopularServices(combinedRes);
                }
            } catch (error) {
                console.error("Error fetching popular services:", error);
            }
        };

        fetchPopularContent();
    }, []);

    const handleRegister = () => {
        router.push(Routes.register);
    };

    // Duplicate services for infinite scroll
    const infiniteServices = [...popularServices, ...popularServices];

    return (
        <section className={styles.popularSection}>
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Popular Services</h2>
                    <p className={styles.subtitle}>Trending Jobs and Top rated Helpers</p>
                </div>

                {/* Cards Grid (Infinite Scroll) */}
                <div
                    className={`${styles.cardsWrapper} ${isPaused ? styles.paused : ""}`}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                >
                    <div className={styles.cardsContainer}>
                        {infiniteServices.map((item, index) => (
                            <div key={`${item.id}-${index}`} className={styles.card}>
                                {/* Job Card */}
                                {item.type === "job" && (
                                    <>
                                        {item.urgent && <span className={styles.urgentBadge}>URGENT</span>}
                                        <div className={styles.jobImageContainer}>
                                            <img src={item.image} alt={item.title} className={styles.jobImage} />
                                        </div>
                                        <h3 className={styles.cardTitle}>{item.title}</h3>
                                        <p className={styles.cardDescription}>{item.description}</p>
                                        <div className={styles.cardLocation}>
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                            {item.location}
                                        </div>
                                        <div className={styles.cardFooter}>
                                            <span className={styles.cardDate}>{item.date}</span>
                                            <span className={styles.cardRate}>{item.rate}</span>
                                        </div>
                                        <div className={styles.skillIcons}>
                                            {Object.values(skillIcons).map((icon, idx) => (
                                                <span key={idx} className={styles.skillIcon}>{icon}</span>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Helper Card */}
                                {item.type === "helper" && (
                                    <>
                                        <div className={styles.helperImageContainer}>
                                            <img src={item.image} alt={item.name} className={styles.helperImage} />
                                        </div>
                                        <h3 className={styles.cardTitle}>{item.name}</h3>
                                        <div className={styles.cardLocation}>
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                            {item.location}
                                        </div>
                                        <div className={styles.skillIcons}>
                                            {item.skills?.map((skill: string, idx: number) => (
                                                <span key={idx} className={styles.skillIcon}>
                                                    {skillIcons[skill.toLowerCase()] || "✨"}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Advertisement Card */}
                                {item.type === "ad" && (
                                    <>
                                        <span className={styles.advtBadge}>ADVT</span>
                                        <div className={styles.adContainer}>
                                            <div className={styles.adPlaceholder}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21,15 16,10 5,21" />
                                                </svg>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Register / Explore Section - Only for non-logged in users */}
                {!isActive && (
                    <div className={styles.ctaContainer}>
                        <div className={styles.ctaContent}>
                            <a href={Routes.viewAllJobs} className={styles.exploreLink}>
                                Explore available jobs Now
                            </a>
                            <button className={styles.registerButton} onClick={handleRegister}>
                                Register Now
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PopularServicesSection;
