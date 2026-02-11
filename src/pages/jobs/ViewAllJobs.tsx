import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import withAuth from "@/services/authorization/ProfileService";
import { IJobs } from "@/models/Jobs";
import JobServices from "@/services/jobs/JobService";
import { useAuth } from "@/services/authorization/AuthContext";
import { MapRadius } from "@/constants/EMapRadius";
import { Routes } from "@/services/routes/Routes";
import { IJobCategories, ISubCategory } from "@/models/JobCategories";
import { userProfileStore } from "@/stores/UserProfileStore";
import styles from "@/styles/ViewAllJobs.module.css";

// Sort direction type
type SortDir = "asc" | "desc" | null;
type SortKey = "jobType" | "workType" | "startDate" | "urgent" | "cityState" | "distance" | "postedBy";

const ViewAllJobs = () => {
    const router = useRouter();
    const { jobCategories } = useAuth();
    const userProfile = userProfileStore((state) => state.userProfile);

    // Data state
    const [allJobs, setAllJobs] = useState<IJobs[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // View mode: 'table' (grid icon) or 'card' (list/hamburger icon)
    const [viewMode, setViewMode] = useState<"table" | "card">("table");

    // View type: 'jobs' or 'seekers'
    const [viewType, setViewType] = useState<"jobs" | "seekers">("jobs");

    // Sample seeker data
    const sampleSeekers = [
        { id: "sk1", name: "Shrutika Patil", rating: 4.5, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Bhopal", country: "India", languages: ["English", "Hindi"], services: ["Music teacher", "Event planning"] },
        { id: "sk2", name: "Dipali Khedekar", rating: 4, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Maharashtra", country: "India", languages: ["English", "Marathi", "Hindi"], services: ["Music teacher", "Event planning"] },
        { id: "sk3", name: "Amit More", rating: 4, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Bhopal", country: "India", languages: ["Hindi"], services: ["Music teacher", "Event planning"] },
        { id: "sk4", name: "Neelam Mane", rating: 4.5, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Bhopal", country: "India", languages: ["English", "Hindi"], services: ["Music teacher", "Event planning"] },
        { id: "sk5", name: "Abhishek Bajaj", rating: 5, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Bhopal", country: "India", languages: ["English", "Hindi"], services: ["Music teacher", "Event planning"] },
        { id: "sk6", name: "Priya Sharma", rating: 4, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Delhi", country: "India", languages: ["English", "Hindi"], services: ["Music teacher", "Event planning"] },
    ];

    // Filter state
    const [locationSearch, setLocationSearch] = useState("");
    const [workTypeFilter, setWorkTypeFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [subCategoryFilter, setSubCategoryFilter] = useState("");
    const [radiusFilter, setRadiusFilter] = useState(50);
    const [searchQuery, setSearchQuery] = useState("");

    // Sort state
    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>(null);

    // Sub-categories based on selected category
    const subCategories: ISubCategory[] = useMemo(() => {
        if (!categoryFilter) return [];
        const cat = jobCategories?.find((c: IJobCategories) => c.name === categoryFilter);
        return cat?.subCategories ?? [];
    }, [categoryFilter, jobCategories]);

    // Job service instance (must be at component level since it uses Zustand hooks)
    const jobServices = new JobServices();

    // Sample data matching the reference screenshot
    const sampleJobs: IJobs[] = [
        { _id: "s1", jobType: { name: "Mother's Helper" } as any, workType: "Part Time", startDate: new Date("2025-10-20"), urgent: true, city: "Oakland", state: "California", distance: 2.5, userProfile: { displayName: "kaka" } as any },
        { _id: "s2", jobType: { name: "Nanny" } as any, workType: "Full time", startDate: new Date("2025-10-12"), urgent: true, city: "Issaquah", state: "Washington", distance: 1.5, userProfile: { displayName: "Neha" } as any },
        { _id: "s3", jobType: { name: "Gardener" } as any, workType: "Part Time", startDate: new Date("2025-10-21"), urgent: true, city: "Austin", state: "Texas", distance: 1.2, userProfile: { displayName: "Anil & Ridhika" } as any },
        { _id: "s4", jobType: { name: "Mother's Helper" } as any, workType: "Full time", startDate: new Date("2025-10-18"), urgent: true, city: "Miami", state: "Florida", distance: 1.2, userProfile: { displayName: "Julia Martinez" } as any },
        { _id: "s5", jobType: { name: "Mother's Helper" } as any, workType: "Part Time", startDate: new Date("2025-08-20"), urgent: true, city: "Los Angeles", state: "California", distance: 2.2, userProfile: { displayName: "Jose Ramirez" } as any },
        { _id: "s6", jobType: { name: "Gardener" } as any, workType: "Part Time", startDate: new Date("2025-10-18"), urgent: true, city: "Austin", state: "Texas", distance: 2.1, userProfile: { displayName: "Sarah Johnson" } as any },
        { _id: "s7", jobType: { name: "Nanny" } as any, workType: "Full time", startDate: new Date("2025-08-20"), urgent: true, city: "Oakland", state: "California", distance: 1.8, userProfile: { displayName: "kaka" } as any },
        { _id: "s8", jobType: { name: "Mother's Helper" } as any, workType: "Full time", startDate: new Date("2025-10-12"), urgent: true, city: "Oakland", state: "California", distance: 1.5, userProfile: { displayName: "Mark & Lisa" } as any },
        { _id: "s9", jobType: { name: "House Cleaner" } as any, workType: "Part Time", startDate: new Date("2025-10-18"), urgent: true, city: "Austin", state: "Texas", distance: 2.5, userProfile: { displayName: "Julia Martinez" } as any },
        { _id: "s10", jobType: { name: "Nanny" } as any, workType: "Full time", startDate: new Date("2025-10-21"), urgent: true, city: "Oakland", state: "California", distance: 2.5, userProfile: { displayName: "Sarah Johnson" } as any },
        { _id: "s11", jobType: { name: "Gardener" } as any, workType: "Full time", startDate: new Date("2025-08-20"), urgent: true, city: "Denver", state: "Colorado", distance: 2.5, userProfile: { displayName: "kaka" } as any },
        { _id: "s12", jobType: { name: "Mother's Helper" } as any, workType: "Full time", startDate: new Date("2025-10-18"), urgent: true, city: "Miami", state: "Florida", distance: 2.5, userProfile: { displayName: "Jose Ramirez" } as any },
        { _id: "s13", jobType: { name: "House Cleaner" } as any, workType: "Part Time", startDate: new Date("2025-10-12"), urgent: true, city: "Austin", state: "Texas", distance: 2.5, userProfile: { displayName: "kaka" } as any },
        { _id: "s14", jobType: { name: "Elder Caregiver" } as any, workType: "Part Time", startDate: new Date("2025-10-21"), urgent: true, city: "New York", state: "New York", distance: 1.5, userProfile: { displayName: "Megan Lee" } as any },
        { _id: "s15", jobType: { name: "Nanny" } as any, workType: "Part Time", startDate: new Date("2025-10-18"), urgent: true, city: "Austin", state: "Texas", distance: 1.2, userProfile: { displayName: "kaka" } as any },
        { _id: "s16", jobType: { name: "Gardener" } as any, workType: "Part Time", startDate: new Date("2025-08-20"), urgent: true, city: "Oakland", state: "California", distance: 2.3, userProfile: { displayName: "Mark & Lisa" } as any },
        { _id: "s17", jobType: { name: "Mother's Helper" } as any, workType: "Part Time", startDate: new Date("2025-10-21"), urgent: true, city: "Miami", state: "Florida", distance: 1.1, userProfile: { displayName: "Sarah Johnson" } as any },
    ];

    // Fetch jobs
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const jobs = await jobServices.fetchJobs({
                    state: userProfile?.state ?? "",
                    radius: radiusFilter,
                    limit: 500,
                });
                setAllJobs(jobs.length > 0 ? jobs : sampleJobs);
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
                setAllJobs(sampleJobs);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [radiusFilter]);

    // Helper: format date as "20 Oct, 2025"
    const formatDate = (date?: Date) => {
        if (!date) return "-";
        const d = new Date(date);
        const day = d.getDate();
        const month = d.toLocaleDateString("en-US", { month: "short" });
        const year = d.getFullYear();
        return `${day} ${month}, ${year}`;
    };

    // Filtered + sorted jobs
    const displayJobs = useMemo(() => {
        let filtered = [...allJobs];

        // Work type filter
        if (workTypeFilter) {
            filtered = filtered.filter((j) =>
                j.workType?.toLowerCase().includes(workTypeFilter.toLowerCase())
            );
        }

        // Category filter
        if (categoryFilter) {
            filtered = filtered.filter((j) =>
                j.jobType?.name?.toLowerCase() === categoryFilter.toLowerCase()
            );
        }

        // Sub-category filter
        if (subCategoryFilter) {
            filtered = filtered.filter((j) =>
                j.subCategory?.toLowerCase() === subCategoryFilter.toLowerCase()
            );
        }

        // Search by name/type
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (j) =>
                    j.jobType?.name?.toLowerCase().includes(q) ||
                    j.workType?.toLowerCase().includes(q) ||
                    j.userProfile?.displayName?.toLowerCase().includes(q) ||
                    j.city?.toLowerCase().includes(q) ||
                    j.state?.toLowerCase().includes(q) ||
                    j.subCategory?.toLowerCase().includes(q)
            );
        }

        // Sort
        if (sortKey && sortDir) {
            filtered.sort((a, b) => {
                let valA: any = "";
                let valB: any = "";

                switch (sortKey) {
                    case "jobType":
                        valA = a.jobType?.name ?? "";
                        valB = b.jobType?.name ?? "";
                        break;
                    case "workType":
                        valA = a.workType ?? "";
                        valB = b.workType ?? "";
                        break;
                    case "startDate":
                        valA = a.startDate ? new Date(a.startDate).getTime() : 0;
                        valB = b.startDate ? new Date(b.startDate).getTime() : 0;
                        break;
                    case "urgent":
                        valA = a.urgent ? 1 : 0;
                        valB = b.urgent ? 1 : 0;
                        break;
                    case "cityState":
                        valA = `${a.city ?? ""}, ${a.state ?? ""}`;
                        valB = `${b.city ?? ""}, ${b.state ?? ""}`;
                        break;
                    case "postedBy":
                        valA = a.userProfile?.displayName ?? "";
                        valB = b.userProfile?.displayName ?? "";
                        break;
                    case "distance":
                        valA = a.distance ?? 0;
                        valB = b.distance ?? 0;
                        break;
                    default:
                        break;
                }

                if (typeof valA === "string") {
                    return sortDir === "asc"
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA);
                }
                return sortDir === "asc" ? valA - valB : valB - valA;
            });
        }

        return filtered;
    }, [allJobs, workTypeFilter, categoryFilter, subCategoryFilter, searchQuery, sortKey, sortDir]);

    // Toggle sort
    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            if (sortDir === "asc") setSortDir("desc");
            else if (sortDir === "desc") { setSortKey(null); setSortDir(null); }
            else setSortDir("asc");
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    // Sort indicator
    const sortIndicator = (key: SortKey) => {
        if (sortKey !== key) return <span className={styles.sortIcon}>⇅</span>;
        return (
            <span className={`${styles.sortIcon} ${styles.sortIconActive}`}>
                {sortDir === "asc" ? "↑" : "↓"}
            </span>
        );
    };

    const navigateToDetails = (jobId?: string) => {
        if (jobId) {
            router.push(`/jobs/${jobId}`);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Filter Bar */}
            <div className={styles.filterBar}>
                <input
                    type="text"
                    className={styles.locationInput}
                    placeholder="Search by location"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                />

                <select
                    className={styles.filterSelect}
                    value={viewType === "jobs" ? "viewJobs" : "viewSeekers"}
                    onChange={(e) => {
                        setViewType(e.target.value === "viewSeekers" ? "seekers" : "jobs");
                        if (e.target.value === "viewSeekers") setViewMode("card");
                    }}
                >
                    <option value="viewJobs">View Jobs</option>
                    <option value="viewSeekers">View Seekers</option>
                </select>

                <select
                    className={styles.filterSelect}
                    value={workTypeFilter}
                    onChange={(e) => setWorkTypeFilter(e.target.value)}
                >
                    <option value="">Part/Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Full time">Full Time</option>
                </select>

                <select
                    className={styles.filterSelect}
                    value={categoryFilter}
                    onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setSubCategoryFilter("");
                    }}
                >
                    <option value="">All Category</option>
                    {jobCategories?.map((cat: IJobCategories) => (
                        <option key={cat.id ?? cat.name} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <select
                    className={styles.filterSelect}
                    value={subCategoryFilter}
                    onChange={(e) => setSubCategoryFilter(e.target.value)}
                >
                    <option value="">All Sub Category</option>
                    {subCategories?.map((sc, i) => (
                        <option key={sc.jobTypeId ?? i} value={sc.name}>
                            {sc.name}
                        </option>
                    ))}
                </select>

                <select
                    className={styles.filterSelect}
                    value={radiusFilter}
                    onChange={(e) => setRadiusFilter(parseInt(e.target.value))}
                >
                    {Object.entries(MapRadius).map(([label, value]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>

                {/* View Toggle */}
                <div className={styles.viewToggle}>
                    <button
                        className={styles.viewToggleBtn}
                        title="Map View"
                        onClick={() => router.push(Routes.mapSearch)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                    </button>
                    <button
                        className={`${styles.viewToggleBtn} ${viewMode === "card" ? styles.viewToggleBtnActive : ""}`}
                        title="Card View"
                        onClick={() => setViewMode("card")}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <button
                        className={`${styles.viewToggleBtn} ${viewMode === "table" ? styles.viewToggleBtnActive : ""}`}
                        title="Table View"
                        onClick={() => setViewMode("table")}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* List Header */}
            <div className={styles.listHeader}>
                <h2 className={styles.listTitle}>
                    {viewType === "jobs" ? "Job List" : "Seeker List"}{" "}
                    <span className={styles.jobCount}>
                        {viewType === "jobs" ? displayJobs.length : sampleSeekers.length}
                    </span>
                </h2>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search by Name & Type of job"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* ========== SEEKERS VIEW ========== */}
            {viewType === "seekers" ? (
                <div className={styles.seekerGrid}>
                    {sampleSeekers.filter(seeker =>
                        !searchQuery ||
                        seeker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        seeker.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        seeker.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        seeker.city.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((seeker) => (
                        <div key={seeker.id} className={styles.seekerCard}>
                            {/* Card Header: Avatar + Name + Share */}
                            <div className={styles.seekerHeader}>
                                <div className={styles.seekerAvatarWrap}>
                                    <div className={styles.seekerAvatar}>
                                        {seeker.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className={styles.seekerName}>{seeker.name}</h3>
                                        <div className={styles.seekerRating}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    className={star <= Math.floor(seeker.rating) ? styles.starFilled : styles.starEmpty}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button className={styles.cardShareBtn} title="Share">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a5891" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                        <polyline points="16 6 12 2 8 6" />
                                        <line x1="12" y1="2" x2="12" y2="15" />
                                    </svg>
                                </button>
                            </div>

                            {/* Bio */}
                            <p className={styles.seekerBio}>{seeker.bio}</p>

                            {/* Location */}
                            <div className={styles.seekerLocation}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f07c00" stroke="none">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                                </svg>
                                <span>{seeker.city}, {seeker.country}</span>
                            </div>

                            {/* Language Tags */}
                            <div className={styles.seekerLangs}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f07c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" />
                                    <path d="M22 22l-5-10-5 10" /><path d="M14 18h6" />
                                </svg>
                                {seeker.languages.map((lang, i) => (
                                    <span key={i} className={styles.seekerLangTag}>{lang}</span>
                                ))}
                            </div>

                            {/* Offered Services */}
                            <div className={styles.seekerServices}>
                                <span className={styles.seekerServicesLabel}>Offer Services</span>
                                <div className={styles.seekerServiceTags}>
                                    {seeker.services.map((svc, i) => (
                                        <span key={i} className={styles.seekerServiceTag}>{svc}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Footer: Contact + View Profile */}
                            <div className={styles.seekerFooter}>
                                <span className={styles.seekerContactBtn}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    Contact Now
                                </span>
                                <span
                                    className={styles.seekerViewProfile}
                                    onClick={() => router.push(`/seekers/${seeker.id}`)}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    View Profile
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* ========== JOBS CONTENT ========== */
                <>
                    {isLoading ? (
                        <div className={styles.loadingContainer}>Loading jobs...</div>
                    ) : displayJobs.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>No jobs found</h3>
                            <p>Try adjusting your filters or search query.</p>
                        </div>
                    ) : viewMode === "table" ? (
                        <div className={styles.tableContainer}>
                            <table className={styles.jobTable}>
                                <thead>
                                    <tr>
                                        <th onClick={() => handleSort("jobType")}>
                                            Job Type {sortIndicator("jobType")}
                                        </th>
                                        <th onClick={() => handleSort("workType")}>
                                            Work Type {sortIndicator("workType")}
                                        </th>
                                        <th onClick={() => handleSort("startDate")}>
                                            Start Date {sortIndicator("startDate")}
                                        </th>
                                        <th onClick={() => handleSort("urgent")}>
                                            Urgent {sortIndicator("urgent")}
                                        </th>
                                        <th onClick={() => handleSort("cityState")}>
                                            City/State {sortIndicator("cityState")}
                                        </th>
                                        <th onClick={() => handleSort("distance")}>
                                            Distance {sortIndicator("distance")}
                                        </th>
                                        <th onClick={() => handleSort("postedBy")}>
                                            Posted By {sortIndicator("postedBy")}
                                        </th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayJobs.map((job) => (
                                        <tr key={job._id ?? job.id}>
                                            <td>{job.jobType?.name ?? "-"}</td>
                                            <td>{job.workType ?? "-"}</td>
                                            <td>{formatDate(job.startDate)}</td>
                                            <td>
                                                {job.urgent ? (
                                                    <span className={styles.urgentIcon}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#e53935" stroke="none">
                                                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                                                        </svg>
                                                    </span>
                                                ) : (
                                                    <span className={styles.notUrgent}>—</span>
                                                )}
                                            </td>
                                            <td>{`${job.city ?? "-"}, ${job.state ?? "-"}`}</td>
                                            <td>{job.distance ? `${job.distance} miles away` : "—"}</td>
                                            <td>{job.userProfile?.displayName ?? "-"}</td>
                                            <td>
                                                <span
                                                    className={styles.viewDetailsLink}
                                                    onClick={() => navigateToDetails(job._id ?? job.id)}
                                                >
                                                    View Job Details
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className={styles.cardGrid}>
                            {displayJobs.map((job) => (
                                <div key={job._id ?? job.id} className={styles.jobCard}>
                                    <div className={styles.cardTopRow}>
                                        <span className={styles.cardPostedBy}>
                                            Posted 2 days ago by <strong>{job.userProfile?.displayName ?? "-"}</strong>
                                        </span>
                                        <span className={styles.cardPrice}>$15-$25 <span className={styles.cardPriceUnit}>/hr</span></span>
                                    </div>
                                    <div className={styles.cardTitleRow}>
                                        <h3 className={styles.cardJobTitle}>
                                            {job.jobType?.name ?? "-"}
                                            {job.urgent && (
                                                <span className={styles.cardUrgentStar}>✴</span>
                                            )}
                                        </h3>
                                        <div className={styles.cardTitleActions}>
                                            {Math.random() > 0.5 && (
                                                <span className={styles.cardOnlineBadge}>ONLINE</span>
                                            )}
                                            <button className={styles.cardShareBtn} title="Share">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a5891" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                                    <polyline points="16 6 12 2 8 6" />
                                                    <line x1="12" y1="2" x2="12" y2="15" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.cardDetails}>
                                        <div className={styles.cardDetailItem}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                            <span>Start Date: <strong>{formatDate(job.startDate)}</strong></span>
                                        </div>
                                        <div className={styles.cardDetailItem}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                            </svg>
                                            <span>Work Type: <strong>{job.workType ?? "-"}</strong></span>
                                        </div>
                                        <div className={styles.cardDetailItem}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#f07c00" stroke="none">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                                            </svg>
                                            <span>{job.distance ? `${job.distance} miles away` : "—"}, {job.city ?? "-"}, {job.state ?? "-"}</span>
                                        </div>
                                    </div>
                                    <div className={styles.cardTags}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f07c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" />
                                            <path d="M22 22l-5-10-5 10" /><path d="M14 18h6" />
                                        </svg>
                                        <span className={styles.cardTag}>English</span>
                                        <span className={styles.cardTag}>Hindi</span>
                                        <span className={styles.cardTagMore}>+2</span>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <span
                                            className={styles.cardViewDetails}
                                            onClick={() => navigateToDetails(job._id ?? job.id)}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            View Job Details
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default withAuth(ViewAllJobs);
