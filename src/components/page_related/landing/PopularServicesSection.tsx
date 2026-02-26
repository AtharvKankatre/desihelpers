import React, { useEffect, useState, useRef, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "@/styles/PopularServices.module.css";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { IJobs } from "@/models/Jobs";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { getOptimizedIcon } from "@/utils/iconMapping";
import { Routes } from "@/services/routes/Routes";
import { useAuth } from "@/services/authorization/AuthContext";
import CookieService from "@/services/authorization/CookieService";
import Swal from "sweetalert2";

// Default skill icons shown on each card
const DEFAULT_SKILL_KEYS = ["nanny", "catering", "cleaning", "movers"];

// Fallback services (mixed jobs + helpers)
const fallbackServices = [
    {
        id: 1, type: "job",
        title: "Nanny",
        description: "Nanny for 3-month-old baby",
        location: "Bothell, Washington",
        date: "Mon 25, 2025",
        rate: "$25-$35 / hr",
        image: "/assets/icons/categories/nanny.svg",
        urgent: true,
        skillKeys: ["nanny", "catering", "cleaning", "movers"],
    },
    {
        id: 2, type: "helper",
        name: "Helper",
        location: "Bothell, Washington",
        image: null,
        skills: ["babysitting", "cooking", "cleaning", "tutoring"],
    },
    {
        id: 3, type: "job",
        title: "Cake Bakers",
        description: "Cake Bakers Services",
        location: "Adair County, Kentucky",
        date: "Sep 19, 2025",
        rate: "$25-$35 / hr",
        image: "/assets/icons/categories/baker.svg",
        urgent: true,
        skillKeys: ["cake bakers", "catering", "servers", "movers"],
    },
    {
        id: 4, type: "helper",
        name: "Helper",
        location: "Bothell, Washington",
        image: null,
        skills: ["babysitting", "cooking", "cleaning", "tutoring"],
    },
    {
        id: 5, type: "job",
        title: "Servers",
        description: "Need servers to serve in party",
        location: "Morrisville, Pennsylvania",
        date: "Jul 1, 2025",
        rate: "$15-$25 / hr",
        image: "/assets/icons/categories/server.svg",
        urgent: true,
        skillKeys: ["servers", "catering", "nanny", "movers"],
    },
    {
        id: 6, type: "helper",
        name: "Helper",
        location: "Bothell, Washington",
        image: null,
        skills: ["babysitting", "cooking", "cleaning", "tutoring"],
    },
];

export const PopularServicesSection: React.FC = () => {
    const router = useRouter();
    const { isActive, setIsActive } = useAuth();
    const [popularServices, setPopularServices] = useState<any[]>(fallbackServices);

    // Drag-to-scroll refs
    const carouselRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const velocity = useRef(0);
    const lastX = useRef(0);
    const lastTime = useRef(0);
    const animFrameId = useRef<number>(0);
    const hasDragged = useRef(false);

    useEffect(() => {
        const checkLogin = () => {
            const token = CookieService.accessToken();
            if (token && !isActive) setIsActive(true);
        };
        checkLogin();
        window.addEventListener("isActiveChanged", checkLogin);
        return () => window.removeEventListener("isActiveChanged", checkLogin);
    }, [isActive, setIsActive]);

    useEffect(() => {
        const fetchPopularContent = async () => {
            try {
                const [jobsRes, seekersRes] = await Promise.all([
                    ApiService.crud(APIDetails.getJobs, ""),
                    ApiService.crud(APIDetails.getSeekers, "")
                ]);

                const apiJobs: any[] = [];
                const apiSeekers: any[] = [];

                if (jobsRes[0] && jobsRes[1] && jobsRes[1].length > 0) {
                    jobsRes[1].slice(0, 5).forEach((job: IJobs) => {
                        const jobTypeName = job.jobType?.name || job.subCategory || "";
                        apiJobs.push({
                            id: `job-${job._id || job.id}`,
                            type: "job",
                            title: jobTypeName || "Job Opportunity",
                            description: job.aboutRequirement || "Looking for help",
                            location: `${job.city || ""}, ${job.state || ""}`.trim() || "Location not specified",
                            date: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently",
                            rate: job.payRange || "-",
                            image: getOptimizedIcon(jobTypeName),
                            urgent: job.urgent || false,
                            skillKeys: [jobTypeName?.toLowerCase() || "nanny", "catering", "cleaning", "movers"],
                        });
                    });
                }

                if (seekersRes[0] && seekersRes[1] && seekersRes[1].length > 0) {
                    seekersRes[1].slice(0, 3).forEach((seeker: IUserProfileModel) => {
                        apiSeekers.push({
                            id: `seeker-${seeker._id || seeker.id}`,
                            type: "helper",
                            name: seeker.displayName || `${seeker.firstName || ""} ${seeker.lastName || ""}`.trim() || "Helper",
                            location: `${seeker.city || ""}, ${seeker.state || ""}`.trim() || "Location not specified",
                            image: seeker.profilePhoto || null,
                            skills: seeker.jobDetails?.map((jd: any) => jd.jobType).filter(Boolean).slice(0, 4) || ["babysitting", "cooking"],
                        });
                    });
                }

                // Interleave jobs and helpers
                if (apiJobs.length > 0 || apiSeekers.length > 0) {
                    const combined: any[] = [];
                    const maxLen = Math.max(apiJobs.length, apiSeekers.length);
                    for (let i = 0; i < maxLen; i++) {
                        if (apiJobs[i]) combined.push(apiJobs[i]);
                        if (apiSeekers[i]) combined.push(apiSeekers[i]);
                    }
                    setPopularServices(combined);
                }
            } catch (error) {
                console.error("Error fetching popular services:", error);
            }
        };
        fetchPopularContent();
    }, []);

    // Drag handlers
    const handlePointerDown = (clientX: number) => {
        if (!carouselRef.current) return;
        isDragging.current = true;
        hasDragged.current = false;
        startX.current = clientX;
        scrollLeft.current = carouselRef.current.scrollLeft;
        lastX.current = clientX;
        lastTime.current = Date.now();
        velocity.current = 0;
        cancelAnimationFrame(animFrameId.current);
        carouselRef.current.style.cursor = "grabbing";
    };

    const handlePointerMove = (clientX: number) => {
        if (!isDragging.current || !carouselRef.current) return;
        const dx = clientX - startX.current;
        if (Math.abs(dx) > 3) hasDragged.current = true;
        carouselRef.current.scrollLeft = scrollLeft.current - dx;
        const now = Date.now();
        const dt = now - lastTime.current;
        if (dt > 0) velocity.current = (clientX - lastX.current) / dt;
        lastX.current = clientX;
        lastTime.current = now;
    };

    const handlePointerUp = () => {
        if (!isDragging.current || !carouselRef.current) return;
        isDragging.current = false;
        carouselRef.current.style.cursor = "grab";
        const el = carouselRef.current;
        let v = velocity.current * 15;
        const glide = () => {
            if (Math.abs(v) < 0.5) return;
            el.scrollLeft -= v;
            v *= 0.95;
            animFrameId.current = requestAnimationFrame(glide);
        };
        glide();
    };

    const handleCardClick = () => {
        if (hasDragged.current) return;
        if (!isActive) {
            Swal.fire({
                title: "Alert",
                text: "Please login to view details",
                icon: "warning",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) router.push("/Login");
            });
        } else {
            router.push(Routes.mapSearch);
        }
    };

    const renderSkillIcons = (skillKeys: string[]) => (
        <div className={styles.skillIcons}>
            {skillKeys.slice(0, 4).map((key, idx) => (
                <span key={idx} className={styles.skillIcon} title={key}>
                    <Image
                        src={getOptimizedIcon(key)}
                        alt={key}
                        width={22}
                        height={22}
                        style={{ objectFit: "contain" }}
                        unoptimized={true}
                        draggable={false}
                    />
                </span>
            ))}
        </div>
    );

    const renderJobCard = (item: any, index: number) => (
        <div key={`${item.id}-${index}`} className={styles.card} onClick={handleCardClick}>
            {item.urgent && <span className={styles.urgentBadge}>URGENT</span>}
            <div className={styles.cardImageArea}>
                <Image
                    src={item.image}
                    alt={item.title}
                    width={90}
                    height={90}
                    style={{ objectFit: "contain" }}
                    unoptimized={true}
                    draggable={false}
                />
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
            {renderSkillIcons(item.skillKeys || DEFAULT_SKILL_KEYS)}
        </div>
    );

    const renderHelperCard = (item: any, index: number) => (
        <div key={`${item.id}-${index}`} className={`${styles.card} ${styles.helperCard}`} onClick={handleCardClick}>
            <div className={styles.helperImageArea}>
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        width={260}
                        height={140}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        unoptimized={true}
                        draggable={false}
                    />
                ) : (
                    <Image
                        src="/assets/helpers/sukhreet-kaur-1.png"
                        alt={item.name}
                        width={260}
                        height={140}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        unoptimized={true}
                        draggable={false}
                    />
                )}
            </div>
            <h3 className={`${styles.cardTitle} ${styles.helperName}`}>{item.name}</h3>
            <div className={styles.cardLocation}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {item.location}
            </div>
            {renderSkillIcons(item.skills?.length > 0 ? item.skills : DEFAULT_SKILL_KEYS)}
        </div>
    );

    return (
        <section className={styles.popularSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Popular Services</h2>
                    <p className={styles.subtitle}>Trending Jobs and Top rated Helpers</p>
                </div>

                <div className={styles.carouselWrapper}>
                    <div
                        ref={carouselRef}
                        className={styles.carouselTrack}
                        onMouseDown={(e) => { e.preventDefault(); handlePointerDown(e.clientX); }}
                        onMouseMove={(e) => handlePointerMove(e.clientX)}
                        onMouseUp={handlePointerUp}
                        onMouseLeave={() => { if (isDragging.current) handlePointerUp(); }}
                        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
                        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
                        onTouchEnd={handlePointerUp}
                    >
                        {popularServices.map((item, index) =>
                            item.type === "helper"
                                ? renderHelperCard(item, index)
                                : renderJobCard(item, index)
                        )}
                    </div>
                </div>

                <div className={styles.ctaContainer}>
                    <div className={styles.ctaContent}>
                        {!isActive ? (
                            <button
                                className={styles.registerButton}
                                onClick={() => router.push(Routes.login)}
                            >
                                Sign In
                            </button>
                        ) : (
                            <button
                                className={styles.registerButton}
                                onClick={() => router.push(Routes.viewAllJobs)}
                            >
                                Explore All Jobs
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default memo(PopularServicesSection);
