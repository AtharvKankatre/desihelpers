import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CUserAvatar } from "@/components/global/header/header_components/CUserAvatar";
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
import { userProfileStore } from "@/stores/UserProfileStore";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { getWorkPhotoUrls } from "@/utils/s3Helper";

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

const defaultProfile = {
    userId: "",
    firstName: "",
    lastName: "",
    displayName: "",
    gender: "",
    email: "",
    mobileNumber: "",
    whatsappNumber: "",
    whatsappSameAsMobile: false,
    rating: 0,
    location: "",
    photo: "/newassets/account_circle.png",
    aboutMe: "",
    languages: "",
    commutePreference: "",
    dietaryPreference: "",
    okWithPets: "No",
    address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        zipCode: ""
    },
    services: [],
    jobsOffered: [],
    testimonialsReceived: [],
    testimonialsGiven: [],
    photoGallery: [],
    socialLinks: {
        facebook: "",
        whatsapp: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        website: ""
    }
};

interface ProfileUpdateData {
    aboutMe: string;
    languages: string[];
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
    whatsappSameAsMobile: boolean;
    facebookLink: string;
    instagramLink: string;
    linkedInLink: string;
    twitterLink: string;
    websiteLink: string;
}

interface ProfileData {
    userId: string;
    firstName: string;
    lastName: string;
    displayName: string;
    gender: string;
    email: string;
    mobileNumber: string;
    whatsappNumber: string;
    whatsappSameAsMobile: boolean;
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
    testimonialsReceived: any[];
    testimonialsGiven: any[];
    photoGallery: any[];
    socialLinks: {
        facebook: string;
        whatsapp: string;
        instagram: string;
        twitter: string;
        linkedin: string;
        website: string;
    };
}


