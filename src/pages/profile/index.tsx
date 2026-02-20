import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Routes } from "@/services/routes/Routes";
import styles from "@/styles/Profile.module.css";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import DesiHelpersIcon from "@/components/static/DesiHelpersIcon";
import CEditProfileModal from "@/components/page_related/profile/CEditProfileModal";
import CAddressEditModal from "@/components/page_related/profile/CAddressEditModal";
import CPersonalSocialModal from "@/components/page_related/profile/CPersonalSocialModal";
import CPhotoUploadModal from "@/components/page_related/profile/CPhotoUploadModal";
import CServicesModal from "@/components/page_related/profile/CServicesModal";
import CJobsOfferingModal from "@/components/page_related/profile/CJobsOfferingModal";
import CFeedbackModal from "@/components/page_related/profile/CFeedbackModal";

// Icons as components
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

const WhatsAppIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.394 0 12.03c0 2.12.553 4.189 1.603 5.923L0 24l6.126-1.608a11.846 11.846 0 005.918 1.586h.005c6.632 0 12.028-5.396 12.032-12.033a11.833 11.833 0 00-3.535-8.503" /></svg>
);

const EditIcon = ({ color = "currentColor" }: { color?: string }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
);

const ShareIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

const CameraIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
    </svg>
);

const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const ChevronUpIcon = ({ style }: { style?: React.CSSProperties }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
);

// Sample profile data (replace with API data)
const sampleProfile = {
    firstName: "Tania",
    lastName: "Mal",
    displayName: "Tania",
    gender: "Female",
    email: "taniamal@gmail.com",
    mobileNumber: "425-555-0156",
    whatsappNumber: "425-555-0156",
    rating: 5,
    location: "Bellevue, Washington",
    photo: "/assets/images/profile_pic.jpg",
    aboutMe: "Snaps by Shelley is a professional photography service that specializes in capturing memorable moments. Whether it's a wedding...",
    languages: "Punjabi, Hindi, and Marathi",
    commutePreference: "Have a ride",
    dietaryPreference: "Veg., Non-Veg",
    okWithPets: "No",
    address: {
        line1: "425 108th Ave NE",
        line2: "Apt 1203",
        city: "Bellevue",
        state: "Washington",
        zipCode: "98004"
    },
    services: [
        {
            id: 1,
            title: "Photography Services",
            icon: "📷",
            iconType: "photo",
            category: "Professionals",
            experience: "15 Years",
            available: "Yes",
            description: "Greeting customers, assisting with product selection, operating cash registers, processing transactions, maintaining store cleanliness."
        },
        {
            id: 2,
            title: "Event Management Services",
            icon: "🎯",
            iconType: "event",
            category: "Professionals",
            experience: "5 Years",
            available: "Yes",
            description: ""
        },
        {
            id: 3,
            title: "Baking Services",
            icon: "🍞",
            iconType: "baking",
            category: "Professionals",
            experience: "3 Years",
            available: "Yes",
            description: ""
        }
    ],
    jobsOffered: [
        {
            id: 1,
            title: "Looking Nanny Services",
            icon: "👶",
            location: "Bothell, Washington",
            startDate: "Apr 21, 2025, 9:30 PM",
            reqExperience: "5",
            workType: "Full Time",
            daysPerWeek: "5",
            payRange: "$15 - $25",
            dietaryPreference: "Veg/Non-Veg",
            postedDate: "Apr 16, 2025",
            description: "Hello, I am looking for an English/Telugu speaking nanny for our 7 month old starting mid April until mid July in Bothell. We are looking to hire for an average of 30 hours per week.\nResponsibilities include:\n1. Feeding baby\n2. Baby activities (reading, safe play, engaging, changing diapers)\n3. Baby bottle cleaning, baby laundry, cleaning toys, baby room cleanup (taking the diaper pail out, etc.)\nMust have requirements:\n1. Experience with newborns; would like to see references from previous families that you cared for"
        }
    ],
    testimonialsReceived: [
        {
            id: 1,
            rating: 5,
            text: "I recently used the airport drop service and it was fantastic! Tania Mal arrived right on time and made my journey to the airport so smooth. I really appreciate the convenience and professionalism of the team. Thank you for making my travel experience stress-free!",
            highlightName: "Tania Mal",
            reviewerName: "Arjun Reddy",
            reviewerLocation: "Seattle, Washington",
            reviewerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        },
        {
            id: 2,
            rating: 4,
            text: "Tania Mal was amazing! She was punctual, courteous, and made the entire ride super comfortable. I felt completely at ease throughout the journey. Highly recommended for anyone looking for a reliable airport drop service!",
            highlightName: "Tania Mal",
            reviewerName: "Neha Sharma",
            reviewerLocation: "Dallas, Texas",
            reviewerPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
        },
        {
            id: 3,
            rating: 5,
            text: "Great experience with Tania Mal! She handled everything so smoothly — from timely pickup to helping with my luggage. The ride was pleasant and hassle-free. Truly impressed with her professionalism and friendly nature!",
            highlightName: "Tania Mal",
            reviewerName: "Deepak Nair",
            reviewerLocation: "Boston, Massachusetts",
            reviewerPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
        }
    ],
    testimonialsGiven: [],
    photoGallery: [
        {
            id: 1,
            url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
            alt: "Colorful birthday cake with sprinkles"
        }
    ],
    socialLinks: {
        facebook: "#",
        whatsapp: "#",
        instagram: "#",
        twitter: "#",
        linkedin: "#"
    }
};

