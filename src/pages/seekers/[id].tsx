import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import styles from "@/styles/Profile.module.css";
import { userProfileStore } from "@/stores/UserProfileStore";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
import { getWorkPhotoUrls } from "@/utils/s3Helper";
import { toast } from "react-toastify";

// Reuse same icon components from profile page
const LocationIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const EmailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const MessageIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.394 0 12.03c0 2.12.553 4.189 1.603 5.923L0 24l6.126-1.608a11.846 11.846 0 005.918 1.586h.005c6.632 0 12.028-5.396 12.032-12.033a11.833 11.833 0 00-3.535-8.503" />
    </svg>
);

const ChevronUpIcon = ({ style: iconStyle }: { style?: React.CSSProperties }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={iconStyle}>
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
);

interface SeekerProfile {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    phone: string;
    mobile: string;
    rating: number;
    location: string;
    photo: string;
    aboutMe: string;
    languages: string;
    commutePreference: string;
    dietaryPreference: string;
    okWithPets: string;
    address: {
        line1: string;
        line2: string;
        city: string;
        state: string;
        zipCode: string;
    };
    services: any[];
    jobsOffered: any[];
    socialLinks: {
        facebook: string;
        whatsapp: string;
        instagram: string;
        twitter: string;
        linkedin: string;
    };
}

interface PageProps {
    seekerProfile: SeekerProfile | null;
}

