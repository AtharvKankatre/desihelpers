import React, { FunctionComponent, useState, useEffect } from "react";
import styles from "@/styles/ViewAllJobs.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import { FaList, FaSlidersH } from "react-icons/fa";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
import { toast } from "react-toastify";

const ViewAllSeekers: FunctionComponent = () => {
  const router = useRouter();
  const { mobile } = useAppMediaQuery();

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allSeekers, setAllSeekers] = useState<any[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Block page for non-logged-in users — show alert and redirect
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  useEffect(() => {
    const activeStatus = Cookies.get(cookieParams.isActive);
    if (activeStatus !== "true") {
      setIsLoggedIn(false);
      toast.warn("Please login to view provider details", { toastId: 'login-provider' });
      router.push('/Login');
    }
  }, []);

  useEffect(() => {
    const fetchSeekers = async () => {
      try {
        setIsLoading(true);
        const result = await ApiService.crud(APIDetails.getSeekers, `?skip=0&limit=100&state=&radius=50`);
        if (result[0] && Array.isArray(result[1])) {
          const mapped = result[1].map((s: any) => ({
            id: s.userId || s._id || s.id,
            name: `${s.firstName || ""} ${s.lastName || ""}`.trim() || s.displayName || "Service Provider",
            rating: s.rating || 0,
            reviewCount: s.reviewCount || 0,
            photo: s.profilePhoto || "",
            bio: s.aboutMe || "Experienced service provider.",
            city: s.city || "",
            country: s.state || "",
            languages: s.languagesSpoken || [],
            services: s.jobDetails?.map((j: any) => j.subCategory || j.jobType || "Service") || [],
            createdAt: s.createdAt || s.created_at || "",
          }));
          // Sort by newest registered first
          mapped.sort((a: any, b: any) => {
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
          });
          setAllSeekers(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch seekers:", err);
      } finally {
        setIsLoading(false);
        setHasLoaded(true);
      }
    };
    fetchSeekers();
  }, []);



  const getUniqueServiceTypes = () => {
    const serviceTypes = allSeekers.flatMap(seeker => seeker.services);
    return Array.from(new Set(serviceTypes.filter(Boolean))).sort();
  };

  const filteredSeekers = allSeekers.filter(seeker => {
    const query = searchQuery.toLowerCase();
    const locQuery = locationSearch.toLowerCase();

    const matchesSearch = !query ||
      seeker.name.toLowerCase().includes(query) ||
      seeker.bio.toLowerCase().includes(query) ||
      seeker.services.some((svc: string) => svc.toLowerCase().includes(query));

    const matchesLocation = !locQuery ||
      seeker.city.toLowerCase().includes(locQuery) ||
      seeker.country.toLowerCase().includes(locQuery);

    const matchesCategory = !categoryFilter ||
      seeker.services.some((svc: string) => svc.toLowerCase() === categoryFilter.toLowerCase());

    return matchesSearch && matchesLocation && matchesCategory;
  });

  // Check if user is logged in before allowing detail navigation
  const requireLogin = () => {
    const isLoggedIn = Cookies.get(cookieParams.isActive) === "true";
    if (!isLoggedIn) {
      toast.warn("Please login to view provider details", { toastId: 'login-provider' });
      router.push('/Login');
      return false;
    }
    return true;
  };

  const navigateToProfile = (seekerId: string) => {
    if (!requireLogin()) return;
    router.push(`/seekers/${seekerId}`);
  };

  const handleContactClick = (seekerId: string) => {
    if (!requireLogin()) return;
    router.push(`/Messages?userId=${seekerId}`);
  };

  if (!isLoggedIn) {
    return null; // Block rendering of the page entirely
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.filterBar}>
        {/* Desktop Row 1: Filters & Toggles */}
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
                placeholder="Location (City, State)"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
              />
            </div>

            <select
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Services</option>
              {getUniqueServiceTypes().map((svc, i) => (
                <option key={i} value={svc}>{svc}</option>
              ))}
            </select>

          </div>

          <div className={styles.viewToggleContainer}>
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

        {/* Desktop Row 2 / Mobile Headers */}
        {mobile ? (
          <div className={styles.mobileFilterContainer}>
            <div className={styles.mobileSearchRow}>
              <div className={styles.searchContainerMobile}>
                <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className={styles.newSearchInput}
                  placeholder="Search Name or Service"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className={styles.mobileFilterBtn} onClick={() => setFilterModalOpen(true)}>
                <FaSlidersH style={{ fontSize: 12 }} /> Filter
              </button>
            </div>

            <div className={styles.mobileTitleRow}>
              <h2 className={styles.listTitle}>
                Service Provider List {hasLoaded && <span className={styles.jobCount}>{filteredSeekers.length}</span>}
              </h2>
              <div className={styles.mobileActions}>
                <button className={`${styles.mobileActionBtn} ${viewMode === "card" ? styles.activeMobileBtn : ""}`} onClick={() => setViewMode("card")}>
                  <FaList />
                </button>
                <button className={`${styles.mobileActionBtn} ${viewMode === "table" ? styles.activeMobileBtn : ""}`} onClick={() => setViewMode("table")}>
                  <FaSlidersH />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.filterBottomRow}>
            <div className={styles.listHeader}>
              <h2 className={styles.listTitle}>
                Service Provider List {hasLoaded && <span className={styles.jobCount}>{filteredSeekers.length}</span>}
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
                placeholder="Search Name or Service"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        {filteredSeekers.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyStateTitle}>No service providers found</h3>
            <p className={styles.emptyStateText}>Try adjusting your filters or search query.</p>
          </div>
        ) : viewMode === "table" ? (
          <div className={styles.tableContainer}>
            <table className={styles.jobTable}>
              <thead>
                <tr>
                  <th>Provider Name</th>
                  <th>Services Offered</th>
                  <th>Rating</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSeekers.map((seeker) => (
                  <tr key={seeker.id} onClick={() => navigateToProfile(seeker.id)} style={{ cursor: 'pointer' }}>
                    <td><strong>{seeker.name}</strong></td>
                    <td>
                      {seeker.services.join(", ")}
                    </td>
                    <td>{seeker.rating} ⭐</td>
                    <td>{`${seeker.city}, ${seeker.country}`}</td>
                    <td>
                      <span className={styles.viewDetailsLink} onClick={(e) => { e.stopPropagation(); navigateToProfile(seeker.id); }} style={{ marginRight: '10px' }}>View Profile</span>
                      <span className={styles.viewDetailsLink} onClick={(e) => { e.stopPropagation(); handleContactClick(seeker.id); }} style={{ color: '#25d366' }}>Contact Now</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.seekerGrid}>
            {filteredSeekers.map((seeker) => (
              <Link key={seeker.id} href={`/seekers/${seeker.id}`} className={styles.seekerCard} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className={styles.seekerHeader}>
                  <div className={styles.seekerAvatarWrap}>
                    <div className={styles.seekerAvatar}>{seeker.name.charAt(0)}</div>
                    <div>
                      <h3 className={styles.seekerName}>{seeker.name}</h3>
                      <div className={styles.seekerRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= Math.round(seeker.rating || 0) ? styles.starFilled : styles.starEmpty}>★</span>
                        ))}
                        <span className={styles.ratingNumber} style={{ marginLeft: "4px", fontSize: "14px", fontWeight: "700", color: "#ffb400" }}>
                            {seeker.rating ? Number(seeker.rating).toFixed(1) : "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className={styles.cardShareBtn} title="Share" onClick={(e) => e.stopPropagation()}>
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
                  <span className={styles.seekerContactBtn} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleContactClick(seeker.id); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Contact Now
                  </span>
                  <span className={styles.seekerViewProfile}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View Profile
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filter Modal */}
      {filterModalOpen && (
        <div className={styles.filterModalOverlay}>
          <div className={styles.filterModal}>
            <div className={styles.filterModalHeader}>
              <span className={styles.filterModalTitle}>Filter</span>
              <button className={styles.filterModalClose} onClick={() => setFilterModalOpen(false)}>✕</button>
            </div>
            <div className={styles.filterModalBody}>
              <select
                className={styles.filterModalSelect}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Services</option>
                {getUniqueServiceTypes().map((svc, i) => (
                  <option key={i} value={svc}>{svc}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterModalFooter}>
              <button className={styles.filterModalApply} onClick={() => setFilterModalOpen(false)}>Apply Filter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllSeekers;