interface ProfileUpdateData {
    aboutMe: string;
    commutePreference: string;
    dietaryPreference: string;
    okWithPets: string;
}

interface ServiceUpdateData {
    id: string | number;
    title: string;
    category: string;
    experience: string | number;
    offeringNow: string | boolean;
    description: string;
}

interface AddressUpdateData {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zipCode: string;
}

interface PersonalSocialUpdateData {
    firstName: string;
    lastName: string;
    displayName: string;
    gender: string;
    email: string;
    mobileNumber: string;
    whatsappNumber: string;
    facebookLink: string;
    instagramLink: string;
}


const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState("services"); // Keeping for possible desktop fallback not requested
    const [expandedSections, setExpandedSections] = useState({
        services: true,
        jobs: true,
        testimonials: true,
        gallery: true,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const [profile, setProfile] = useState(sampleProfile);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [servicesModalOpen, setServicesModalOpen] = useState(false);
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [personalSocialModalOpen, setPersonalSocialModalOpen] = useState(false);
    const [photoModalOpen, setPhotoModalOpen] = useState(false);
    const [jobsModalOpen, setJobsModalOpen] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
    const [expandedService, setExpandedService] = useState<number | null>(null);
    const [expandedJob, setExpandedJob] = useState<number | null>(null);
    const [testimonialFilter, setTestimonialFilter] = useState<"received" | "given">("received");
    const [expandedPhoto, setExpandedPhoto] = useState<{ url: string; alt: string } | null>(null);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState("Eng");

    // Delete photo handler
    const handleDeletePhoto = (photoId: number) => {
        if (window.confirm("Are you sure you want to delete this photo?")) {
            setProfile({
                ...profile,
                photoGallery: profile.photoGallery.filter(p => p.id !== photoId)
            });
        }
    };

    const tabs = [
        { id: "services", label: "Services Provided" },
        { id: "jobs", label: "Jobs Offered by Me" },
        { id: "testimonials", label: "Testimonials" },
        { id: "gallery", label: "Photo Gallery" }
    ];

    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <span key={i} className={styles.star}>★</span>
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

    const handleLangChange = (lang: string) => {
        setSelectedLang(lang);
        setLangDropdownOpen(false);
    };

    const handleProfileUpdate = (updatedData: ProfileUpdateData) => {
        setProfile({
            ...profile,
            aboutMe: updatedData.aboutMe,
            commutePreference: updatedData.commutePreference,
            dietaryPreference: updatedData.dietaryPreference,
            okWithPets: updatedData.okWithPets,
        });
        setEditModalOpen(false);
    };

    const handleServicesUpdate = (updatedServices: ServiceUpdateData[]) => {
        setProfile({
            ...profile,
            services: updatedServices.map(s => ({
                id: isNaN(Number(s.id)) ? Math.floor(Math.random() * 1000) : Number(s.id),
                title: s.title,
                icon: "🛠️", // Default icon for new ones
                iconType: "photo",
                category: s.category,
                experience: s.experience + " Years",
                available: s.offeringNow ? "Yes" : "No",
                description: s.description
            }))
        });
        setServicesModalOpen(false);
    };

    const handleAddressUpdate = (updatedAddress: AddressUpdateData) => {
        setProfile({
            ...profile,
            address: updatedAddress
        });
        setAddressModalOpen(false);
    };

    const handlePersonalSocialUpdate = (updatedData: PersonalSocialUpdateData) => {
        setProfile({
            ...profile,
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
            displayName: updatedData.displayName,
            gender: updatedData.gender,
            email: updatedData.email,
            mobileNumber: updatedData.mobileNumber,
            whatsappNumber: updatedData.whatsappNumber,
            socialLinks: {
                ...profile.socialLinks,
                facebook: updatedData.facebookLink,
                instagram: updatedData.instagramLink
            }
        });
        setPersonalSocialModalOpen(false);
    };

    const handlePhotoSave = (photos: File[]) => {
        // Logic to handle photo upload would go here
        console.log("Saving photos:", photos);
        setPhotoModalOpen(false);
    };

    const handleJobsUpdate = (updatedJobs: any[]) => {
        setProfile({
            ...profile,
            jobsOffered: updatedJobs.map(j => ({
                id: isNaN(Number(j.id)) ? Math.floor(Math.random() * 1000) : Number(j.id),
                title: j.title || "New Job",
                icon: "👶",
                location: j.location || "",
                startDate: j.startDate || "",
                reqExperience: j.reqExperience || "",
                workType: j.workType || "Part Time",
                daysPerWeek: j.daysPerWeek || "5",
                payRange: j.payRange || "$15-$25",
                dietaryPreference: j.dietaryPreference || "Veg",
                postedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                description: j.jobRequirements || ""
            }))
        });
        setJobsModalOpen(false);
    };

    const handleFeedbackUpdate = (data: { rating: number; text: string; id?: string | number }) => {
        if (data.id) {
            // Update existing
            setProfile({
                ...profile,
                testimonialsReceived: profile.testimonialsReceived.map(t =>
                    t.id === data.id ? { ...t, rating: data.rating, text: data.text } : t
                )
            });
        } else {
            // Add new
            const newFeedback = {
                id: Date.now(),
                rating: data.rating,
                text: data.text,
                highlightName: profile.firstName + " " + profile.lastName,
                reviewerName: "Guest User",
                reviewerLocation: "Unknown",
                reviewerPhoto: "/assets/icons/icon_user.svg"
            };
            setProfile({
                ...profile,
                testimonialsReceived: [newFeedback, ...profile.testimonialsReceived]
            });
        }
        setFeedbackModalOpen(false);
    };

    return (
        <div className={styles.profilePage}>
            {/* Integrated Header with Navbar + Profile */}
            <div className={styles.profileHeader}>
                {/* Word cloud background */}
                <div className={styles.headerBackground}></div>
                <div className={styles.headerBackgroundRight}></div>

                {/* Navbar row */}
                <div className={styles.profileNavbar}>
                    <button className={styles.mobileMenuBtn}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <Link href="/Landing" className={styles.navbarBrand}>
                        <DesiHelpersIcon />
                    </Link>
                    <div className={styles.navbarLinks}>
                        <Link href={Routes.viewAllJobs} className={styles.navLink}>Find Job</Link>
                        <Link href="/Landing" className={styles.navLink}>Hire Help</Link>
                        <Link href="/about" className={styles.navLink}>About Us</Link>
                        <Link href="/resources" className={styles.navLink}>Resources</Link>
                    </div>
                    <div className={styles.navbarActions}>
                        <div className={styles.langSelector}>
                            <button
                                className={styles.langButton}
                                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                            >
                                {selectedLang}
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: "4px" }}>
                                    <path d="M3 4.5L6 7.5L9 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            {langDropdownOpen && (
                                <div className={styles.langDropdown}>
                                    <button className={styles.langOption} onClick={() => handleLangChange("Eng")}>English</button>
                                    <button className={styles.langOption} onClick={() => handleLangChange("Hindi")}>Hindi</button>
                                </div>
                            )}
                        </div>
                        <button className={styles.navIconButton}>
                            <Image src="/newassets/notification.png" alt="Notification" width={24} height={24} />
                        </button>
                        <button className={styles.navIconButton}>
                            <Image src="/newassets/account_circle.png" alt="Profile" width={24} height={24} />
                        </button>
                    </div>
                </div>

                {/* Header Actions - Positioned absolutely via CSS */}
                <div className={styles.headerActions}>
                    <button className={styles.headerActionBtn} onClick={() => setPersonalSocialModalOpen(true)}>
                        <EditIcon />
                    </button>
                    <button className={styles.headerActionBtn}>
                        <ShareIcon />
                    </button>
                </div>

                {/* Social Icons row - Positioned absolutely via CSS */}
                <div className={styles.socialIconsRow}>
                    <a href="#" className={styles.socialIcon} title="Facebook">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                    </a>
                    <a href="#" className={styles.socialIcon} title="WhatsApp">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.394 0 12.03c0 2.12.553 4.189 1.603 5.923L0 24l6.126-1.608a11.846 11.846 0 005.918 1.586h.005c6.632 0 12.028-5.396 12.032-12.033a11.833 11.833 0 00-3.535-8.503" /></svg>
                    </a>
                    <a href="#" className={styles.socialIcon} title="Instagram">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.171.054 1.81.247 2.23.408.56.216.96.474 1.38.894.42.42.678.82.894 1.38.161.42.354 1.059.408 2.23.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.171-.247 1.81-.408 2.23-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.42.161-1.059.354-2.23.408-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.171-.054-1.81-.247-2.23-.408-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.42-.42-.354-1.059-.408-2.23C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.171.247-1.81.408-2.23.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.42-.161 1.059-.354 2.23-.408 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 5.775.129 4.903.332 4.145.627c-.783.304-1.447.712-2.108 1.373S.931 3.362.627 4.145c-.295.758-.498 1.63-.555 2.908C.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.057 1.278.26 2.15.555 2.908.304.783.712 1.447 1.373 2.108s1.322 1.069 2.108 1.373c.758.295 1.63.498 2.908.555 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.278-.057 2.15-.26 2.908-.555.783-.304 1.447-.712 2.108-1.373s1.069-1.322 1.373-2.108c.295-.758.498-1.63.555-2.908.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.057-1.278-.26-2.15-.555-2.908-.304-.783-.712-1.447-1.373-2.108s-1.322-1.069-2.108-1.373c-.758-.295-1.63-.498-2.908-.555C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
                    </a>
                    <a href="#" className={styles.socialIcon} title="X">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                    <a href="#" className={styles.socialIcon} title="LinkedIn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    </a>
                </div>

                {/* Profile Info Section */}
                <div className={styles.profileInfoSection}>
                    <div className={styles.profilePhotoContainer}>
                        <img
                            src={profile.photo}
                            alt={`${profile.firstName} ${profile.lastName}`}
                            className={styles.profilePhoto}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/assets/icons/icon_user.svg";
                            }}
                        />
                        <div
                            className={styles.cameraIcon}
                            onClick={() => setPhotoModalOpen(true)}
                            style={{ cursor: "pointer" }}
                        >
                            <CameraIcon />
                        </div>
                    </div>

                    <div className={styles.profileDetails}>
                        <h1 className={styles.profileName}>{profile.firstName} {profile.lastName}</h1>
                        <div className={styles.starRating}>
                            {renderStars(profile.rating)}
                        </div>
                        <div className={styles.profileLocation}>
                            <LocationIcon />
                            <span>{profile.location}</span>
                        </div>

                        <div className={styles.actionButtons}>
                            <button className={`${styles.actionBtn} ${styles.callBtn}`}>
                                <PhoneIcon /> Call ME
                            </button>
                            <button className={`${styles.actionBtn} ${styles.emailBtn}`}>
                                <EmailIcon /> Email Me
                            </button>
                            <button className={`${styles.actionBtn} ${styles.whatsappBtn}`}>
                                <WhatsAppIcon /> Whatsapp Me
                            </button>
                        </div>

                        {/* Contact Info Row */}

                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.profileContent}>
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    {/* About Me Card */}
                    <div className={styles.sidebarCard}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle} style={{ color: '#003385' }}>About Me</h3>
                            <span className={styles.editIcon} onClick={() => setEditModalOpen(true)}>
                                <EditIcon /></span>
                        </div>
                        <div className={styles.cardContent}>
                            <p style={{ margin: 0, color: '#444', fontSize: '14px', lineHeight: '1.5' }}>
                                {profile.aboutMe} <span className={styles.readMore} style={{ fontWeight: 500 }}>Read more...</span>
                            </p>

                            <div className={styles.infoRow} style={{ marginTop: "20px" }}>
                                <div className={styles.infoLabel}>Languages Spoken</div>
                                <div className={styles.infoValue}>{profile.languages}</div>
                            </div>

                            <div className={styles.infoGrid} style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>Commute Preference</div>
                                    <div className={styles.infoValue}>{profile.commutePreference}</div>
                                </div>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>Dietary Preference</div>
                                    <div className={styles.infoValue}>{profile.dietaryPreference}</div>
                                </div>
                            </div>

                            <div className={styles.infoRow} style={{ marginTop: "15px" }}>
                                <div className={styles.infoLabel}>OK With Pets</div>
                                <div className={styles.infoValue}>{profile.okWithPets}</div>
                            </div>
                        </div>
                    </div>

                    {/* Address Details Card */}
                    <div className={styles.sidebarCard}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle} style={{ color: '#003385' }}>Address Details</h3>
                            <span
                                className={styles.editIcon}
                                onClick={() => setAddressModalOpen(true)}
                                style={{ cursor: "pointer" }}
                            >
                                <EditIcon /></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabel}>Address Line 1</div>
                                <div className={styles.infoValue}>{profile.address.line1}</div>
                            </div>
                            <div className={styles.infoRow} style={{ marginTop: "15px" }}>
                                <div className={styles.infoLabel}>Address Line 2</div>
                                <div className={styles.infoValue}>{profile.address.line2}</div>
                            </div>
                            <div className={styles.infoGrid} style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>City</div>
                                    <div className={styles.infoValue}>{profile.address.city}</div>
                                </div>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>State</div>
                                    <div className={styles.infoValue}>{profile.address.state}</div>
                                </div>
                            </div>
                            <div className={styles.infoRow} style={{ marginTop: "15px" }}>
                                <div className={styles.infoLabel}>Zip Code</div>
                                <div className={styles.infoValue}>{profile.address.zipCode}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area with Tabs */}
                <div className={styles.mainContent}>
                    {/* Desktop Tabs Header */}
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
                        {activeTab === 'services' && (
                            <div className={styles.addServicesBtn} onClick={() => setServicesModalOpen(true)}>
                                <span style={{ color: '#f07c00' }}>+ Add Services</span>
                                <EditIcon color="#666" />
                            </div>
                        )}
                        {activeTab === 'jobs' && (
                            <div className={styles.addServicesBtn} onClick={() => setJobsModalOpen(true)}>
                                <span style={{ color: '#f07c00' }}>+ Add Jobs</span>
                                <EditIcon color="#666" />
                            </div>
                        )}
                        {activeTab === 'testimonials' && (
                            <div className={styles.addServicesBtn} onClick={() => { setEditingTestimonial(null); setFeedbackModalOpen(true); }}>
                                <span style={{ color: '#f07c00' }}>+ Add Feedback</span>
                            </div>
                        )}
                    </div>

                    {/* Services Section */}
                    <div className={activeTab === 'services' ? styles.activeTabContent : styles.mobileOnly}>
                        <div className={`${styles.sidebarCard} ${activeTab === 'services' ? styles.tabSection : ""}`}>
                            <div className={`${styles.cardHeader} ${styles.mobileOnly}`} onClick={() => toggleSection('services')} style={{ cursor: 'pointer' }}>
                                <h3 className={styles.cardTitle} style={{ color: '#ff6b35' }}>Services Provided</h3>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <span className={styles.editIcon} onClick={(e) => { e.stopPropagation(); setServicesModalOpen(true); }}><EditIcon /></span>
                                    <span style={{ transform: expandedSections.services ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", color: '#ff6b35' }}>
                                        <ChevronUpIcon />
                                    </span>
                                </div>
                            </div>
                            {(expandedSections.services || activeTab === 'services') && (
                                <div className={styles.cardContent} style={{ padding: '0' }}>
                                    {profile.services.map((service) => (
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
                                                    onClick={() => setExpandedService(
                                                        expandedService === service.id ? null : service.id
                                                    )}
                                                >
                                                    {expandedService === service.id ? "Show Less..." : "Show More..."}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Jobs Section */}
                    <div className={activeTab === 'jobs' ? styles.activeTabContent : styles.mobileOnly}>
                        <div className={`${styles.sidebarCard} ${activeTab === 'jobs' ? styles.tabSection : ""}`}>
                            <div className={`${styles.cardHeader} ${styles.mobileOnly}`} onClick={() => toggleSection('jobs')} style={{ cursor: 'pointer' }}>
                                <h3 className={styles.cardTitle} style={{ color: '#ff6b35' }}>Jobs Offered by Me</h3>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <span className={styles.editIcon} style={{ color: '#ff6b35' }} onClick={(e) => { e.stopPropagation(); setJobsModalOpen(true); }}><PlusIcon /></span>
                                    <span style={{ transform: expandedSections.jobs ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", color: '#ff6b35' }}>
                                        <ChevronUpIcon />
                                    </span>
                                </div>
                            </div>
                            {(expandedSections.jobs || activeTab === 'jobs') && (
                                <div className={styles.cardContent} style={{ padding: '0' }}>
                                    {profile.jobsOffered && profile.jobsOffered.length > 0 ? (
                                        profile.jobsOffered.map((job) => (
                                            <div key={job.id} className={styles.jobCard}>
                                                <div className={styles.jobHeader}>
                                                    <div className={styles.jobIcon}>{job.icon}</div>
                                                    <div className={styles.jobTitleArea}>
                                                        <h4 className={styles.jobTitle} style={{ color: '#003385' }}>{job.title}</h4>
                                                    </div>
                                                </div>

                                                <div className={styles.jobDetailsGrid}>
                                                    <div className={styles.jobDetail}>
                                                        <span className={styles.jobDetailLabel}>Location</span>
                                                        <span className={styles.jobDetailValue}>{job.location}</span>
                                                    </div>
                                                    <div className={styles.jobDetail}>
                                                        <span className={styles.jobDetailLabel}>Start Date</span>
                                                        <span className={styles.jobDetailValue}>{job.startDate}</span>
                                                    </div>
                                                    <div className={styles.jobDetail}>
                                                        <span className={styles.jobDetailLabel}>Req Experience (in years)</span>
                                                        <span className={styles.jobDetailValue}>{job.reqExperience}</span>
                                                    </div>
                                                    <div className={styles.jobDetail}>
                                                        <span className={styles.jobDetailLabel}>Work Type</span>
                                                        <span className={styles.jobDetailValue}>{job.workType}</span>
                                                    </div>
                                                    <div className={styles.jobDetail}>
                                                        <span className={styles.jobDetailLabel}>Days per week</span>
                                                        <span className={styles.jobDetailValue}>{job.daysPerWeek}</span>
                                                    </div>
                                                    <div className={styles.jobDetail}>
                                                        <span className={styles.jobDetailLabel}>Pay Range</span>
                                                        <span className={styles.jobDetailValue}>{job.payRange}</span>
                                                    </div>
                                                    <div className={styles.jobDetail}>
                                                        <span className={styles.jobDetailLabel}>Dietary Preference</span>
                                                        <span className={styles.jobDetailValue}>{job.dietaryPreference}</span>
                                                    </div>
                                                    <div className={styles.jobDetail}>
                                                        <span className={styles.jobDetailLabel}>Posted Date</span>
                                                        <span className={styles.jobDetailValue}>{job.postedDate}</span>
                                                    </div>
                                                </div>

                                                <div className={styles.jobDescription}>
                                                    {expandedJob === job.id ? (
                                                        <p>{job.description}</p>
                                                    ) : (
                                                        <p>{job.description.slice(0, 300)}...</p>
                                                    )}
                                                </div>

                                                <button
                                                    className={styles.readMoreBtn}
                                                    onClick={() => setExpandedJob(
                                                        expandedJob === job.id ? null : job.id
                                                    )}
                                                >
                                                    {expandedJob === job.id ? "Show Less..." : "Read More..."}
                                                </button>
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

                    {/* Testimonials Section */}
                    <div className={activeTab === 'testimonials' ? styles.activeTabContent : styles.mobileOnly}>
                        <div className={`${styles.sidebarCard} ${activeTab === 'testimonials' ? styles.tabSection : ""}`}>
                            <div className={`${styles.cardHeader} ${styles.mobileOnly}`} onClick={() => toggleSection('testimonials')} style={{ cursor: 'pointer' }}>
                                <h3 className={styles.cardTitle} style={{ color: '#ff6b35' }}>Testimonials</h3>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <span className={styles.editIcon} style={{ color: '#ff6b35' }} onClick={(e) => { e.stopPropagation(); setEditingTestimonial(null); setFeedbackModalOpen(true); }}>
                                        <PlusIcon />
                                    </span>
                                    <span style={{ transform: expandedSections.testimonials ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", color: '#ff6b35' }}>
                                        <ChevronUpIcon />
                                    </span>
                                </div>
                            </div>
                            {(expandedSections.testimonials || activeTab === 'testimonials') && (
                                <div className={styles.cardContent} style={{ padding: '0' }}>
                                    {/* Received/Given Toggle */}
                                    <div className={styles.testimonialToggle}>
                                        <button
                                            className={`${styles.toggleBtn} ${testimonialFilter === "received" ? styles.toggleBtnActive : ""}`}
                                            onClick={() => setTestimonialFilter("received")}
                                        >
                                            Received
                                        </button>
                                        <button
                                            className={`${styles.toggleBtn} ${testimonialFilter === "given" ? styles.toggleBtnActive : ""}`}
                                            onClick={() => setTestimonialFilter("given")}
                                        >
                                            Given
                                        </button>
                                    </div>

                                    {/* Testimonials List */}
                                    <div className={styles.testimonialsList}>
                                        {testimonialFilter === "received" && profile.testimonialsReceived && profile.testimonialsReceived.length > 0 ? (
                                            profile.testimonialsReceived.map((testimonial) => (
                                                <div key={testimonial.id} className={styles.testimonialCard}>
                                                    {/* Star Rating */}
                                                    <div className={styles.testimonialStars}>
                                                        {Array(5).fill(0).map((_, i) => (
                                                            <span
                                                                key={i}
                                                                className={`${styles.testimonialStar} ${i < testimonial.rating ? styles.starFilled : styles.starEmpty}`}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Testimonial Text */}
                                                    <p className={styles.testimonialText}>
                                                        "{testimonial.text.split(testimonial.highlightName).map((part, index, array) => (
                                                            <React.Fragment key={index}>
                                                                {part}
                                                                {index < array.length - 1 && (
                                                                    <strong className={styles.highlightName}>{testimonial.highlightName}</strong>
                                                                )}
                                                            </React.Fragment>
                                                        ))}"
                                                    </p>

                                                    {/* Reviewer Info */}
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
                                                            <span className={styles.reviewerLocation}>
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                                    <circle cx="12" cy="10" r="3" />
                                                                </svg>
                                                                {testimonial.reviewerLocation}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : testimonialFilter === "given" && profile.testimonialsGiven && profile.testimonialsGiven.length > 0 ? (
                                            <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                                                Testimonials given will appear here
                                            </div>
                                        ) : (
                                            <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                                                {testimonialFilter === "received" ? "No testimonials received yet" : "No testimonials given yet"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Photo Gallery Section */}
                    <div className={activeTab === 'gallery' ? styles.activeTabContent : styles.mobileOnly}>
                        <div className={`${styles.sidebarCard} ${activeTab === 'gallery' ? styles.tabSection : ""}`}>
                            <div className={`${styles.cardHeader} ${styles.mobileOnly}`} onClick={() => toggleSection('gallery')} style={{ cursor: 'pointer' }}>
                                <h3 className={styles.cardTitle} style={{ color: '#ff6b35' }}>Photo Gallery</h3>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <span style={{ transform: expandedSections.gallery ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", color: '#ff6b35' }}>
                                        <ChevronUpIcon />
                                    </span>
                                </div>
                            </div>
                            {(expandedSections.gallery || activeTab === 'gallery') && (
                                <div className={styles.cardContent} style={{ padding: '20px' }}>
                                    <div className={styles.galleryContainer}>

                                        <div className={styles.galleryGrid}>
                                            {/* Photo Cards */}
                                            {profile.photoGallery && profile.photoGallery.map((photo) => (
                                                <div key={photo.id} className={styles.photoCard}>
                                                    <img
                                                        src={photo.url}
                                                        alt={photo.alt}
                                                        className={styles.photoImage}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "/assets/icons/icon_image.svg";
                                                        }}
                                                    />
                                                    <div className={styles.photoActions}>
                                                        <button
                                                            className={styles.photoActionBtn}
                                                            title="Expand"
                                                            onClick={() => setExpandedPhoto({ url: photo.url, alt: photo.alt })}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <polyline points="15 3 21 3 21 9" />
                                                                <polyline points="9 21 3 21 3 15" />
                                                                <line x1="21" y1="3" x2="14" y2="10" />
                                                                <line x1="3" y1="21" x2="10" y2="14" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className={styles.photoActionBtn}
                                                            title="Delete"
                                                            onClick={() => handleDeletePhoto(photo.id)}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                <line x1="10" y1="11" x2="10" y2="17" />
                                                                <line x1="14" y1="11" x2="14" y2="17" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add Photo Placeholder */}
                                            <div className={styles.addPhotoPlaceholder} onClick={() => setPhotoModalOpen(true)}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2">
                                                    <line x1="12" y1="5" x2="12" y2="19" />
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Lightbox Modal */}
            {expandedPhoto && (
                <div className={styles.lightboxOverlay} onClick={() => setExpandedPhoto(null)}>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.lightboxClose} onClick={() => setExpandedPhoto(null)}>
                            ×
                        </button>
                        <img src={expandedPhoto.url} alt={expandedPhoto.alt} className={styles.lightboxImage} />
                    </div>
                </div>
            )}

            <CEditProfileModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onUpdate={handleProfileUpdate}
                initialData={{
                    aboutMe: profile.aboutMe,
                    languages: ["Hindi", "Punjabi", "English"], // Dynamic if possible
                    commutePreference: profile.commutePreference,
                    dietaryPreference: profile.dietaryPreference,
                    okWithPets: profile.okWithPets
                }}
            />

            <CServicesModal
                open={servicesModalOpen}
                onClose={() => setServicesModalOpen(false)}
                onUpdate={handleServicesUpdate}
                initialServices={profile.services.map(s => ({
                    id: s.id.toString(), // Convert to string for CServicesModal
                    title: s.title,
                    category: s.category,
                    subCategory: "Gas Station Jobs",
                    description: s.description || "",
                    experience: s.experience,
                    offeringNow: s.available === "Yes" ? "Yes" : "No",
                    isExpanded: false
                }))}
            />
            <CAddressEditModal
                open={addressModalOpen}
                onClose={() => setAddressModalOpen(false)}
                onUpdate={handleAddressUpdate}
                initialData={profile.address}
            />
            <CPersonalSocialModal
                open={personalSocialModalOpen}
                onClose={() => setPersonalSocialModalOpen(false)}
                onUpdate={handlePersonalSocialUpdate}
                initialData={{
                    firstName: profile.firstName || "Tania",
                    lastName: profile.lastName || "Mal",
                    displayName: profile.displayName || "Tania",
                    gender: profile.gender || "Female",
                    email: profile.email || "taniamal@gmail.com",
                    mobileNumber: profile.mobileNumber || "425-555-0156",
                    whatsappNumber: profile.whatsappNumber || "425-555-0156",
                    whatsappSameAsMobile: profile.whatsappNumber === profile.mobileNumber,
                    facebookLink: profile.socialLinks.facebook || "#",
                    instagramLink: profile.socialLinks.instagram || "#"
                }}
            />
            <CPhotoUploadModal
                open={photoModalOpen}
                onClose={() => setPhotoModalOpen(false)}
                onSave={handlePhotoSave}
            />
            <CJobsOfferingModal
                open={jobsModalOpen}
                onClose={() => setJobsModalOpen(false)}
                onUpdate={handleJobsUpdate}
                initialJobs={profile.jobsOffered ? profile.jobsOffered.map(j => ({
                    id: j.id.toString(),
                    title: j.title,
                    jobRequirements: j.description || "",
                    location: j.location || "",
                    startDate: "",
                    workType: j.workType || "Part Time",
                    reqExperience: j.reqExperience || "",
                    payRange: j.payRange || "$15-$25",
                    dietaryPreference: j.dietaryPreference || "Veg",
                    daysPerWeek: j.daysPerWeek || "5",
                    isExpanded: false
                })) : []}
            />
            <CFeedbackModal
                open={feedbackModalOpen}
                onClose={() => setFeedbackModalOpen(false)}
                onUpdate={handleFeedbackUpdate}
                initialData={editingTestimonial}
            />
        </div>
    );
};

export default Profile;
