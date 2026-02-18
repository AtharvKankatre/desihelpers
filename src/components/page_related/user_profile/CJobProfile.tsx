// components/ProfileCard.tsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { IJobs } from "@/models/Jobs";
import { CUserPhoto } from "./CUserPhoto";
import { Col, Row } from "react-bootstrap";
import { CDisplay } from "@/components/reusable/CDisplay";
import { useAuth } from "@/services/authorization/AuthContext";
import style from "@/styles/UserProfiles.module.css"
import jobStyles from "@/styles/ViewAllJobs.module.css"
import { formatDate } from "@/services/functions/FormatDate";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import Link from "next/link";
import router from "next/router";
import { Routes } from "@/services/routes/Routes";
import Swal from "sweetalert2";
import Cookies from "js-cookie";


type UserProfileProps = {
    profile: IJobs | null
};

const ProfileCard: React.FC<UserProfileProps> = ({ ...UserProfileProps }) => {
    // console.log("CJobProfile profile:", UserProfileProps.profile); // Debugging
    const { tablet } = useAppMediaQuery();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const activeStatus = Cookies.get("isActive") === "true";
        setIsActive(activeStatus);
        if (!activeStatus) {
            Swal.fire({
                title: "Access Denied",
                text: "Please log in to view the details.",
                icon: "warning",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/Login");
                }
            });
        }
    }, []);

    if (!isActive) {
        return null;
    }

    function returnAddress() {
        return `${UserProfileProps.profile?.addressLine1 ?? "-"} ${UserProfileProps.profile?.addressLine2 ?? ""}, ${UserProfileProps.profile?.city ?? "-"
            }, ${UserProfileProps.profile?.state ?? "-"} - ${UserProfileProps.profile?.zipCode ?? "-"}`;
    }
    const whatappApiUrl = process.env.NEXT_PUBLIC_WHATAPP_API;
    const handleWhatsAppClick = () => {
        const whatsappURL = `${whatappApiUrl}send?phone=${UserProfileProps.profile?.userProfile?.mobile?.replace(/[^\d]/g, "")}`;
        window.open(whatsappURL, "_blank");
    };

    return (
        <div className={`container mt-4 mb-4`}>
            {/* Back Button */}
            <div className="mb-3">
                <button
                    onClick={() => router.push(Routes.viewAllJobs)}
                    className="btn btn-link text-decoration-none p-0 d-flex align-items-center"
                    style={{ color: '#001838', fontWeight: '600' }}
                >
                    <span className="me-2" style={{ fontSize: '1.2rem' }}>←</span> Back to Jobs
                </button>
            </div>

            {/* Main Job Card Container - Styled like ViewAllJobs card but larger */}
            <div className={`${jobStyles.jobCard} shadow-sm border-0 p-4`}>

                {/* Header: Posted By + Price */}
                <div className={jobStyles.cardTopRow}>
                    <span className={jobStyles.cardPostedBy}>
                        Posted {formatDate(UserProfileProps.profile?.createdAt?.toString())} ago by <strong>{UserProfileProps.profile?.userProfile?.displayName ?? "Unknown"}</strong>
                    </span>
                    <span className={jobStyles.cardPrice} style={{ fontSize: '24px' }}>
                        {UserProfileProps.profile?.payRange ?? "Negotiable"} <span className={jobStyles.cardPriceUnit} style={{ fontSize: '16px' }}>/hr</span>
                    </span>
                </div>

                {/* Title Row */}
                <div className={`${jobStyles.cardTitleRow} mt-3 mb-3`}>
                    <h1 className={jobStyles.cardJobTitle} style={{ fontSize: '28px' }}>
                        {UserProfileProps.profile?.jobType?.name ?? "Job Opportunity"}
                        {UserProfileProps.profile?.urgent && (
                            <span className={jobStyles.cardUrgentStar} style={{ fontSize: '24px', marginLeft: '10px' }}>✴</span>
                        )}
                    </h1>
                    <div className={jobStyles.cardTitleActions}>
                        <button className={jobStyles.cardShareBtn} title="Share" onClick={handleWhatsAppClick}>
                            <img src="/assets/icons/form_icons/icon_whatsapp.svg" alt="WhatsApp" width="20" height="20" />
                        </button>
                        {/* Email Button if available */}
                        {UserProfileProps.profile?.userProfile?.email && (
                            <Link href={`mailto:${UserProfileProps.profile?.userProfile.email}`}>
                                <button className={jobStyles.cardShareBtn} title="Email">
                                    <img src="/assets/icons/form_icons/icon_email.svg" alt="Email" width="20" height="20" />
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Primary Details Row (Icons) */}
                <div className={`${jobStyles.cardDetails} d-flex flex-row flex-wrap gap-4 mb-4`} style={{ fontSize: '15px' }}>
                    <div className={jobStyles.cardDetailItem}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>Start Date: <strong>{formatDate(UserProfileProps.profile?.startDate?.toString())}</strong></span>
                    </div>
                    <div className={jobStyles.cardDetailItem}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        <span>Work Type: <strong>{UserProfileProps.profile?.workType ?? "Not specified"}</strong></span>
                    </div>
                    <div className={jobStyles.cardDetailItem}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#f07c00" stroke="none">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                        </svg>
                        <span>{UserProfileProps.profile?.city}, {UserProfileProps.profile?.state}</span>
                    </div>
                </div>

                {/* Language Tags */}
                <div className={`${jobStyles.cardTags} mb-4`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f07c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" />
                        <path d="M22 22l-5-10-5 10" /><path d="M14 18h6" />
                    </svg>
                    <span className={jobStyles.cardTag} style={{ fontSize: '12px', padding: '5px 12px' }}>English</span>
                    <span className={jobStyles.cardTag} style={{ fontSize: '12px', padding: '5px 12px' }}>Hindi</span>
                    <span className={jobStyles.cardTagMore} style={{ fontSize: '12px', padding: '5px 12px' }}>+2</span>
                </div>

                <hr className="mb-4" />

                {/* Full Description & Detailed Grid */}
                <div className="row">
                    <div className="col-12 mb-4">
                        <h5 className="mb-3 text-dark font-weight-bold">Job Description</h5>
                        <div className={`p-3 bg-light rounded ${style.scrollableDescription}`} style={{ fontSize: '14px', lineHeight: '1.6', color: '#444' }}>
                            {UserProfileProps.profile?.aboutRequirement ?? "No description provided."}
                        </div>
                    </div>

                    {/* Detailed Info Grid */}
                    <div className="col-md-6 mb-3">
                        <CDisplay
                            heading="Sub Category"
                            icon="/assets/icons/form_icons/icon_job_description.svg"
                            label={UserProfileProps.profile?.subCategory ?? "-"}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <CDisplay
                            heading="Required Experience"
                            icon="/assets/icons/form_icons/icon_experience.svg"
                            label={`${UserProfileProps.profile?.requiredExperience ?? "0"} Years`}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <CDisplay
                            heading="Days Per Week"
                            icon="/assets/icons/form_icons/icon_no_of_days.svg"
                            label={`${UserProfileProps.profile?.numberOfDays ?? "-"} Days`}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <CDisplay
                            heading="Dietary Preference"
                            icon="/assets/icons/form_icons/icon_diet.svg"
                            label={UserProfileProps.profile?.dietaryPreference ?? "Any"}
                        />
                    </div>
                    <div className="col-md-12 mb-3">
                        <CDisplay
                            heading="Address"
                            icon="/assets/icons/form_icons/icon_address.svg"
                            label={returnAddress()}
                        />
                    </div>

                    {/* Dummy Data Section to make it look informative */}
                    <div className="col-12 mt-4 mb-3">
                        <h5 className="mb-3 text-dark font-weight-bold">Additional Information</h5>
                    </div>

                    <div className="col-md-6 mb-3">
                        <CDisplay
                            heading="Schedule"
                            icon="/assets/icons/form_icons/icon_no_of_days.svg"
                            label="Mon-Fri, 9:00 AM - 5:00 PM"
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <CDisplay
                            heading="Employment Type"
                            icon="/assets/icons/form_icons/icon_job_description.svg"
                            label="Full Time, Permanent"
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <CDisplay
                            heading="Benefits"
                            icon="/assets/icons/form_icons/icon_diet.svg"
                            label="Transportation, Meals provided"
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <CDisplay
                            heading="Distance"
                            icon="/assets/icons/form_icons/icon_address.svg"
                            label="2.5 miles away"
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <CDisplay
                            heading="Reference Check"
                            icon="/assets/icons/form_icons/icon_job_description.svg"
                            label="Required"
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <CDisplay
                            heading="Background Check"
                            icon="/assets/icons/form_icons/icon_job_description.svg"
                            label="Verified"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileCard;
