import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import withAuth from "@/services/authorization/ProfileService"; // Fixed import
import { IJobs } from "@/models/Jobs";
import JobServices from "@/services/jobs/JobService";
import { useAuth } from "@/services/authorization/AuthContext";
import { ViewTypesForMap } from "@/constants/ViewTypesForMap";
import IMapSearchFilters from "@/models/MapFilters";
import { MapRadius } from "@/constants/EMapRadius";
import { IJobCategories, ISubCategory } from "@/models/JobCategories";
import { userProfileStore } from "@/stores/UserProfileStore";
import dynamic from "next/dynamic";
import styles from "@/styles/ViewAllJobs.module.css";
import JobCard from "@/components/jobs/JobCard";
import JobTableRow from "@/components/jobs/JobTableRow";

// Dynamically import map component for SSR compatibility
const DisplayMap = dynamic(() => import("@/components/maps/DisplayMaps"), {
    ssr: false,
    loading: () => <div className={styles.loadingContainer}>Loading Map...</div>,
});

// Sort direction type
type SortDir = "asc" | "desc" | null;
type SortKey = "jobType" | "workType" | "startDate" | "urgent" | "cityState" | "distance" | "postedBy";

const ViewAllJobs = () => {
    const router = useRouter();
    const { jobCategories } = useAuth();

    // Requested static categories
    const requestedCategories = useMemo(() => [
        {
            name: "Baking",
            id: "baking",
            subCategories: [
                { name: "All", jobTypeId: "baking" },
                { name: "Cake Bakers", jobTypeId: "baking" },
                { name: "Speciality Deserts", jobTypeId: "baking" }
            ]
        },
        { name: "Event Help", id: "event-help", subCategories: [{ name: "All", jobTypeId: "event-help" }] },
        { name: "Catering", id: "catering", subCategories: [{ name: "All", jobTypeId: "catering" }] },
        { name: "Tutoring", id: "tutoring", subCategories: [{ name: "All", jobTypeId: "tutoring" }] },
        { name: "Home & Baby Care", id: "home-baby-care", subCategories: [{ name: "All", jobTypeId: "home-baby-care" }] },
        { name: "Professionals", id: "professionals", subCategories: [{ name: "All", jobTypeId: "professionals" }] }
    ], []);

    // Use *only* requested static categories (as per user feedback "keep this only")
    const displayCategories = requestedCategories;
    const userProfile = userProfileStore((state) => state.userProfile);

    // Data state
    const [allJobs, setAllJobs] = useState<IJobs[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // View mode: 'table' (grid icon), 'card' (list/hamburger icon), or 'map'
    const [viewMode, setViewMode] = useState<"table" | "card" | "map">("table");

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
    const [workTypeFilter, setWorkTypeFilter] = useState("Part Time");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [subCategoryFilter, setSubCategoryFilter] = useState("");
    const [radiusFilter, setRadiusFilter] = useState(50);
    const [searchQuery, setSearchQuery] = useState("");

    // Sort state
    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>(null);

    // Sub-categories based on selected category (strictly specific ones)
    const subCategories: ISubCategory[] = useMemo(() => {
        let list: ISubCategory[] = [];
        if (!categoryFilter) {
            // Collect all unique specific subcategories from all display categories
            displayCategories.forEach(cat => {
                cat.subCategories?.forEach(sub => {
                    if (sub.name !== "All" && !list.some(s => s.name === sub.name)) {
                        list.push(sub);
                    }
                });
            });
        } else {
            const cat = displayCategories.find((c: IJobCategories) => c.name === categoryFilter);
            list = cat?.subCategories?.filter(sub => sub.name !== "All") ?? [];
        }
        return list;
    }, [categoryFilter, displayCategories]);

    // Job service instance (must be at component level since it uses Zustand hooks)
    const jobServices = new JobServices();

    // Sample data matching the reference screenshot
    const sampleJobs: IJobs[] = [
        { _id: "s1", jobType: { name: "Mother's Helper" } as any, subCategory: "All", workType: "Part Time", startDate: new Date("2025-10-20"), urgent: true, city: "Oakland", state: "California", distance: 2.5, userProfile: { displayName: "kaka" } as any },
        { _id: "s2", jobType: { name: "Baking" } as any, subCategory: "Cake Bakers", workType: "Full time", startDate: new Date("2025-10-12"), urgent: true, city: "Issaquah", state: "Washington", distance: 1.5, userProfile: { displayName: "Neha" } as any },
        { _id: "s3", jobType: { name: "Baking" } as any, subCategory: "Speciality Deserts", workType: "Part Time", startDate: new Date("2025-10-21"), urgent: true, city: "Austin", state: "Texas", distance: 1.2, userProfile: { displayName: "Anil & Ridhika" } as any },
        { _id: "s4", jobType: { name: "Mother's Helper" } as any, subCategory: "All", workType: "Full time", startDate: new Date("2025-10-18"), urgent: true, city: "Miami", state: "Florida", distance: 1.2, userProfile: { displayName: "Julia Martinez" } as any },
        { _id: "s5", jobType: { name: "Mother's Helper" } as any, subCategory: "All", workType: "Part Time", startDate: new Date("2025-08-20"), urgent: true, city: "Los Angeles", state: "California", distance: 2.2, userProfile: { displayName: "Jose Ramirez" } as any },
        { _id: "s6", jobType: { name: "Gardener" } as any, subCategory: "All", workType: "Part Time", startDate: new Date("2025-10-18"), urgent: true, city: "Austin", state: "Texas", distance: 2.1, userProfile: { displayName: "Sarah Johnson" } as any },
        { _id: "s7", jobType: { name: "Nanny" } as any, subCategory: "All", workType: "Full time", startDate: new Date("2025-08-20"), urgent: true, city: "Oakland", state: "California", distance: 1.8, userProfile: { displayName: "kaka" } as any },
        { _id: "s8", jobType: { name: "Mother's Helper" } as any, subCategory: "All", workType: "Full time", startDate: new Date("2025-10-12"), urgent: true, city: "Oakland", state: "California", distance: 1.5, userProfile: { displayName: "Mark & Lisa" } as any },
        { _id: "s9", jobType: { name: "House Cleaner" } as any, subCategory: "All", workType: "Part Time", startDate: new Date("2025-10-18"), urgent: true, city: "Austin", state: "Texas", distance: 2.5, userProfile: { displayName: "Julia Martinez" } as any },
        { _id: "s10", jobType: { name: "Nanny" } as any, subCategory: "All", workType: "Full time", startDate: new Date("2025-10-21"), urgent: true, city: "Oakland", state: "California", distance: 2.5, userProfile: { displayName: "Sarah Johnson" } as any },
        { _id: "s11", jobType: { name: "Gardener" } as any, subCategory: "All", workType: "Full time", startDate: new Date("2025-08-20"), urgent: true, city: "Denver", state: "Colorado", distance: 2.5, userProfile: { displayName: "kaka" } as any },
        { _id: "s12", jobType: { name: "Mother's Helper" } as any, subCategory: "All", workType: "Full time", startDate: new Date("2025-10-18"), urgent: true, city: "Miami", state: "Florida", distance: 2.5, userProfile: { displayName: "Jose Ramirez" } as any },
        { _id: "s13", jobType: { name: "House Cleaner" } as any, subCategory: "All", workType: "Part Time", startDate: new Date("2025-10-12"), urgent: true, city: "Austin", state: "Texas", distance: 2.5, userProfile: { displayName: "kaka" } as any },
        { _id: "s14", jobType: { name: "Elder Caregiver" } as any, subCategory: "All", workType: "Part Time", startDate: new Date("2025-10-21"), urgent: true, city: "New York", state: "New York", distance: 1.5, userProfile: { displayName: "Megan Lee" } as any },
        { _id: "s15", jobType: { name: "Nanny" } as any, subCategory: "All", workType: "Part Time", startDate: new Date("2025-10-18"), urgent: true, city: "Austin", state: "Texas", distance: 1.2, userProfile: { displayName: "kaka" } as any },
        { _id: "s16", jobType: { name: "Gardener" } as any, subCategory: "All", workType: "Part Time", startDate: new Date("2025-08-20"), urgent: true, city: "Oakland", state: "California", distance: 2.3, userProfile: { displayName: "Mark & Lisa" } as any },
        { _id: "s17", jobType: { name: "Mother's Helper" } as any, subCategory: "All", workType: "Part Time", startDate: new Date("2025-10-21"), urgent: true, city: "Miami", state: "Florida", distance: 1.1, userProfile: { displayName: "Sarah Johnson" } as any },
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
        if (subCategoryFilter && subCategoryFilter !== "All") {
            filtered = filtered.filter((j) =>
                j.subCategory?.toLowerCase() === subCategoryFilter.toLowerCase()
            );
        }

        // Search by location
        if (locationSearch.trim()) {
            const q = locationSearch.toLowerCase();
            filtered = filtered.filter(
                (j) =>
                    j.city?.toLowerCase().includes(q) ||
                    j.state?.toLowerCase().includes(q)
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
    }, [allJobs, workTypeFilter, categoryFilter, subCategoryFilter, locationSearch, searchQuery, sortKey, sortDir]);

    // Map filters derivation
    const mapFilters: IMapSearchFilters = useMemo(() => ({
        category: categoryFilter,
        subCategory: subCategoryFilter,
        role: viewType === "jobs" ? ViewTypesForMap.viewJobs : ViewTypesForMap.viewJobSeekers,
        diet: "",
        pets: "",
        radius: radiusFilter,
        coordinates: [
            Number(process.env.NEXT_PUBLIC_DEFAULT_LATITUDE) || 47.673988,
            Number(process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE) || -122.121512
        ],
    }), [categoryFilter, subCategoryFilter, viewType, radiusFilter]);

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
        const isActive = sortKey === key;
        const upActive = isActive && sortDir === "asc";
        const downActive = isActive && sortDir === "desc";

        return (
            <span className={`${styles.sortIcon} ${isActive ? styles.sortIconActive : ""}`}>
                <svg width="11" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 10h20L12 2z" style={{ opacity: upActive || !isActive ? 1 : 0.2 }} />
                    <path d="M12 22l10-8H2l10 8z" style={{ opacity: downActive || !isActive ? 1 : 0.2 }} />
                </svg>
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
                {/* Row 1: Filters & Toggles */}
                <div className={styles.filterTopRow}>
                    <div className={styles.filterGroup}>
                        <div className={styles.locationWrapper}>
                            <svg className={styles.locationIconInside} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <input
                                type="text"
                                className={styles.locationInput}
                                placeholder="Search by location"
                                value={locationSearch}
                                onChange={(e) => setLocationSearch(e.target.value)}
                            />
                        </div>

                        <select
                            className={styles.filterSelect}
                            value={viewType === "jobs" ? "viewJobs" : "viewSeekers"}
                            onChange={(e) => {
                                setViewType(e.target.value === "viewSeekers" ? "seekers" : "jobs");
                            }}
                        >
                            <option value="viewJobs">View Jobs</option>
                            <option value="viewSeekers">View Service Provider</option>
                        </select>

                        <select
                            className={styles.filterSelect}
                            value={workTypeFilter}
                            onChange={(e) => setWorkTypeFilter(e.target.value)}
                        >
                            <option value="Part Time">Part Time</option>
                            <option value="Full Time">Full Time</option>
                        </select>

                        <select
                            className={styles.filterSelect}
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(e.target.value);
                                setSubCategoryFilter(""); // Default to "All Sub Category"
                            }}
                        >
                            <option value="">All Category</option>
                            {displayCategories.map((cat: IJobCategories) => (
                                <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>

                        <select
                            className={styles.filterSelect}
                            value={subCategoryFilter}
                            onChange={(e) => setSubCategoryFilter(e.target.value)}
                        >
                            <option value="">All Sub Category</option>
                            {subCategories.map((sub: ISubCategory) => (
                                <option key={sub.name} value={sub.name}>{sub.name}</option>
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
                    </div>

                    <div className={styles.viewToggleContainer}>
                        <button
                            className={`${styles.viewToggleBtn} ${viewMode === "map" ? styles.viewToggleBtnActive : ""}`}
                            title="Map View"
                            onClick={() => setViewMode("map")}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                                <circle cx="17" cy="17" r="4" />
                                <line x1="21" y1="21" x2="19.5" y2="19.5" />
                            </svg>
                        </button>
                        <button
                            className={`${styles.viewToggleBtn} ${viewMode === "card" ? styles.viewToggleBtnActive : ""}`}
                            title="List View"
                            onClick={() => setViewMode("card")}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="6" width="18" height="4" rx="1" />
                                <rect x="3" y="14" width="18" height="4" rx="1" />
                            </svg>
                        </button>
                        <button
                            className={`${styles.viewToggleBtn} ${viewMode === "table" ? styles.viewToggleBtnActive : ""}`}
                            title="Grid View"
                            onClick={() => setViewMode("table")}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="8" height="8" rx="1" />
                                <rect x="13" y="3" width="8" height="8" rx="1" />
                                <rect x="3" y="13" width="8" height="8" rx="1" />
                                <rect x="13" y="13" width="8" height="8" rx="1" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Row 2: Header + Search */}
                {viewMode !== "map" && (
                    <div className={styles.filterBottomRow}>
                        <div className={styles.listHeader}>
                            <h2 className={styles.listTitle}>
                                {viewType === "jobs" ? "Job List" : "Service Provider List"}{" "}
                                <span className={styles.jobCount}>
                                    {displayJobs.length}
                                </span>
                            </h2>
                        </div>

                        <div className={styles.searchContainer}>
                            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                className={styles.newSearchInput}
                                placeholder="Search by Name & Type of job"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* ========== SEEKERS VIEW ========== */}
            {/* Content Area */}
            <div className={`${styles.contentArea} ${viewMode === "map" ? styles.contentAreaFull : ""}`}>
                {viewMode === "map" ? (
                    <div className={styles.mapViewContainer}>
                        <DisplayMap
                            filters={mapFilters}
                            jobs={displayJobs}
                            seekers={[]}
                            onJobClick={(job) => navigateToDetails(job._id ?? job.id)}
                            onProfileClick={(profile) => router.push(`/seekers/${profile.id}`)}
                            onLocationSelect={(lat, lng, address) => {
                                setLocationSearch(address);
                                console.log(`Selected Location: ${lat}, ${lng}, ${address}`);
                            }}
                        />
                    </div>
                ) : viewType === "seekers" ? (
                    <div className={styles.seekerGrid}>
                        {sampleSeekers.filter(seeker => {
                            const matchesSearch = !searchQuery ||
                                seeker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                seeker.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                seeker.bio.toLowerCase().includes(searchQuery.toLowerCase());

                            const matchesLocation = !locationSearch ||
                                seeker.city.toLowerCase().includes(locationSearch.toLowerCase()) ||
                                (seeker.country && seeker.country.toLowerCase().includes(locationSearch.toLowerCase()));

                            return matchesSearch && matchesLocation;
                        }).map((seeker) => (
                            <div key={seeker.id} className={styles.seekerCard}>
                                <div className={styles.seekerHeader}>
                                    <div className={styles.seekerAvatarWrap}>
                                        <div className={styles.seekerAvatar}>{seeker.name.charAt(0)}</div>
                                        <div>
                                            <h3 className={styles.seekerName}>{seeker.name}</h3>
                                            <div className={styles.seekerRating}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star} className={star <= Math.floor(seeker.rating) ? styles.starFilled : styles.starEmpty}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button className={styles.cardShareBtn} title="Share">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                            <polyline points="16 6 12 2 8 6" />
                                            <line x1="12" y1="2" x2="12" y2="15" />
                                        </svg>
                                    </button>
                                </div>
                                <p className={styles.seekerBio}>{seeker.bio}</p>
                                <div className={styles.seekerLocation}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f07c00" stroke="none">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                                    </svg>
                                    <span>{seeker.city}, {seeker.country}</span>
                                </div>
                                <div className={styles.seekerLangs}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f07c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" />
                                        <path d="M22 22l-5-10-5 10" /><path d="M14 18h6" />
                                    </svg>
                                    {seeker.languages.map((lang, i) => (
                                        <span key={`${seeker.id}-lang-${i}`} className={styles.seekerLangTag}>{lang}</span>
                                    ))}
                                </div>
                                <div className={styles.seekerServices}>
                                    <span className={styles.seekerServicesLabel}>Offer Services</span>
                                    <div className={styles.seekerServiceTags}>
                                        {seeker.services.map((svc, i) => (
                                            <span key={`${seeker.id}-svc-${i}`} className={styles.seekerServiceTag}>{svc}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.seekerFooter}>
                                    <span className={styles.seekerContactBtn}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                        Contact Now
                                    </span>
                                    <span className={styles.seekerViewProfile} onClick={() => router.push(`/seekers/${seeker.id}`)}>
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
                    <>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-desi-orange mb-4"></div>
                                Loading jobs...
                            </div>
                        ) : displayJobs.length === 0 ? (
                            <div className="text-center p-20">
                                <h3 className="text-xl font-bold text-desi-dark mb-2">No jobs found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search query.</p>
                            </div>
                        ) : viewMode === "table" ? (
                            <div className={styles.tableContainer}>
                                <table className={styles.jobTable}>
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSort("jobType")}>Job Type {sortIndicator("jobType")}</th>
                                            <th onClick={() => handleSort("workType")}>Work Type {sortIndicator("workType")}</th>
                                            <th onClick={() => handleSort("startDate")}>Start Date {sortIndicator("startDate")}</th>
                                            <th onClick={() => handleSort("urgent")} className={styles.centeredTh}>Urgent {sortIndicator("urgent")}</th>
                                            <th onClick={() => handleSort("cityState")}>City/State {sortIndicator("cityState")}</th>
                                            <th onClick={() => handleSort("distance")}>Distance {sortIndicator("distance")}</th>
                                            <th onClick={() => handleSort("postedBy")}>Posted By {sortIndicator("postedBy")}</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayJobs.map((job) => (
                                            <JobTableRow
                                                key={job._id ?? job.id}
                                                job={job}
                                                onViewDetails={navigateToDetails}
                                                formatDate={formatDate}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className={styles.cardGrid}>
                                {displayJobs.map((job) => (
                                    <JobCard
                                        key={job._id ?? job.id}
                                        job={job}
                                        onViewDetails={navigateToDetails}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default withAuth(ViewAllJobs);
