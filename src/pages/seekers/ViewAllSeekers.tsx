import React, { FunctionComponent, useState, useEffect } from "react";
import styles from "@/styles/ViewAllJobs.module.css";
import { useRouter } from "next/router";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import { FaList, FaSlidersH } from "react-icons/fa";

// Sample seeker data to match the working ViewAllJobs reference
const sampleSeekers = [
  { id: "sk1", name: "Shrutika Patil", rating: 4.5, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Bhopal", country: "India", languages: ["English", "Hindi"], services: ["Music teacher", "Event planning"] },
  { id: "sk2", name: "Dipali Khedekar", rating: 4, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Maharashtra", country: "India", languages: ["English", "Marathi", "Hindi"], services: ["Music teacher", "Event planning"] },
  { id: "sk3", name: "Amit More", rating: 4, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Bhopal", country: "India", languages: ["Hindi"], services: ["Music teacher", "Event planning"] },
  { id: "sk4", name: "Neelam Mane", rating: 4.5, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Bhopal", country: "India", languages: ["English", "Hindi"], services: ["Music teacher", "Event planning"] },
  { id: "sk5", name: "Abhishek Bajaj", rating: 5, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Bhopal", country: "India", languages: ["English", "Hindi"], services: ["Music teacher", "Event planning"] },
  { id: "sk6", name: "Priya Sharma", rating: 4, photo: "", bio: "Mrunalini, a dedicated educator from Bharat, India, specializes in Shashtriya Sangeet, offering personalized lessons for all skill levels.", city: "Delhi", country: "India", languages: ["English", "Hindi"], services: ["Music teacher", "Event planning"] },
];

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

  useEffect(() => {
    // Simulate quick load to match fast UX
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  const getUniqueServiceTypes = () => {
    const serviceTypes = sampleSeekers.flatMap(seeker => seeker.services);
    return Array.from(new Set(serviceTypes.filter(Boolean))).sort();
  };

  const filteredSeekers = sampleSeekers.filter(seeker => {
    const query = searchQuery.toLowerCase();
    const locQuery = locationSearch.toLowerCase();

    const matchesSearch = !query ||
      seeker.name.toLowerCase().includes(query) ||
      seeker.bio.toLowerCase().includes(query) ||
      seeker.services.some(svc => svc.toLowerCase().includes(query));

    const matchesLocation = !locQuery ||
      seeker.city.toLowerCase().includes(locQuery) ||
      seeker.country.toLowerCase().includes(locQuery);

    const matchesCategory = !categoryFilter ||
      seeker.services.some(svc => svc.toLowerCase() === categoryFilter.toLowerCase());

    return matchesSearch && matchesLocation && matchesCategory;
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 text-gray-400">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-desi-orange mb-4"></div>
      Loading Service Providers...
    </div>
  );

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
                Service Provider List <span className={styles.jobCount}>{filteredSeekers.length}</span>
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
                Service Provider List <span className={styles.jobCount}>{filteredSeekers.length}</span>
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
          <div className="text-center p-20 w-100">
            <h3 className="text-xl font-bold text-desi-dark mb-2">No service providers found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query.</p>
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
                  <tr key={seeker.id}>
                    <td><strong>{seeker.name}</strong></td>
                    <td>
                      {seeker.services.join(", ")}
                    </td>
                    <td>{seeker.rating} ⭐</td>
                    <td>{`${seeker.city}, ${seeker.country}`}</td>
                    <td>
                      <span className={styles.viewDetailsLink} onClick={() => router.push(`/seekers/${seeker.id}`)}>View Profile</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.seekerGrid}>
            {filteredSeekers.map((seeker) => (
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
