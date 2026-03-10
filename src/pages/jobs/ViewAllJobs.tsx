import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
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
import { PageLoader } from "@/components/global/loader/PageLoader";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import { FaMapMarkedAlt, FaList, FaSlidersH, FaSortAmountDown, FaBell, FaArrowLeft } from "react-icons/fa";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import Radar from "radar-sdk-js";

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
    const { mobile } = useAppMediaQuery();

    // Block page for non-logged-in users — show alert and redirect
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const { jobCategories } = useAuth();

    useEffect(() => {
        const activeStatus = Cookies.get(cookieParams.isActive);
        if (activeStatus !== "true") {
            setIsLoggedIn(false);
            toast.warn('Please login to view job details', {
                toastId: 'login-warning',
                onClose: () => router.push('/Login'),
                autoClose: 2000
            });
            setTimeout(() => {
                router.push('/Login');
            }, 2500);
        } else {
            setIsLoggedIn(true);
        }
    }, []);

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
        {
            name: "Event Help",
            id: "event-help",
            subCategories: [
                { name: "All", jobTypeId: "event-help" },
                { name: "Astrologers", jobTypeId: "event-help" },
                { name: "Decorators", jobTypeId: "event-help" },
                { name: "Entertainers", jobTypeId: "event-help" },
                { name: "Henna Artists", jobTypeId: "event-help" },
                { name: "Photographers", jobTypeId: "event-help" },
                { name: "Priests", jobTypeId: "event-help" },
                { name: "Servers", jobTypeId: "event-help" },
                { name: "Event Planners", jobTypeId: "event-help" },
                { name: "Music DJs", jobTypeId: "event-help" },
                { name: "Beauticians", jobTypeId: "event-help" }
            ]
        },
        {
            name: "Catering",
            id: "catering",
            subCategories: [
                { name: "All", jobTypeId: "catering" },
                { name: "Personal Chef", jobTypeId: "catering" },
                { name: "Tiffin", jobTypeId: "catering" },
                { name: "Caterers", jobTypeId: "catering" },
                { name: "Speciality Items", jobTypeId: "catering" },
                { name: "Live Counters", jobTypeId: "catering" }
            ]
        },
        {
            name: "Tutoring",
            id: "tutoring",
            subCategories: [
                { name: "All", jobTypeId: "tutoring" },
                { name: "Maths/Science", jobTypeId: "tutoring" },
                { name: "Certificate Exams", jobTypeId: "tutoring" },
                { name: "Music", jobTypeId: "tutoring" },
                { name: "Others", jobTypeId: "tutoring" },
                { name: "Yoga", jobTypeId: "tutoring" },
                { name: "Dance", jobTypeId: "tutoring" }
            ]
        },
        {
            name: "Home & Baby Care",
            id: "home-baby-care",
            subCategories: [
                { name: "All", jobTypeId: "home-baby-care" },
                { name: "Nanny", jobTypeId: "home-baby-care" },
                { name: "Mother's Helper", jobTypeId: "home-baby-care" },
                { name: "Carpet Cleaners", jobTypeId: "home-baby-care" },
                { name: "House Cleaners", jobTypeId: "home-baby-care" },
                { name: "Pack/Move Services", jobTypeId: "home-baby-care" },
                { name: "Landscaping Services", jobTypeId: "home-baby-care" },
                { name: "Day Care Center", jobTypeId: "home-baby-care" }
            ]
        },
        {
            name: "Professionals",
            id: "professionals",
            subCategories: [
                { name: "All", jobTypeId: "professionals" },
                { name: "Gas Station Jobs", jobTypeId: "professionals" },
                { name: "Store Jobs", jobTypeId: "professionals" },
                { name: "Other Jobs", jobTypeId: "professionals" },
                { name: "Airport pick/drop", jobTypeId: "professionals" },
                { name: "CPA/TAX", jobTypeId: "professionals" },
                { name: "Legal", jobTypeId: "professionals" },
                { name: "Notary", jobTypeId: "professionals" }
            ]
        }
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

    // Dynamic seeker data from API
    const [seekersList, setSeekersList] = useState<any[]>([]);

    // Filter state
    const [locationSearch, setLocationSearch] = useState("");
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [workTypeFilter, setWorkTypeFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [subCategoryFilter, setSubCategoryFilter] = useState("");

    // Radar autocomplete state
    const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const autocompleteTimerRef = useRef<NodeJS.Timeout | null>(null);
    const locationWrapperRef = useRef<HTMLDivElement>(null);
    const radarInitRef = useRef(false);
    const [radiusFilter, setRadiusFilter] = useState(50);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    // Initialize Radar SDK
    useEffect(() => {
        if (!radarInitRef.current) {
            Radar.initialize(process.env.NEXT_PUBLIC_RADAR_API_KEY || "");
            radarInitRef.current = true;
        }
    }, []);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (locationWrapperRef.current && !locationWrapperRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced Radar autocomplete
    const handleLocationInput = useCallback((query: string) => {
        setLocationSearch(query);
        if (autocompleteTimerRef.current) clearTimeout(autocompleteTimerRef.current);
        if (!query || query.length < 2) {
            setLocationSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        setIsSearching(true);
        autocompleteTimerRef.current = setTimeout(() => {
            Radar.autocomplete({
                query,
                limit: 8,
            }).then((result: any) => {
                setLocationSuggestions(result.addresses || []);
                setShowSuggestions(true);
                setIsSearching(false);
            }).catch(() => {
                setLocationSuggestions([]);
                setIsSearching(false);
            });
        }, 300);
    }, []);

    // Handle selecting a location suggestion
    const handleLocationSelect = (address: any) => {
        const label = `${address.city || address.borough || ""}, ${address.stateCode || address.state || ""} ${address.countryCode || ""}`.trim();
        setLocationSearch(label);
        setShowSuggestions(false);
        setLocationSuggestions([]);
        if (address.latitude && address.longitude) {
            setUserLocation([address.latitude, address.longitude]);
        }
    };

    // Fetch user geolocation on mount
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.warn("User location could not be fetched. Using default.", error);
                }
            );
        }
    }, []);

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
                setAllJobs(jobs.length > 0 ? jobs : []);
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
                setAllJobs([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [radiusFilter]);

    // Fetch seekers for seekers tab
    useEffect(() => {
        const fetchSeekers = async () => {
            try {
                const result = await ApiService.crud(APIDetails.getSeekers, `?skip=0&limit=50&state=${userProfile?.state ?? ""}&radius=${radiusFilter}`);
                if (result[0] && Array.isArray(result[1])) {
                    const mapped = result[1].map((s: any) => ({
                        id: s._id || s.id,
                        name: `${s.firstName || ""} ${s.lastName || ""}`.trim() || s.displayName || "Service Provider",
                        rating: s.rating || 4,
                        photo: s.profilePhoto || "",
                        bio: s.aboutMe || "Experienced service provider.",
                        city: s.city || "",
                        country: s.state || "",
                        languages: s.languagesSpoken || [],
                        services: s.jobDetails?.map((j: any) => j.subCategory || j.jobType || "Service") || [],
                        location: s.location || {
                            coordinates: [
                                -122.121512 + (Math.random() * 0.2 - 0.1), // spoofed nearby longitude
                                47.673988 + (Math.random() * 0.2 - 0.1)    // spoofed nearby latitude
                            ]
                        }, // EXTREMELY IMPORTANT for DisplayMaps
                    }));
                    setSeekersList(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch seekers:", err);
            }
        };
        fetchSeekers();
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
    const mapFilters: IMapSearchFilters = useMemo(() => {
        const defaultLat = Number(process.env.NEXT_PUBLIC_DEFAULT_LATITUDE) || 47.673988;
        const defaultLng = Number(process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE) || -122.121512;
        return {
            category: categoryFilter,
            subCategory: subCategoryFilter,
            role: viewType === "jobs" ? ViewTypesForMap.viewJobs : ViewTypesForMap.viewJobSeekers,
            diet: "",
            pets: "",
            radius: radiusFilter,
            coordinates: userLocation ? userLocation : [defaultLat, defaultLng],
        };
    }, [categoryFilter, subCategoryFilter, viewType, radiusFilter, userLocation]);

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

    // Check if user is logged in before allowing detail navigation
    const requireLogin = () => {
        const isLoggedInStatus = Cookies.get(cookieParams.isActive) === "true";
        if (!isLoggedInStatus) {
            toast.warn('Please login to view job details', { toastId: 'login-warning' });
            router.push('/Login');
            return false;
        }
        return true;
    };

    const navigateToDetails = (jobId?: string) => {
        if (jobId) {
            if (!requireLogin()) return;
            router.push(`/jobs/${jobId}`);
        }
    };

    if (isLoggedIn === false || isLoggedIn === null) {
        return <div style={{ minHeight: '100vh', backgroundColor: '#efefef' }} />; // Professional light fallback while redirecting or checking
    }

    return (
        <div className={styles.pageWrapper}>
            {/* Filter Bar */}
            <div className={styles.filterBar}>
                {/* Row 1: Filters & Toggles */}
                <div className={styles.filterTopRow}>
                    <div className={styles.filterGroup}>
                        <div className={styles.locationWrapper} ref={locationWrapperRef}>
                            <svg className={styles.locationIconInside} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <input
                                type="text"
                                className={styles.locationInput}
                                placeholder="Search by location"
                                value={locationSearch}
                                onChange={(e) => handleLocationInput(e.target.value)}
                                onFocus={() => { if (locationSuggestions.length > 0) setShowSuggestions(true); }}
                            />
                            {showSuggestions && locationSuggestions.length > 0 && (
                                <div className={styles.locationDropdown}>
                                    {locationSuggestions.map((addr: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className={styles.locationDropdownItem}
                                            onClick={() => handleLocationSelect(addr)}
                                        >
                                            <svg className={styles.locationDropdownIcon} width="16" height="16" viewBox="0 0 24 24" fill="#f07c00" stroke="none">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                                            </svg>
                                            <div className={styles.locationDropdownText}>
                                                <span className={styles.locationDropdownCity}>{addr.city || addr.borough || addr.addressLabel || ""}</span>
                                                <span className={styles.locationDropdownRegion}>{addr.stateCode || addr.state || ""} {addr.countryCode || ""}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                            <option value="">Work Type</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Remote">Remote</option>
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
                {/* Row 2: Header + Search - Responsive Layout */}
                {/* Row 2: Header + Search - Responsive Layout */}
                {mobile ? (
                    viewMode === "map" ? (
                        <div className={styles.mobileMapHeader}>
                            <button
                                className={styles.mobileBackBtn}
                                onClick={() => setViewMode("card")}
                            >
                                <FaArrowLeft /> Back to List
                            </button>
                        </div>
                    ) : (
                        <div className={styles.mobileFilterContainer}>
                            {/* Mobile Row 1: Search + Filter Button */}
                            <div className={styles.mobileSearchRow}>
                                <div className={styles.searchContainerMobile} ref={!locationWrapperRef.current ? locationWrapperRef : undefined} style={{ position: 'relative' }}>
                                    <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <input
                                        type="text"
                                        className={styles.newSearchInput}
                                        placeholder="Search by location"
                                        value={locationSearch}
                                        onChange={(e) => handleLocationInput(e.target.value)}
                                        onFocus={() => { if (locationSuggestions.length > 0) setShowSuggestions(true); }}
                                    />
                                    {showSuggestions && locationSuggestions.length > 0 && (
                                        <div className={styles.locationDropdown}>
                                            {locationSuggestions.map((addr: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className={styles.locationDropdownItem}
                                                    onClick={() => handleLocationSelect(addr)}
                                                >
                                                    <svg className={styles.locationDropdownIcon} width="16" height="16" viewBox="0 0 24 24" fill="#f07c00" stroke="none">
                                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                                                    </svg>
                                                    <div className={styles.locationDropdownText}>
                                                        <span className={styles.locationDropdownCity}>{addr.city || addr.borough || addr.addressLabel || ""}</span>
                                                        <span className={styles.locationDropdownRegion}>{addr.stateCode || addr.state || ""} {addr.countryCode || ""}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    className={styles.mobileFilterBtn}
                                    onClick={() => setFilterModalOpen(true)}
                                >
                                    <FaSlidersH style={{ fontSize: 12 }} />
                                    Filter
                                </button>
                            </div>

                            {/* Mobile Row 2: Title + Icons */}
                            <div className={styles.mobileTitleRow}>
                                <h2 className={styles.listTitle}>
                                    {viewType === "jobs" ? "Job List" : "Service Provider List"}{" "}
                                    <span className={styles.jobCount}>
                                        {displayJobs.length}
                                    </span>
                                </h2>
                                <div className={styles.mobileActions}>
                                    <button
                                        className={`${styles.mobileActionBtn}`}
                                        onClick={() => setViewMode("map")}
                                    >
                                        <FaMapMarkedAlt />
                                    </button>
                                    <button
                                        className={`${styles.mobileActionBtn} ${viewMode === "card" ? styles.activeMobileBtn : ""}`}
                                        onClick={() => setViewMode("card")}
                                    >
                                        <FaList />
                                    </button>
                                    <button
                                        className={`${styles.mobileActionBtn} ${viewMode === "table" ? styles.activeMobileBtn : ""}`}
                                        onClick={() => setViewMode("table")}
                                    >
                                        <FaSlidersH />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    viewMode !== "map" && (
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
                    )
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
                            onProfileClick={(profile) => {
                                if (!requireLogin()) return;
                                router.push(`/seekers/${profile.id}`);
                            }}
                            onLocationSelect={(lat, lng, address) => {
                                setLocationSearch(address);
                                console.log(`Selected Location: ${lat}, ${lng}, ${address}`);
                            }}
                        />
                    </div>
                ) : viewType === "seekers" ? (
                    <div className={styles.seekerGrid}>
                        {seekersList.filter(seeker => {
                            const matchesSearch = !searchQuery ||
                                seeker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                seeker.services.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
                                    {seeker.languages.map((lang: string, i: number) => (
                                        <span key={`${seeker.id}-lang-${i}`} className={styles.seekerLangTag}>{lang}</span>
                                    ))}
                                </div>
                                <div className={styles.seekerServices}>
                                    <span className={styles.seekerServicesLabel}>Offer Services</span>
                                    <div className={styles.seekerServiceTags}>
                                        {seeker.services.map((svc: string, i: number) => (
                                            <span key={`${seeker.id}-svc-${i}`} className={styles.seekerServiceTag}>{svc}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.seekerFooter}>
                                    <span className={styles.seekerContactBtn} onClick={() => requireLogin()}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                        Contact Now
                                    </span>
                                    <span className={styles.seekerViewProfile} onClick={() => { if (requireLogin()) router.push(`/seekers/${seeker.id}`); }}>
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
                                <PageLoader />
                            </div>
                        ) : displayJobs.length === 0 ? (
                            <div className={styles.emptyState}>
                                <h3 className={styles.emptyStateTitle}>No jobs found</h3>
                                <p className={styles.emptyStateText}>Try adjusting your filters or search query.</p>
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
                                            <tr key={job._id ?? job.id}>
                                                <td>{job.jobType?.name ?? "-"}</td>
                                                <td>{job.workType ?? "-"}</td>
                                                <td>{formatDate(job.startDate)}</td>
                                                <td className={styles.centeredTd}>
                                                    {job.urgent ? (
                                                        <span className={styles.urgentIcon}>
                                                            <FaBell style={{ color: "red", fontSize: "24px" }} />
                                                        </span>
                                                    ) : <span className={styles.notUrgent}>—</span>}
                                                </td>
                                                <td>{`${job.city ?? "-"}, ${job.state ?? "-"}`}</td>
                                                <td>{job.distance ? `${job.distance} miles away` : "—"}</td>
                                                <td>{job.userProfile?.displayName ?? "-"}</td>
                                                <td>
                                                    <span className={styles.viewDetailsLink} onClick={() => navigateToDetails(job._id ?? job.id)}>View Job Details</span>
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
                                            <span className={styles.cardPostedBy}>Posted 2 days ago by <strong>{job.userProfile?.displayName ?? "Srilatha Nair"}</strong></span>
                                            <span className={styles.cardPrice}>$15-$25 <span className={styles.cardPriceUnit}>/hr</span></span>
                                        </div>
                                        <div className={styles.cardTitleRow}>
                                            <h3 className={styles.cardJobTitle}>
                                                {job.jobType?.name ?? "Nanny"}
                                                {job.urgent && (
                                                    <span className={styles.cardUrgentStar}>
                                                        <FaBell style={{ color: "red", fontSize: "20px" }} />
                                                    </span>
                                                )}
                                            </h3>
                                            <div className={styles.cardTitleActions}>
                                                {job.urgent && <span className={styles.cardOnlineBadge}>ONLINE</span>}
                                                <button className={styles.cardShareBtn} title="Share">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className={styles.cardDetails}>
                                            <div className={styles.cardDetailItem}>
                                                <span className={styles.cardIcon}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                                    </svg>
                                                </span>
                                                <span>Start Date: <strong>{formatDate(job.startDate)}</strong></span>
                                            </div>
                                            <div className={styles.cardDetailItem}>
                                                <span className={styles.cardIcon}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                                    </svg>
                                                </span>
                                                <span>Work Type: <strong>{job.workType ?? "Full Time"}</strong></span>
                                            </div>
                                            <div className={styles.cardDetailItem}>
                                                <span className={styles.cardIcon}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                                    </svg>
                                                </span>
                                                <span>{job.distance ? `${job.distance} miles away` : "—"}, {job.city ?? "Bothell"}, {job.state ?? "Washington"}</span>
                                            </div>
                                        </div>
                                        <div className={styles.cardTags}>
                                            <span className={styles.cardIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="M22 22l-5-10-5 10" /><path d="M14 18h6" /></svg></span>
                                            <span className={styles.cardTag}>English</span><span className={styles.cardTag}>Hindi</span><span className={styles.cardTagMore}>+2</span>
                                        </div>
                                        <div className={styles.cardFooter}>
                                            <div className={styles.cardViewDetails} onClick={() => navigateToDetails(job._id ?? job.id)}>
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
                                                View Job Details
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Mobile Filter Modal */}
            {filterModalOpen && (
                <div className={styles.filterModalOverlay}>
                    <div className={styles.filterModal}>
                        {/* Header */}
                        <div className={styles.filterModalHeader}>
                            <span className={styles.filterModalTitle}>Filter</span>
                            <button
                                className={styles.filterModalClose}
                                onClick={() => setFilterModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Filter Options */}
                        <div className={styles.filterModalBody}>
                            <select
                                className={styles.filterModalSelect}
                                value={viewType === "jobs" ? "viewJobs" : "viewSeekers"}
                                onChange={(e) => setViewType(e.target.value === "viewSeekers" ? "seekers" : "jobs")}
                            >
                                <option value="viewJobs">View Jobs</option>
                                <option value="viewSeekers">View Service Provider</option>
                            </select>
                            <select
                                className={styles.filterModalSelect}
                                value={workTypeFilter}
                                onChange={(e) => setWorkTypeFilter(e.target.value)}
                            >
                                <option value="">Work Type</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Remote">Remote</option>
                            </select>
                            <select
                                className={styles.filterModalSelect}
                                value={categoryFilter}
                                onChange={(e) => { setCategoryFilter(e.target.value); setSubCategoryFilter(""); }}
                            >
                                <option value="">All Category</option>
                                {displayCategories.map((cat: IJobCategories) => (
                                    <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                            <select
                                className={styles.filterModalSelect}
                                value={subCategoryFilter}
                                onChange={(e) => setSubCategoryFilter(e.target.value)}
                            >
                                <option value="">All Sub Category</option>
                                {subCategories.map((sub: ISubCategory) => (
                                    <option key={sub.name} value={sub.name}>{sub.name}</option>
                                ))}
                            </select>
                            <select
                                className={styles.filterModalSelect}
                                value={radiusFilter}
                                onChange={(e) => setRadiusFilter(parseInt(e.target.value))}
                            >
                                {Object.entries(MapRadius).map(([label, value]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Footer Button */}
                        <div className={styles.filterModalFooter}>
                            <button
                                className={styles.filterModalApply}
                                onClick={() => setFilterModalOpen(false)}
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewAllJobs;
