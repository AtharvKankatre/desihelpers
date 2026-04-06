import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/JoinMissionSection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { useAuth } from "@/services/authorization/AuthContext";
import Swal from "sweetalert2";

export const JoinMissionSection: React.FC = () => {
    const router = useRouter();
    const { isActive } = useAuth();
    const [completionPercent, setCompletionPercent] = useState(0);
    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [profileMobile, setProfileMobile] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");

    useEffect(() => {
        if (!isActive) return;

        const fetchProfile = async () => {
            try {
                const result = await ApiService.crud(APIDetails.getUserProfile);
                if (result[0] && result[1]) {
                    const p = result[1];

                    // Pre-fill the display fields
                    const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim();
                    setProfileName(fullName);
                    setProfileEmail(p.email || "");
                    setProfileMobile(p.mobile || p.phone || "");
                    setProfilePhoto(p.profilePhoto || "");

                    // Calculate completion based on key profile fields
                    const fields = [
                        p.firstName,
                        p.lastName,
                        p.email,
                        p.mobile || p.phone,
                        p.addressLine1,
                        p.city,
                        p.state,
                        p.zipCode,
                        p.languagesSpoken && p.languagesSpoken.length > 0 ? "filled" : "",
                        p.aboutMe,
                        p.gender,
                        p.displayName,
                    ];
                    const filled = fields.filter(
                        (f) => f !== undefined && f !== null && f !== ""
                    ).length;
                    const percent = Math.round((filled / fields.length) * 100);
                    setCompletionPercent(percent);
                }
            } catch (err) {
                console.error("Error fetching profile for completion:", err);
            }
        };

        fetchProfile();
    }, [isActive]);

    // Checklist items from the design
    const checklistItems = [
        "Completely Free for Everyone",
        "Local, Active Profiles at Your Fingertips",
        "Zero Sensitive Data Collected",
        "Community-Driven Empowerment",
        "Effort and Time Saved, Real Results Gained",
        "No Hidden Agendas, Just Connection"
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* LEFT CONTENT */}
                <div className={styles.leftContent}>
                    <div className={styles.subHeader}>Join Our Mission</div>
                    <h2 className={styles.mainHeader}>Be Part Of The Change</h2>

                    <p className={styles.description}>
                        Join a growing community built on trust, simplicity, and shared value.
                        Whether you need help or want to offer your skills—start here, today.
                    </p>

                    <ul className={styles.checklist}>
                        {checklistItems.map((item, index) => (
                            <li key={index} className={styles.checkItem}>
                                <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* RIGHT CONTENT - FORM CARD */}
                <div className={styles.rightContent}>
                    <div className={styles.formCard} style={completionPercent === 100 ? {
                        border: "1px solid #e0e7ff",
                        backgroundColor: "#f8faff"
                    } : {}}>
                        <h3 className={styles.cardTitle} style={completionPercent === 100 ? { textAlign: "center" } : {}}>
                            {completionPercent === 100 ? "Your Profile" : "Create Your Profile"}
                        </h3>

                        {completionPercent === 100 ? (
                            <div style={{ textAlign: "center", padding: "20px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{
                                    width: "120px",
                                    height: "120px",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    border: "3px solid #10b981",
                                    marginBottom: "16px",
                                    backgroundColor: "#f3f4f6"
                                }}>
                                    {profilePhoto && profilePhoto.startsWith("http") ? (
                                        <img
                                            src={profilePhoto}
                                            alt="Profile"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                                const parent = (e.target as HTMLImageElement).parentElement;
                                                if (parent) {
                                                    parent.innerHTML = `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><circle cx="60" cy="60" r="60" fill="#E8ECF1"/><circle cx="60" cy="44" r="16" fill="#003B73"/><path d="M28 100c0-17.673 14.327-32 32-32s32 14.327 32 32" fill="#003B73"/></svg>`;
                                                }
                                            }}
                                        />
                                    ) : (
                                        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                                            <circle cx="60" cy="60" r="60" fill="#E8ECF1" />
                                            <circle cx="60" cy="44" r="16" fill="#003B73" />
                                            <path d="M28 100c0-17.673 14.327-32 32-32s32 14.327 32 32" fill="#003B73" />
                                        </svg>
                                    )}
                                </div>
                                <h3 className={styles.cardTitle} style={{ marginBottom: "8px", fontSize: "1.25rem", color: "#111827" }}>
                                    Welcome, {profileName.split(' ')[0]}!
                                </h3>
                                <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "0.875rem" }}>
                                    Your profile is 100% complete.
                                </p>
                                <button type="button" onClick={() => router.push("/profile")} className={styles.submitButton} style={{ width: "100%" }}>
                                    Go to My Profile
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Progress Bar */}
                                <div className={styles.progressContainer}>
                                    <div className={styles.progressLabels}>
                                        <span>Profile Completion</span>
                                        <span className={styles.progressHighlight}>{completionPercent}%</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${completionPercent}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Form Inputs */}
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={profileName}
                                            readOnly
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={profileEmail}
                                            readOnly
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <input
                                            type="tel"
                                            placeholder="Mobile Number"
                                            value={profileMobile}
                                            readOnly
                                            className={styles.input}
                                        />
                                    </div>

                                    <button type="button" onClick={() => {
                                        if (isActive) {
                                            router.push("/profile");
                                        } else {
                                            router.push("/Login?mode=signup");
                                        }
                                    }} className={styles.submitButton}>
                                        {isActive ? "Complete Your Profile" : "Get Started"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