const Profile: React.FC = () => {
    const { userProfile } = userProfileStore((state) => state);
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

    const [profile, setProfile] = useState<ProfileData>(defaultProfile as any);
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
    const [avatarOpen, setAvatarOpen] = useState(false);
    const [profilePhotoError, setProfilePhotoError] = useState(false);
    const [isPhotoUploading, setIsPhotoUploading] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            const result = await ApiService.crud(APIDetails.getUserProfile);
            if (result[0]) {
                const apiProfile = result[1];
                const photoToSign = apiProfile.profilePhoto;
                const signedInitPhotoUrl = (photoToSign && photoToSign !== "/newassets/account_circle.png")
                    ? (await getWorkPhotoUrls("", [photoToSign]))[0]
                    : "/newassets/account_circle.png";

                setProfile((prev: any) => ({
                    ...prev,
                    userId: apiProfile.userId || "",
                    firstName: apiProfile.firstName || "",
                    lastName: apiProfile.lastName || "",
                    displayName: apiProfile.displayName || "",
                    gender: apiProfile.gender || "Not specified",
                    email: apiProfile.email || "",
                    mobileNumber: apiProfile.mobile || "",
                    whatsappNumber: apiProfile.phone || "",
                    whatsappSameAsMobile: apiProfile.mobile === apiProfile.phone,
                    location: `${apiProfile.city || ""}, ${apiProfile.state || ""}`.replace(/^, | , $/g, ''),
                    photo: signedInitPhotoUrl,
                    aboutMe: apiProfile.aboutMe || "",
                    languages: apiProfile.languagesSpoken?.join(", ") || "",
                    commutePreference: apiProfile.commutePreference || "Not specified",
                    dietaryPreference: apiProfile.dietaryRestrictions || "Not specified",
                    okWithPets: apiProfile.okWithPets ? "Yes" : "No",
                    address: {
                        line1: apiProfile.addressLine1 || "",
                        line2: apiProfile.addressLine2 || "",
                        city: apiProfile.city || "",
                        state: apiProfile.state || "",
                        zipCode: apiProfile.zipCode || "",
                    },
                    services: apiProfile.jobDetails ? apiProfile.jobDetails.map((j: any, i: number) => ({
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
                        facebook: apiProfile.facebookLink || "",
                        whatsapp: apiProfile.phone || "",
                        instagram: apiProfile.instagram || "",
                        website: apiProfile.websiteLink || "",
                        twitter: apiProfile.twitterLink || "",
                        linkedin: apiProfile.linkedinLink || ""
                    }
                }));

                // Also update the global store with latest profile data
                const storeActions = userProfileStore.getState();
                storeActions.setUserProfile(apiProfile);

                // Try fetching testimonials if user ID is present
                const userId = apiProfile._id || apiProfile.id;
                if (userId && typeof userId === 'string' && userId.trim() !== "" && userId !== "undefined") {
                    const feedbackRes = await ApiService.crud(APIDetails.getFeedback, userId);
                    if (feedbackRes[0] && Array.isArray(feedbackRes[1])) {
                        setProfile((prev: any) => ({
                            ...prev,
                            testimonialsReceived: feedbackRes[1].map((f: any) => ({
                                id: f._id || Math.random().toString(),
                                rating: f.rating,
                                text: f.feedback,
                                highlightName: "",
                                reviewerName: f.reviewerName || "Anonymous",
                                reviewerLocation: "",
                                reviewerPhoto: f.reviewerPhoto || "/assets/icons/icon_user.svg"
                            }))
                        }));
                    }
                }

                // Map work photos to gallery
                if (apiProfile.uploadPhotoOfWork && Array.isArray(apiProfile.uploadPhotoOfWork)) {
                    setProfile((prev: any) => ({
                        ...prev,
                        photoGallery: apiProfile.uploadPhotoOfWork.map((url: string, index: number) => ({
                            id: index,
                            url: url,
                            alt: `Work photo ${index + 1}`
                        }))
                    }));
                }
            }
        };

        const fetchJobs = async () => {
            const email = Cookies.get(cookieParams.email);
            if (email) {
                const result = await ApiService.crud([APIDetails.getJobsByUser[0] + email, APIDetails.getJobsByUser[1], APIDetails.getJobsByUser[2]], null);
                if (result[0] && Array.isArray(result[1])) {
                    setProfile((prev: any) => ({
                        ...prev,
                        jobsOffered: result[1].map((j: any, i: number) => ({
                            ...j,
                            icon: "👶",
                        }))
                    }));
                }
            }
        };

        fetchProfileData();
        fetchJobs();
    }, []);

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

    // Color-coded star rating: 1-2 = red, 3 = yellow/orange, 4-5 = green
    const getStarColor = (rating: number) => {
        if (rating >= 4) return '#22c55e'; // Green for 4-5 stars
        if (rating >= 3) return '#eab308'; // Yellow for 3 stars
        return '#ef4444'; // Red for 1-2 stars
    };

    const renderStars = (rating: number, prefix: string = "star") => {
        const color = getStarColor(rating);
        return Array(5).fill(0).map((_, i) => (
            <span
                key={`${prefix}-${i}`}
                className={styles.star}
                style={{ color: i < Math.round(rating) ? color : '#ddd' }}
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

    const handleLangChange = (lang: string) => {
        setSelectedLang(lang);
        setLangDropdownOpen(false);
    };

    const handleProfileUpdate = async (updatedData: ProfileUpdateData) => {
        // Map frontend values to backend expected enums
        const mappedCommute = updatedData.commutePreference === "Have a Ride" ? "Have a ride" :
            updatedData.commutePreference === "Require a Ride" ? "Will need a ride" : "";
        const mappedDietary = updatedData.dietaryPreference === "Not specified" ? "" : updatedData.dietaryPreference;

        const payload = {
            aboutMe: updatedData.aboutMe,
            languagesSpoken: updatedData.languages,
            commutePreference: mappedCommute,
            dietaryRestrictions: mappedDietary,
            okWithPets: updatedData.okWithPets === "Yes"
        };
        const isProfileBuild = Cookies.get(cookieParams.isProfileBuild) === "true";
        let result;

        if (isProfileBuild) {
            result = await ApiService.crud(APIDetails.updateUserProfile, null, payload);
        } else {
            const fullPayload = {
                firstName: profile.firstName || "User",
                lastName: profile.lastName || "Name",
                displayName: profile.displayName || "User Name",
                gender: profile.gender || "Not specified",
                email: profile.email || Cookies.get(cookieParams.email) || "test@test.com",
                mobile: profile.mobileNumber || "",
                phone: profile.whatsappNumber || profile.mobileNumber || "0000000000",
                addressLine1: profile.address?.line1 || "Not specified",
                city: profile.address?.city || "Not specified",
                state: profile.address?.state || "Not specified",
                zipCode: profile.address?.zipCode || "12345",
                location: { type: "Point", coordinates: [0, 0] },
                ...payload
            };
            result = await ApiService.crud(APIDetails.postUserProfile, fullPayload);
        }

        if (result[0]) {
            if (!isProfileBuild) {
                Cookies.set(cookieParams.isProfileBuild, "true");
                window.dispatchEvent(new Event("isProfileBuildChanged"));
            }
            setProfile({
                ...profile,
                aboutMe: updatedData.aboutMe,
                languages: updatedData.languages.join(", "),
                commutePreference: updatedData.commutePreference,
                dietaryPreference: updatedData.dietaryPreference,
                okWithPets: updatedData.okWithPets,
            });
            setEditModalOpen(false);
            toast.success("Profile updated successfully!");
        } else {
            console.error("Profile update failed:", result[1]);
            toast.error(result[1] || "Failed to update profile");
        }
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

    const handleAddressUpdate = async (updatedAddress: AddressUpdateData) => {
        const payload = {
            addressLine1: updatedAddress.line1,
            addressLine2: updatedAddress.line2,
            city: updatedAddress.city,
            state: updatedAddress.state,
            zipCode: updatedAddress.zipCode
        };
        const isProfileBuild = Cookies.get(cookieParams.isProfileBuild) === "true";
        let result;

        if (isProfileBuild) {
            result = await ApiService.crud(APIDetails.updateUserProfile, null, payload);
        } else {
            const fullPayload = {
                firstName: profile.firstName || "User",
                lastName: profile.lastName || "Name",
                displayName: profile.displayName || "User Name",
                gender: profile.gender || "Not specified",
                email: profile.email || Cookies.get(cookieParams.email) || "test@test.com",
                mobile: profile.mobileNumber || "",
                phone: profile.whatsappNumber || profile.mobileNumber || "0000000000",
                languagesSpoken: profile.languages ? profile.languages.split(",").map(l => l.trim()) : ["English"],
                location: { type: "Point", coordinates: [0, 0] },
                ...payload,
                commutePreference: profile.commutePreference === "Have a Ride" ? "Have a ride" : profile.commutePreference === "Require a Ride" ? "Will need a ride" : profile.commutePreference === "Not specified" ? "" : profile.commutePreference
            };
            result = await ApiService.crud(APIDetails.postUserProfile, fullPayload);
        }

        if (result[0]) {
            if (!isProfileBuild) {
                Cookies.set(cookieParams.isProfileBuild, "true");
                window.dispatchEvent(new Event("isProfileBuildChanged"));
            }
            setProfile({
                ...profile,
                address: updatedAddress,
                location: `${updatedAddress.city || ""}, ${updatedAddress.state || ""}`.replace(/^, | , $/g, '')
            });
            setAddressModalOpen(false);
            toast.success("Address updated successfully!");
        } else {
            console.error("Address update failed:", result[1]);
            toast.error(result[1] || "Failed to update address");
        }
    };

    const handlePersonalSocialUpdate = async (updatedData: PersonalSocialUpdateData) => {
        const payload: Record<string, any> = {
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
            displayName: (updatedData.displayName || "").trim() !== "" ? updatedData.displayName : `${updatedData.firstName} ${updatedData.lastName}`.trim(),
            gender: updatedData.gender,
            email: updatedData.email,
            mobile: updatedData.mobileNumber,
            phone: updatedData.whatsappNumber,
            facebookLink: updatedData.facebookLink,
            instagram: updatedData.instagramLink,
            websiteLink: updatedData.websiteLink,
            twitterLink: updatedData.twitterLink,
            linkedinLink: updatedData.linkedInLink,
        };

        // Remove empty strings so backend doesn't run validation regex on them
        Object.keys(payload).forEach(key => {
            if (payload[key] === "") {
                delete payload[key];
            }
        });

        const isProfileBuild = Cookies.get(cookieParams.isProfileBuild) === "true";
        let result;

        if (isProfileBuild) {
            result = await ApiService.crud(APIDetails.updateUserProfile, null, payload);
        } else {
            const fullPayload = {
                addressLine1: profile.address?.line1 || "Not specified",
                city: profile.address?.city || "Not specified",
                state: profile.address?.state || "Not specified",
                zipCode: profile.address?.zipCode || "12345",
                languagesSpoken: profile.languages ? profile.languages.split(",").map(l => l.trim()) : ["English"],
                phone: payload.phone || payload.mobile || "0000000000",
                location: { type: "Point", coordinates: [0, 0] },
                ...payload,
                commutePreference: profile.commutePreference === "Have a Ride" ? "Have a ride" : profile.commutePreference === "Require a Ride" ? "Will need a ride" : profile.commutePreference === "Not specified" ? "" : profile.commutePreference
            };
            result = await ApiService.crud(APIDetails.postUserProfile, fullPayload);
        }

        if (result[0]) {
            if (!isProfileBuild) {
                Cookies.set(cookieParams.isProfileBuild, "true");
                window.dispatchEvent(new Event("isProfileBuildChanged"));
            }
            setProfile({
                ...profile,
                firstName: updatedData.firstName,
                lastName: updatedData.lastName,
                displayName: updatedData.displayName,
                gender: updatedData.gender,
                email: updatedData.email,
                mobileNumber: updatedData.mobileNumber,
                whatsappNumber: updatedData.whatsappNumber,
                whatsappSameAsMobile: updatedData.whatsappSameAsMobile,
                socialLinks: {
                    ...profile.socialLinks,
                    facebook: updatedData.facebookLink,
                    instagram: updatedData.instagramLink,
                    linkedin: updatedData.linkedInLink,
                    twitter: updatedData.twitterLink,
                    website: updatedData.websiteLink
                }
            });
            setPersonalSocialModalOpen(false);
            toast.success("Details updated successfully!");
        } else {
            console.error("Personal details update failed:", result[1]);
            toast.error(result[1] || "Failed to update details");
        }
    };

    const handlePhotoSave = async (photos: File[]) => {
        if (photos.length === 0) return;

        const file = photos[0];
        setIsPhotoUploading(true);

        // Show loading state
        const toastId = toast.loading("Saving your profile picture. Please wait...");

        try {
            // Get userId from the locally-stored profile or zustand store
            const userId = profile.userId || userProfileStore.getState().userProfile?.userId;

            if (!userId) {
                throw new Error("User ID not found. Please log in again.");
            }

            // Upload through backend endpoint which has S3 credentials
            // Backend endpoint: POST /user-profile/upload/:userId/:folderName
            const formData = new FormData();
            formData.append('file', file);

            const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
            const accessToken = Cookies.get(cookieParams.accessToken);

            const response = await fetch(`${BASE_URL}user-profile/upload/${userId}/profilePhotos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Upload failed with status ${response.status}`);
            }

            const result = await response.json();

            if (result.message === 'true' || result.urls) {
                // The backend uploadFiles method actually returns the updated UserProfile object inside result.urls
                const photoUrl = Array.isArray(result.urls)
                    ? result.urls[0]
                    : (result.urls?.profilePhoto || result.profilePhoto);

                if (!photoUrl) {
                    throw new Error("Could not extract uploaded photo URL from backend response.");
                }

                // Reset error flag so the <img> renders the new photo instead of default avatar
                setProfilePhotoError(false);

                // Sign the URL before updating the UI
                const signedUrls = await getWorkPhotoUrls("", [photoUrl]);
                const signedPhotoUrl = signedUrls.length > 0 ? signedUrls[0] : photoUrl;

                // Update local state with valid signed URL for immediate display
                setProfile(prev => ({ ...prev, photo: signedPhotoUrl }));

                // Update global store
                const { setUserProfile, userProfile: currentStoreProfile } = userProfileStore.getState();
                setUserProfile({ ...currentStoreProfile, profilePhoto: photoUrl }); // Store raw URL globally to be consistent, but display signed

                setPhotoModalOpen(false);
                toast.update(toastId, { render: "Your profile picture has been updated.", type: "success", isLoading: false, autoClose: 3000 });
            } else {
                throw new Error(result.message || "Upload failed");
            }
        } catch (error: any) {
            console.error("Photo upload error:", error);
            toast.update(toastId, { render: error.message || 'Something went wrong. Please try again.', type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setIsPhotoUploading(false);
        }
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
            const email = Cookies.get(cookieParams.email) || "";
            const emailPrefix = email ? email.split("@")[0] : null;

            const reviewerName = userProfile?.displayName ||
                (userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : null) ||
                (userProfile?.email ? userProfile.email.split('@')[0] : null) ||
                emailPrefix ||
                "User";
            const reviewerLocation = userProfile?.city && userProfile?.state ? `${userProfile.city}, ${userProfile.state}` : "";

            const newFeedback = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                rating: data.rating,
                text: data.text,
                highlightName: profile.firstName + " " + profile.lastName,
                reviewerName: reviewerName,
                reviewerLocation: reviewerLocation,
                reviewerPhoto: userProfile?.profilePhoto || "/assets/icons/icon_user.svg"
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
                    <Link href="/Landing" className={styles.navbarBrand}>
                        <DesiHelpersIcon />
                    </Link>
                    <div className={styles.navbarLinks}>
                        <Link href={Routes.viewAllJobs} className={styles.navLink}>Find Job</Link>
                        <Link href="/seekers/ViewAllSeekers" className={styles.navLink}>Hire Help</Link>
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
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CUserAvatar
                                className={styles.navIconButton}
                                style={{ padding: 0 }}
                                onToggle={(isOpen) => setAvatarOpen(isOpen)}
                            />
                        </div>
                    </div>
                    <button className={styles.mobileMenuBtn}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Header Actions - Positioned absolutely via CSS */}
                {!avatarOpen && (
                    <div className={styles.headerActions}>
                        <button className={styles.headerActionBtn} onClick={() => setPersonalSocialModalOpen(true)}>
                            <EditIcon />
                        </button>
                        <button className={styles.headerActionBtn}>
                            <ShareIcon />
                        </button>
                    </div>
                )}

                {/* Social Icons row - Positioned absolutely via CSS */}
                {!avatarOpen && (
                    <div className={styles.socialIconsRow}>
                        <a href={profile.socialLinks.facebook || "#"} className={styles.socialIcon} title="Facebook" target="_blank" rel="noopener noreferrer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                        </a>
                        <a href={profile.socialLinks.whatsapp ? `https://wa.me/${profile.socialLinks.whatsapp}` : "#"} className={styles.socialIcon} title="WhatsApp" target="_blank" rel="noopener noreferrer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.394 0 12.03c0 2.12.553 4.189 1.603 5.923L0 24l6.126-1.608a11.846 11.846 0 005.918 1.586h.005c6.632 0 12.028-5.396 12.032-12.033a11.833 11.833 0 00-3.535-8.503" /></svg>
                        </a>
                        <a href={profile.socialLinks.instagram || "#"} className={styles.socialIcon} title="Instagram" target="_blank" rel="noopener noreferrer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.171.054 1.81.247 2.23.408.56.216.96.474 1.38.894.42.42.678.82.894 1.38.161.42.354 1.059.408 2.23.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.171-.247 1.81-.408 2.23-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.42.161-1.059.354-2.23.408-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.171-.054-1.81-.247-2.23-.408-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.42-.42-.354-1.059-.408-2.23C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.171.247-1.81.408-2.23.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.42-.161 1.059-.354 2.23-.408 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 5.775.129 4.903.332 4.145.627c-.783.304-1.447.712-2.108 1.373S.931 3.362.627 4.145c-.295.758-.498 1.63-.555 2.908C.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.057 1.278.26 2.15.555 2.908.304.783.712 1.447 1.373 2.108s1.322 1.069 2.108 1.373c.758.295 1.63.498 2.908.555 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.278-.057 2.15-.26 2.908-.555.783-.304 1.447-.712 2.108-1.373s1.069-1.322 1.373-2.108c.295-.758.498-1.63.555-2.908.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.057-1.278-.26-2.15-.555-2.908-.304-.783-.712-1.447-1.373-2.108s-1.322-1.069-2.108-1.373c-.758-.295-1.63-.498-2.908-.555C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
                        </a>
                        <a href={profile.socialLinks.twitter || "#"} className={styles.socialIcon} title="X" target="_blank" rel="noopener noreferrer">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </a>
                        <a href={profile.socialLinks.linkedin || "#"} className={styles.socialIcon} title="LinkedIn" target="_blank" rel="noopener noreferrer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                        </a>
                    </div>
                )}

                {/* Profile Info Section */}
                <div className={`${styles.profileInfoSection} ${avatarOpen ? styles.profileInfoSectionHidden : ""}`}>
                    <div className={styles.profilePhotoContainer}>
                        {console.log("[ProfileDebug] Rendering photo container. profile.photo:", profile.photo, "profilePhotoError:", profilePhotoError)}
                        {profile.photo && profile.photo !== "/newassets/account_circle.png" && !profilePhotoError ? (
                            <img
                                src={profile.photo}
                                alt={`${profile.firstName} ${profile.lastName}`}
                                className={styles.profilePhoto}
                                onLoad={() => console.log("[ProfileDebug] Image loaded successfully:", profile.photo)}
                                onError={(e) => {
                                    console.error("[ProfileDebug] Image failed to load:", profile.photo, e);
                                    setProfilePhotoError(true);
                                }}
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
                        <div
                            className={styles.cameraIcon}
                            onClick={() => setPhotoModalOpen(true)}
                            style={{ cursor: "pointer" }}
                        >
                            <CameraIcon />
                        </div>
                    </div>

                    <div className={styles.profileDetails}>
                        <h1 className={styles.profileName}>
                            {(profile.firstName || profile.lastName) ? `${profile.firstName} ${profile.lastName}` : "Enter Name"}
                        </h1>
                        <div className={styles.starRating}>
                            {renderStars(profile.rating, "main-rating")}
                        </div>
                        <div className={styles.profileLocation}>
                            <LocationIcon />
                            <span>{profile.location || "Enter Location"}</span>
                        </div>

                        <div className={styles.actionButtons}>
                            <a href={`tel:${profile.mobileNumber}`} className={`${styles.actionBtn} ${styles.callBtn}`}>
                                <PhoneIcon /> Call ME
                            </a>
                            <a href={`mailto:${profile.email}`} className={`${styles.actionBtn} ${styles.emailBtn}`}>
                                <EmailIcon /> Email Me
                            </a>
                            <a href={`https://wa.me/${profile.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={`${styles.actionBtn} ${styles.whatsappBtn}`}>
                                <WhatsAppIcon /> Whatsapp Me
                            </a>
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
                                {profile.aboutMe || "-"} {profile.aboutMe && <span className={styles.readMore} style={{ fontWeight: 500 }}>Read more...</span>}
                            </p>

                            <div className={styles.infoRow} style={{ marginTop: "20px" }}>
                                <div className={styles.infoLabel}>Languages Spoken</div>
                                <div className={styles.infoValue}>{profile.languages || "-"}</div>
                            </div>

                            <div className={styles.infoGrid} style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>Commute Preference</div>
                                    <div className={styles.infoValue}>{profile.commutePreference || "-"}</div>
                                </div>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>Dietary Preference</div>
                                    <div className={styles.infoValue}>{profile.dietaryPreference || "-"}</div>
                                </div>
                            </div>

                            <div className={styles.infoRow} style={{ marginTop: "15px" }}>
                                <div className={styles.infoLabel}>OK With Pets</div>
                                <div className={styles.infoValue}>{profile.okWithPets || "-"}</div>
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
                                <div className={styles.infoValue}>{profile.address.line1 || "Enter Address Line 1"}</div>
                            </div>
                            <div className={styles.infoRow} style={{ marginTop: "15px" }}>
                                <div className={styles.infoLabel}>Address Line 2</div>
                                <div className={styles.infoValue}>{profile.address.line2 || "Enter Address Line 2"}</div>
                            </div>
                            <div className={styles.infoGrid} style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>City</div>
                                    <div className={styles.infoValue}>{profile.address.city || "Enter City"}</div>
                                </div>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>State</div>
                                    <div className={styles.infoValue}>{profile.address.state || "Enter State"}</div>
                                </div>
                            </div>
                            <div className={styles.infoRow} style={{ marginTop: "15px" }}>
                                <div className={styles.infoLabel}>Zip Code</div>
                                <div className={styles.infoValue}>{profile.address.zipCode || "Enter Zip Code"}</div>
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
                        {/* Add Feedback button removed — users cannot give feedback on their own profile */}
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
                                    {profile.services && profile.services.length > 0 ? (
                                        profile.services.map((service) => (
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

                    {/* Jobs Section */}
                    <div className={activeTab === 'jobs' ? styles.activeTabContent : styles.mobileOnly}>
                        <div className={`${styles.sidebarCard} ${activeTab === 'jobs' ? styles.tabSection : ""}`}>
                            <div className={`${styles.cardHeader} ${styles.mobileOnly}`} onClick={() => toggleSection('jobs')} style={{ cursor: 'pointer' }}>
                                <h3 className={styles.cardTitle} style={{ color: '#ff6b35' }}>Jobs Offered by Me</h3>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <span className={styles.editIcon} onClick={(e) => { e.stopPropagation(); setJobsModalOpen(true); }}><EditIcon /></span>
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
                                    {/* Add Feedback button removed — users cannot give feedback on their own profile */}
                                    <span style={{ transform: expandedSections.testimonials ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", color: '#ff6b35' }}>
                                        <ChevronUpIcon />
                                    </span>
                                </div>
                            </div>
                            {(expandedSections.testimonials || activeTab === 'testimonials') && (
                                <div className={styles.cardContent} style={{ padding: '0' }}>
                                    {/* Only showing received testimonials — users view feedback from others */}
                                    <div className={styles.testimonialToggle}>
                                        <button
                                            className={`${styles.toggleBtn} ${styles.toggleBtnActive}`}
                                            style={{ width: '100%', borderRadius: '8px' }}
                                        >
                                            Feedback Received
                                        </button>
                                    </div>

                                    {/* Testimonials List */}
                                    <div className={styles.testimonialsList}>
                                        {testimonialFilter === "received" && profile.testimonialsReceived && profile.testimonialsReceived.length > 0 ? (
                                            profile.testimonialsReceived.map((testimonial) => (
                                                <div key={testimonial.id} className={styles.testimonialCard}>
                                                    {/* Star Rating — color-coded */}
                                                    <div className={styles.testimonialStars}>
                                                        {Array(5).fill(0).map((_, i) => (
                                                            <span
                                                                key={`${testimonial.id}-star-${i}`}
                                                                className={styles.testimonialStar}
                                                                style={{ color: i < testimonial.rating ? getStarColor(testimonial.rating) : '#ddd' }}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Testimonial Text */}
                                                    <p className={styles.testimonialText}>
                                                        "{testimonial.highlightName ? testimonial.text.split(testimonial.highlightName).map((part: string, index: number, array: string[]) => (
                                                            <React.Fragment key={`${testimonial.id}-part-${index}`}>
                                                                {part}
                                                                {index < array.length - 1 && (
                                                                    <strong className={styles.highlightName}>{testimonial.highlightName}</strong>
                                                                )}
                                                            </React.Fragment>
                                                        )) : testimonial.text}"
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
                                        ) : (
                                            <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                                                No testimonials received yet
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
                                <div className={styles.cardContent} style={{ padding: '0' }}>
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
                    languages: profile.languages ? profile.languages.split(", ").filter(Boolean) : [],
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
                    firstName: profile.firstName || "",
                    lastName: profile.lastName || "",
                    displayName: profile.displayName || "",
                    gender: profile.gender || "Male",
                    email: profile.email || "",
                    mobileNumber: profile.mobileNumber || "",
                    whatsappNumber: profile.whatsappNumber || "",
                    whatsappSameAsMobile: profile.whatsappSameAsMobile || false,
                    facebookLink: profile.socialLinks.facebook === "#" ? "" : (profile.socialLinks.facebook || ""),
                    instagramLink: profile.socialLinks.instagram === "#" ? "" : (profile.socialLinks.instagram || ""),
                    linkedInLink: profile.socialLinks.linkedin === "#" ? "" : (profile.socialLinks.linkedin || ""),
                    twitterLink: profile.socialLinks.twitter === "#" ? "" : (profile.socialLinks.twitter || ""),
                    websiteLink: profile.socialLinks.website === "#" ? "" : (profile.socialLinks.website || ""),
                }}
            />
            <CPhotoUploadModal
                open={photoModalOpen}
                onClose={() => setPhotoModalOpen(false)}
                onSave={handlePhotoSave}
                isLoading={isPhotoUploading}
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