const SeekerProfilePage = ({ seekerProfile }: PageProps) => {
    const router = useRouter();
    const { userProfile } = userProfileStore();
    const [activeTab, setActiveTab] = useState("services");
    const [expandedSections, setExpandedSections] = useState({
        services: true,
        jobs: true,
        testimonials: true,
    });
    const [expandedService, setExpandedService] = useState<number | null>(null);
    const [expandedJob, setExpandedJob] = useState<number | null>(null);
    const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
    const [profilePhotoError, setProfilePhotoError] = useState(false);

    // Feedback state
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [modalRating, setModalRating] = useState(0);
    const [testimonials, setTestimonials] = useState<any[]>([]);

    const displayRating = Number(seekerProfile?.rating) || 0; 
    // e.g. 3.4, 4.5

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const tabs = [
        { id: "services", label: "Services Provided" },
        { id: "jobs", label: "Jobs Offered by Me" },
        { id: "testimonials", label: "Testimonials" },
    ];

    const getStarColor = (rating: number) => {
        if (rating >= 4) return '#22c55e';
        if (rating >= 3) return '#eab308';
        return '#ef4444';
    };

    const renderStars = (rating: number, prefix: string = "star") => {
        const color = getStarColor(rating);
        return Array(5).fill(0).map((_, i) => (
            <span
                key={`${prefix}-${i}`}
                className={styles.star}
                style={{ color: i < Math.round(rating) ? color : '#ddd', fontSize: '20px' }}
            >★</span>
        ));
    };

    const getServiceIconClass = (type: string) => {
        switch (type) {
            case "photo": return styles.serviceIconPhoto;
            case "event": return styles.serviceIconEvent;
            case "baking": return styles.serviceIconBaking;
            default: return styles.serviceIconPhoto;
        }
    };

    // Resolve profile photo from S3
    useEffect(() => {
        const fetchPhoto = async () => {
            if (!seekerProfile?.photo || seekerProfile.photo === "/newassets/account_circle.png") return;
            try {
                const urls = await getWorkPhotoUrls("", [seekerProfile.photo]);
                if (urls.length > 0) setPhotoUrl(urls[0]);
            } catch (e) {
                console.error("Error fetching profile photo:", e);
            }
        };
        fetchPhoto();
    }, [seekerProfile?.photo]);

    // Fetch testimonials
    useEffect(() => {
        if (seekerProfile?.id) {
            fetchFeedback(seekerProfile.id);
        }
    }, [seekerProfile?.id]);

    const fetchFeedback = async (id: string) => {
        try {
            const res = await ApiService.crud(APIDetails.getFeedback, id);
            if (res[0] && Array.isArray(res[1])) {
                const mapped = res[1].map((f: any) => ({
                    id: f._id || Math.random().toString(),
                    rating: Number(f.rating) || 0,
                    text: f.comments || f.feedback || "",
                    highlightName: "",
                    reviewerName: f.reviewerName || "Anonymous",
                    reviewerLocation: "",
                    reviewerPhoto: f.reviewerPhoto || "/assets/icons/icon_user.svg"
                }));
                setTestimonials(mapped);
            }
        } catch (e) {
            console.error("Error fetching feedback:", e);
        }
    };

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!seekerProfile) return;

        if (modalRating === 0) {
            toast.warn("Please select a star rating before submitting.");
            return;
        }

        try {
            const email = Cookies.get(cookieParams.email) || "";
            const emailPrefix = email ? email.split("@")[0] : null;
            const rName = userProfile?.displayName ||
                (userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : null) ||
                (userProfile?.email ? userProfile.email.split('@')[0] : null) ||
                emailPrefix ||
                "User";

            const payload = {
                jobSeekerId: seekerProfile.id,
                jobId: "general", // Required field backend expects
                rating: modalRating,
                comments: feedback,
                feedback: feedback, // Backend expects both
                reviewerName: rName
            };

            const res = await ApiService.crud(APIDetails.postFeedback, payload);
            if (res && res[0]) {
                await fetchFeedback(seekerProfile.id);
                handleCloseModal();
                toast.success("Feedback submitted successfully!");
            } else {
                toast.error(res?.[1] || "Failed to submit feedback.");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            toast.error("An error occurred while submitting feedback.");
        }
    };

    const handleCloseModal = () => {
        setShowFeedbackModal(false);
        setFeedback("");
        setModalRating(0);
    };

    if (!seekerProfile) {
        return (
            <div className="container p-5 text-center">
                <h2>Service Provider Not Found</h2>
                <button className="btn btn-secondary mt-3" onClick={() => router.back()}>Go Back</button>
            </div>
        );
    }

    const fullName = (seekerProfile.firstName || seekerProfile.lastName)
        ? `${seekerProfile.firstName} ${seekerProfile.lastName}`.trim()
        : seekerProfile.displayName || "Service Provider";

    return (
        <>
            <Head>
                <title>{fullName} - Profile | DesiHelpers</title>
            </Head>

            <div className={styles.profilePage}>
                {/* Profile Header — matches /profile layout exactly */}
                <div className={styles.profileHeader}>
                    <div className={styles.headerBackground}></div>
                    <div className={styles.headerBackgroundRight}></div>

                    {/* Social Icons — always show all 5 */}
                    <div className={styles.socialIconsRow}>
                        <a href={seekerProfile.socialLinks.facebook || "#"} className={styles.socialIcon} title="Facebook" target="_blank" rel="noopener noreferrer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                        </a>
                        <a href={seekerProfile.socialLinks.whatsapp ? `https://wa.me/${seekerProfile.socialLinks.whatsapp}` : "#"} className={styles.socialIcon} title="WhatsApp" target="_blank" rel="noopener noreferrer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.394 0 12.03c0 2.12.553 4.189 1.603 5.923L0 24l6.126-1.608a11.846 11.846 0 005.918 1.586h.005c6.632 0 12.028-5.396 12.032-12.033a11.833 11.833 0 00-3.535-8.503" /></svg>
                        </a>
                        <a href={seekerProfile.socialLinks.instagram || "#"} className={styles.socialIcon} title="Instagram" target="_blank" rel="noopener noreferrer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.171.054 1.81.247 2.23.408.56.216.96.474 1.38.894.42.42.678.82.894 1.38.161.42.354 1.059.408 2.23.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.171-.247 1.81-.408 2.23-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.42.161-1.059.354-2.23.408-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.171-.054-1.81-.247-2.23-.408-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.42-.42-.354-1.059-.408-2.23C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.171.247-1.81.408-2.23.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.42-.161 1.059-.354 2.23-.408 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 5.775.129 4.903.332 4.145.627c-.783.304-1.447.712-2.108 1.373S.931 3.362.627 4.145c-.295.758-.498 1.63-.555 2.908C.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.057 1.278.26 2.15.555 2.908.304.783.712 1.447 1.373 2.108s1.322 1.069 2.108 1.373c.758.295 1.63.498 2.908.555 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.278-.057 2.15-.26 2.908-.555.783-.304 1.447-.712 2.108-1.373s1.069-1.322 1.373-2.108c.295-.758.498-1.63.555-2.908.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.057-1.278-.26-2.15-.555-2.908-.304-.783-.712-1.447-1.373-2.108s-1.322-1.069-2.108-1.373c-.758-.295-1.63-.498-2.908-.555C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
                        </a>
                        <a href={seekerProfile.socialLinks.twitter || "#"} className={styles.socialIcon} title="X" target="_blank" rel="noopener noreferrer">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </a>
                        <a href={seekerProfile.socialLinks.linkedin || "#"} className={styles.socialIcon} title="LinkedIn" target="_blank" rel="noopener noreferrer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                        </a>
                    </div>

                    {/* Profile Info Section */}
                    <div className={styles.profileInfoSection}>
                        <div className={styles.profilePhotoContainer}>
                            {photoUrl && !profilePhotoError ? (
                                <img
                                    src={photoUrl}
                                    alt={fullName}
                                    className={styles.profilePhoto}
                                    onError={() => setProfilePhotoError(true)}
                                />
                            ) : (
                                <div className={styles.defaultAvatar}>
                                    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="60" cy="60" r="60" fill="#E8ECF1" />
                                        <circle cx="60" cy="44" r="16" fill="#003B73" />
                                        <path d="M28 100c0-17.673 14.327-32 32-32s32 14.327 32 32" fill="#003B73" />
                                    </svg>
                                </div>
                            )}
                            {/* No camera icon for public view */}
                        </div>

                        <div className={styles.profileDetails}>
                            <h1 className={styles.profileName}>{fullName}</h1>
                            <div className={styles.starRating} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {renderStars(displayRating, "main-rating")}
                                <span style={{ color: '#ffb400', fontWeight: 700, fontSize: '15px' }}>{displayRating.toFixed(1)}</span>
                            </div>
                            <div className={styles.profileLocation}>
                                <LocationIcon />
                                <span>{seekerProfile.location || "Location not provided"}</span>
                            </div>

                            <div className={styles.actionButtons}>
                                {seekerProfile.phone && (
                                    <a href={`tel:${seekerProfile.phone}`} className={`${styles.actionBtn} ${styles.callBtn}`}>
                                        <PhoneIcon /> Call ME
                                    </a>
                                )}
                                {seekerProfile.email && (
                                    <a href={`mailto:${seekerProfile.email}`} className={`${styles.actionBtn} ${styles.emailBtn}`}>
                                        <EmailIcon /> Email Me
                                    </a>
                                )}
                                {seekerProfile.mobile && (
                                    <a href={`https://wa.me/${seekerProfile.mobile}`} target="_blank" rel="noopener noreferrer" className={`${styles.actionBtn} ${styles.whatsappBtn}`}>
                                        <WhatsAppIcon /> Whatsapp Me
                                    </a>
                                )}
                                {seekerProfile.id && (
                                    <button 
                                        className={`${styles.actionBtn} ${styles.messageBtn}`} 
                                        onClick={() => router.push(`/Messages?userId=${seekerProfile.id}`)}
                                    >
                                        <MessageIcon /> Message Me
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content — same sidebar + main layout as profile page */}
                <div className={styles.profileContent}>
                    {/* Sidebar */}
                    <div className={styles.sidebar}>
                        {/* About Me Card — read-only, no edit icon */}
                        <div className={styles.sidebarCard}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle} style={{ color: '#003385' }}>About Me</h3>
                            </div>
                            <div className={styles.cardContent}>
                                <p style={{ margin: 0, color: '#444', fontSize: '14px', lineHeight: '1.5' }}>
                                    {seekerProfile.aboutMe || "-"} {seekerProfile.aboutMe && <span className={styles.readMore} style={{ fontWeight: 500 }}>Read more...</span>}
                                </p>

                                <div className={styles.infoRow} style={{ marginTop: "20px" }}>
                                    <div className={styles.infoLabel}>Languages Spoken</div>
                                    <div className={styles.infoValue}>{seekerProfile.languages || "-"}</div>
                                </div>

                                <div className={styles.infoGrid} style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>Commute Preference</div>
                                        <div className={styles.infoValue}>{seekerProfile.commutePreference || "-"}</div>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>Dietary Preference</div>
                                        <div className={styles.infoValue}>{seekerProfile.dietaryPreference || "-"}</div>
                                    </div>
                                </div>

                                <div className={styles.infoRow} style={{ marginTop: "15px" }}>
                                    <div className={styles.infoLabel}>OK With Pets</div>
                                    <div className={styles.infoValue}>{seekerProfile.okWithPets || "-"}</div>
                                </div>
                            </div>
                        </div>

                        {/* Address Details Card — read-only, no edit icon */}
                        <div className={styles.sidebarCard}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle} style={{ color: '#003385' }}>Address Details</h3>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>Address Line 1</div>
                                    <div className={styles.infoValue}>{seekerProfile.address.line1 || "-"}</div>
                                </div>
                                <div className={styles.infoRow} style={{ marginTop: "15px" }}>
                                    <div className={styles.infoLabel}>Address Line 2</div>
                                    <div className={styles.infoValue}>{seekerProfile.address.line2 || "-"}</div>
                                </div>
                                <div className={styles.infoGrid} style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>City</div>
                                        <div className={styles.infoValue}>{seekerProfile.address.city || "-"}</div>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>State</div>
                                        <div className={styles.infoValue}>{seekerProfile.address.state || "-"}</div>
                                    </div>
                                </div>
                                <div className={styles.infoRow} style={{ marginTop: "15px" }}>
                                    <div className={styles.infoLabel}>Zip Code</div>
                                    <div className={styles.infoValue}>{seekerProfile.address.zipCode || "-"}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area with Tabs */}
                    <div className={styles.mainContent}>
                        {/* Desktop Tabs Header — only Services + Testimonials */}
                        <div className={`${styles.tabsHeader} ${styles.desktopOnly}`}>
                            {tabs.map(tab => (
                                <div
                                    key={tab.id}
                                    className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </div>
                            ))}
                            {/* Add Feedback button — only on Testimonials tab */}
                            {activeTab === 'testimonials' && (
                                <div className={styles.addServicesBtn} onClick={() => {
                                    setFeedback("");
                                    setModalRating(0);
                                    setShowFeedbackModal(true);
                                }}>
                                    <span style={{ color: '#f07c00' }}>+ Add Feedback</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Services Section — Read-only */}
                        <div className={activeTab === 'services' ? styles.activeTabContent : styles.mobileOnly}>
                            <div className={`${styles.sidebarCard} ${activeTab === 'services' ? styles.tabSection : ""}`}>
                                <div className={`${styles.cardHeader} ${styles.mobileOnly}`} onClick={() => toggleSection('services')} style={{ cursor: 'pointer' }}>
                                    <h3 className={styles.cardTitle} style={{ color: '#ff6b35' }}>Services Provided</h3>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <span style={{ transform: expandedSections.services ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", color: '#ff6b35' }}>
                                            <ChevronUpIcon />
                                        </span>
                                    </div>
                                </div>
                                {(expandedSections.services || activeTab === 'services') && (
                                    <div className={styles.cardContent} style={{ padding: '0' }}>
                                        {seekerProfile.services && seekerProfile.services.length > 0 ? (
                                            seekerProfile.services.map((service) => (
                                                <div key={service.id} className={styles.serviceCard}>
                                                    <div className={styles.serviceHeader}>
                                                        <div className={`${styles.serviceIcon} ${getServiceIconClass(service.iconType)}`}>
                                                            {service.icon}
                                                        </div>
                                                        <h4 className={styles.serviceTitle} style={{ color: '#003385' }}>{service.title}</h4>
                                                    </div>

                                                    <div className={styles.serviceDetails}>
                                                        <div className={styles.serviceDetail}>
                                                            <span className={styles.detailLabel}>Category</span>
                                                            <span className={styles.detailValue}>{service.category}</span>
                                                        </div>
                                                        <div className={styles.serviceDetail}>
                                                            <span className={styles.detailLabel}>Experience</span>
                                                            <span className={styles.detailValue}>{service.experience}</span>
                                                        </div>
                                                        <div className={styles.serviceDetail}>
                                                            <span className={styles.detailLabel}>Available</span>
                                                            <span className={styles.detailValue}>{service.available}</span>
                                                        </div>
                                                    </div>

                                                    {service.description && expandedService === service.id && (
                                                        <p className={styles.serviceDescription}>{service.description}</p>
                                                    )}

                                                    {service.description && (
                                                        <button
                                                            className={styles.showMoreBtn}
                                                            onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                                                        >
                                                            {expandedService === service.id ? "Show Less..." : "Show More..."}
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                                                No services provided yet
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Jobs Offered Section — Read-only, no edit buttons */}
                        <div className={activeTab === 'jobs' ? styles.activeTabContent : styles.mobileOnly}>
                            <div className={`${styles.sidebarCard} ${activeTab === 'jobs' ? styles.tabSection : ""}`}>
                                <div className={`${styles.cardHeader} ${styles.mobileOnly}`} onClick={() => toggleSection('jobs')} style={{ cursor: 'pointer' }}>
                                    <h3 className={styles.cardTitle} style={{ color: '#ff6b35' }}>Jobs Offered by Me</h3>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <span style={{ transform: expandedSections.jobs ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", color: '#ff6b35' }}>
                                            <ChevronUpIcon />
                                        </span>
                                    </div>
                                </div>
                                {(expandedSections.jobs || activeTab === 'jobs') && (
                                    <div className={styles.cardContent} style={{ padding: '0' }}>
                                        {seekerProfile.jobsOffered && seekerProfile.jobsOffered.length > 0 ? (
                                            seekerProfile.jobsOffered.map((job: any) => (
                                                <div key={job.id} className={styles.jobCard}>
                                                    <div className={styles.jobHeader}>
                                                        <div className={styles.jobIcon}>{job.icon || "👶"}</div>
                                                        <div className={styles.jobTitleArea}>
                                                            <h4 className={styles.jobTitle} style={{ color: '#003385' }}>{job.title}</h4>
                                                        </div>
                                                    </div>

                                                    <div className={styles.jobDetailsGrid}>
                                                        <div className={styles.jobDetail}>
                                                            <span className={styles.jobDetailLabel}>Location</span>
                                                            <span className={styles.jobDetailValue}>{job.location || "-"}</span>
                                                        </div>
                                                        <div className={styles.jobDetail}>
                                                            <span className={styles.jobDetailLabel}>Start Date</span>
                                                            <span className={styles.jobDetailValue}>{job.startDate || "-"}</span>
                                                        </div>
                                                        <div className={styles.jobDetail}>
                                                            <span className={styles.jobDetailLabel}>Req Experience (in years)</span>
                                                            <span className={styles.jobDetailValue}>{job.reqExperience || "-"}</span>
                                                        </div>
                                                        <div className={styles.jobDetail}>
                                                            <span className={styles.jobDetailLabel}>Work Type</span>
                                                            <span className={styles.jobDetailValue}>{job.workType || "-"}</span>
                                                        </div>
                                                        <div className={styles.jobDetail}>
                                                            <span className={styles.jobDetailLabel}>Days per week</span>
                                                            <span className={styles.jobDetailValue}>{job.daysPerWeek || "-"}</span>
                                                        </div>
                                                        <div className={styles.jobDetail}>
                                                            <span className={styles.jobDetailLabel}>Pay Range</span>
                                                            <span className={styles.jobDetailValue}>{job.payRange || "-"}</span>
                                                        </div>
                                                        <div className={styles.jobDetail}>
                                                            <span className={styles.jobDetailLabel}>Dietary Preference</span>
                                                            <span className={styles.jobDetailValue}>{job.dietaryPreference || "-"}</span>
                                                        </div>
                                                        <div className={styles.jobDetail}>
                                                            <span className={styles.jobDetailLabel}>Posted Date</span>
                                                            <span className={styles.jobDetailValue}>{job.postedDate || "-"}</span>
                                                        </div>
                                                    </div>

                                                    {job.description && (
                                                        <div className={styles.jobDescription}>
                                                            {expandedJob === job.id ? (
                                                                <p>{job.description}</p>
                                                            ) : (
                                                                <p>{job.description.slice(0, 300)}{job.description.length > 300 ? '...' : ''}</p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {job.description && job.description.length > 300 && (
                                                        <button
                                                            className={styles.readMoreBtn}
                                                            onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                                                        >
                                                            {expandedJob === job.id ? "Show Less..." : "Read More..."}
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                                                No jobs offered yet
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Testimonials Section — Read-only + Add Feedback */}
                        <div className={activeTab === 'testimonials' ? styles.activeTabContent : styles.mobileOnly}>
                            <div className={`${styles.sidebarCard} ${activeTab === 'testimonials' ? styles.tabSection : ""}`}>
                                <div className={`${styles.cardHeader} ${styles.mobileOnly}`} onClick={() => toggleSection('testimonials')} style={{ cursor: 'pointer' }}>
                                    <h3 className={styles.cardTitle} style={{ color: '#ff6b35' }}>Testimonials</h3>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <span style={{ transform: expandedSections.testimonials ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", color: '#ff6b35' }}>
                                            <ChevronUpIcon />
                                        </span>
                                    </div>
                                </div>
                                {(expandedSections.testimonials || activeTab === 'testimonials') && (
                                    <div className={styles.cardContent} style={{ padding: '0' }}>
                                        <div className={styles.testimonialToggle}>
                                            <button
                                                className={`${styles.toggleBtn} ${styles.toggleBtnActive}`}
                                                style={{ width: '100%', borderRadius: '8px' }}
                                            >
                                                Feedback Received
                                            </button>
                                        </div>

                                        <div className={styles.testimonialsList}>
                                            {testimonials && testimonials.length > 0 ? (
                                                testimonials.map((testimonial) => (
                                                    <div key={testimonial.id} className={styles.testimonialCard}>
                                                        <div className={styles.testimonialStars}>
                                                            {Array(5).fill(0).map((_, i) => (
                                                                <span
                                                                    key={`${testimonial.id}-star-${i}`}
                                                                    className={styles.testimonialStar}
                                                                    style={{ color: i < Math.round(testimonial.rating) ? getStarColor(testimonial.rating) : '#ddd', fontSize: '20px' }}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <p className={styles.testimonialText}>
                                                            &quot;{testimonial.text}&quot;
                                                        </p>
                                                        <div className={styles.reviewerInfo}>
                                                            <img
                                                                src={testimonial.reviewerPhoto}
                                                                alt={testimonial.reviewerName}
                                                                className={styles.reviewerPhoto}
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = "/assets/icons/icon_user.svg";
                                                                }}
                                                            />
                                                            <div className={styles.reviewerDetails}>
                                                                <span className={styles.reviewerName}>{testimonial.reviewerName}</span>
                                                                {testimonial.reviewerLocation && (
                                                                    <span className={styles.reviewerLocation}>
                                                                        <LocationIcon />
                                                                        {testimonial.reviewerLocation}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                                                    No testimonials received yet. Be the first to leave feedback!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Modal — uses same Profile.module.css modal styles */}
            {showFeedbackModal && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modalContainer} style={{ minWidth: '500px', maxWidth: '90%' }} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Leave Feedback for {fullName}</h2>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>×</button>
                        </div>

                        <div className="p-4 pt-2">
                            <Form onSubmit={handleFeedbackSubmit}>
                                <div className="mb-4 p-3 rounded" style={{ border: '1px solid #eee', backgroundColor: '#fff' }}>
                                    <Form.Group className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <Form.Label className="fw-bold fs-6 m-0" style={{ color: '#001838' }}>Rate Experience</Form.Label>
                                            <div className="d-flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => {
                                                    const color = modalRating >= 4 ? "#22c55e" : modalRating >= 2 ? "#eab308" : modalRating === 1 ? "#ef4444" : "#e0e0e0";
                                                    return (
                                                        <span
                                                            key={star}
                                                            role="button"
                                                            onClick={() => setModalRating(star)}
                                                            style={{
                                                                color: star <= modalRating ? color : "#e0e0e0",
                                                                fontSize: '24px',
                                                                transition: 'color 0.2s',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            ★
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Write your feedback here..."
                                            required
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                padding: '0',
                                                resize: 'none',
                                                fontSize: '14px',
                                                boxShadow: 'none'
                                            }}
                                        />
                                    </Form.Group>
                                </div>

                                <div className={styles.modalActions} style={{ marginTop: '20px' }}>
                                    <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>Cancel</button>
                                    <button type="button" className={styles.updateBtn} onClick={handleFeedbackSubmit}>Submit</button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params as { id: string };

    let seekerProfile: SeekerProfile | null = null;

    try {
        const result = await ApiService.crud(APIDetails.ShareProfileSeeker, id);
        if (result[0] && result[1]) {
            const s = result[1];
            seekerProfile = {
                id: s.userId || s._id || s.id || id,
                firstName: s.firstName || "",
                lastName: s.lastName || "",
                displayName: s.displayName || "",
                email: s.email || "",
                phone: s.phone || s.mobile || "",
                mobile: s.mobile || s.phone || "",
                rating: s.rating || 0,
                location: `${s.city || ""}, ${s.state || ""}`.replace(/^, | , $/g, ''),
                photo: s.profilePhoto || "",
                aboutMe: s.aboutMe || "",
                languages: s.languagesSpoken?.join(", ") || "",
                commutePreference: s.commutePreference || "Not specified",
                dietaryPreference: s.dietaryRestrictions || "Not specified",
                okWithPets: s.okWithPets === true ? "Yes" : s.okWithPets === false ? "No" : "Not mentioned",
                address: {
                    line1: s.addressLine1 || "",
                    line2: s.addressLine2 || "",
                    city: s.city || "",
                    state: s.state || "",
                    zipCode: s.zipCode || "",
                },
                services: s.jobDetails ? s.jobDetails.map((j: any, i: number) => ({
                    id: j.id || j._id || i,
                    title: j.subCategory || j.jobType || "Service",
                    icon: j.icons || "🛠️",
                    iconType: "photo",
                    category: "Professionals",
                    experience: `${j.yearsOfExperience || 0} Years`,
                    available: j.available ? "Yes" : "No",
                    description: j.description || ""
                })) : [],
                socialLinks: {
                    facebook: s.facebookLink || "",
                    whatsapp: s.phone || "",
                    instagram: s.instagram || "",
                    twitter: s.twitterLink || "",
                    linkedin: s.linkedinLink || "",
                },
                jobsOffered: [],
            };

            // Fetch jobs offered by this seeker
            if (s.email) {
                try {
                    const jobsResult = await ApiService.crud([APIDetails.getJobsByUser[0] + s.email, APIDetails.getJobsByUser[1], APIDetails.getJobsByUser[2]], null);
                    if (jobsResult[0] && Array.isArray(jobsResult[1])) {
                        seekerProfile.jobsOffered = jobsResult[1].map((j: any, i: number) => ({
                            id: j._id || j.id || i,
                            title: j.title || j.jobTitle || "Job",
                            icon: "👶",
                            location: j.location || j.city || "",
                            startDate: j.startDate || "",
                            reqExperience: j.reqExperience || j.experience || "",
                            workType: j.workType || "Part Time",
                            daysPerWeek: j.daysPerWeek || "",
                            payRange: j.payRange || "",
                            dietaryPreference: j.dietaryPreference || "",
                            postedDate: j.createdAt ? new Date(j.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "",
                            description: j.jobRequirements || j.description || ""
                        }));
                    }
                } catch (jobErr) {
                    console.error("Failed to fetch seeker jobs:", jobErr);
                }
            }
        }
    } catch (err) {
        console.error("Failed to fetch seeker profile:", err);
    }

    if (!seekerProfile) {
        return { notFound: true };
    }

    return {
        props: { seekerProfile },
    };
};

export default SeekerProfilePage;
