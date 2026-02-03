import React from "react";
import { useRouter } from "next/router";
import styles from "@/styles/PopularServices.module.css";

// Sample data for popular services - mix of jobs, helpers, and ads
import JobServices from "@/services/jobs/JobService";
import SeekerServices from "@/services/seekers/SeekerService";
import { IJobs } from "@/models/Jobs";
import { IUserProfileModel } from "@/models/UserProfileModel";

// Interface for the combined service item
interface IServiceItem {
    id: string | number;
    type: "job" | "helper" | "ad";
    title?: string; // For jobs
    name?: string; // For helpers
    description?: string; // For jobs
    location?: string;
    date?: string; // For jobs
    rate?: string; // For jobs
    image?: string;
    urgent?: boolean; // For jobs
    skills?: string[]; // For helpers
}

// Skill icon mapping
const skillIcons: { [key: string]: string } = {
    babysitting: "👶",
    cooking: "🍳",
    cleaning: "🧹",
    tutoring: "📚",
};

// Fallback static data
const fallbackServices: IServiceItem[] = [
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
        image: "/assets/helpers/sukhreet-kaur-1.png",
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
        image: "/assets/illustrations/tiffin.png",
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
        image: "/assets/helpers/sukhreet-kaur-2.jpg",
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
        image: "/assets/helpers/sukhreet-kaur-1.png",
        skills: ["babysitting", "cooking", "cleaning", "tutoring"],
    },
];

export const PopularServicesSection: React.FC = () => {
    const router = useRouter();
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = React.useState(false);
    const [services, setServices] = React.useState<IServiceItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const jobService = new JobServices();
    const seekerService = new SeekerServices();

    const handleSignIn = () => {
        router.push("/Login");
    };

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch data in parallel
                const [jobs, seekers] = await Promise.all([
                    jobService.fetchLandingPageJobs(),
                    seekerService.fetchLandingPageSeekers()
                ]);

                // Map Jobs to IServiceItem
                const mappedJobs: IServiceItem[] = jobs.map((job: IJobs) => ({
                    id: job._id || Math.random(),
                    type: "job",
                    title: job.jobType?.name || "Job",
                    description: job.aboutRequirement || "No description available",
                    location: `${job.city || "Unknown"}, ${job.state || ""}`,
                    date: job.startDate ? new Date(job.startDate).toLocaleDateString() : (job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Date N/A"),
                    rate: job.payRange ? `$${job.payRange}` : "Rate Negotiable",
                    image: "/assets/illustrations/nanny.png", // Fallback image or dynamic if available
                    urgent: job.urgent || false
                }));

                // Map Seekers to IServiceItem
                const mappedSeekers: IServiceItem[] = seekers.map((seeker: IUserProfileModel) => ({
                    id: seeker._id || Math.random(),
                    type: "helper",
                    name: `${seeker.firstName} ${seeker.lastName}`,
                    location: `${seeker.city || "Unknown"}, ${seeker.state || ""}`,
                    image: seeker.profilePhoto || "/assets/helpers/sukhreet-kaur-1.png",
                    skills: ["babysitting", "cooking"] // Logic to map real skills can be improved later
                }));

                // Interleave or combine them
                // For now, let's just concatenate or mix them
                const combined = [...mappedJobs, ...mappedSeekers];

                // Set data or fallback
                if (combined.length > 0) {
                    setServices(combined);
                } else {
                    setServices(fallbackServices);
                }

            } catch (error) {
                console.error("Error fetching popular services:", error);
                setServices(fallbackServices);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Use services state if available, otherwise fallback (or empty)
    // Duplicate cards for infinite scroll effect (x4)
    const displayServices = services.length > 0 ? services : [];
    const infiniteServices = [...displayServices, ...displayServices, ...displayServices, ...displayServices];

    return (
        <section className={styles.popularSection}>
            <div className={styles.container}>
                {/* Section Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Popular Services</h2>
                    <p className={styles.subtitle}>Trending Jobs and Top rated Helpers</p>
                </div>

                {/* Cards Grid - CSS Marquee */}
                <div className={styles.cardsGrid}>
                    <div className={styles.marqueeTrack}>
                        {infiniteServices.length > 0 ? infiniteServices.map((item, index) => (
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
                                            {item.skills?.map((skill, idx) => (
                                                <span key={idx} className={styles.skillIcon}>
                                                    {skillIcons[skill] || "✨"}
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
                        )) : (
                            <div style={{ padding: '20px', textAlign: 'center', width: '100%', color: '#666' }}>
                                Loading popular services...
                            </div>
                        )}
                    </div>
                </div>

                {/* Sign In Button */}
                <div className={styles.ctaContainer}>
                    <button className={styles.signInButton} onClick={handleSignIn}>
                        Sign In for More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PopularServicesSection;
