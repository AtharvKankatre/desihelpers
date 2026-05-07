import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/JoinMissionSection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { useAuth } from "@/services/authorization/AuthContext";
import Swal from "sweetalert2";
import useTranslation from "next-translate/useTranslation";

export const JoinMissionSection: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslation('common');
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

    // Checklist items from translation
    const checklistItems = [
        t('join_mission.checklist_1'),
        t('join_mission.checklist_2'),
        t('join_mission.checklist_3'),
        t('join_mission.checklist_4'),
        t('join_mission.checklist_5'),
        t('join_mission.checklist_6'),
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* LEFT CONTENT */}
                <div className={styles.leftContent}>
                    <div className={styles.subHeader}>{t('join_mission.sub_header')}</div>
                    <h2 className={styles.mainHeader}>{t('join_mission.main_header')}</h2>

                    <p className={styles.description}>
                        {t('join_mission.description')}
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
                            {completionPercent === 100 ? t('join_mission.card_title_done') : t('join_mission.card_title_new')}
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
                                    {t('join_mission.welcome')}, {profileName.split(' ')[0]}!
                                </h3>
                                <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "0.875rem" }}>
                                    {t('join_mission.profile_complete')}
                                </p>
                                <button type="button" onClick={() => router.push("/profile")} className={styles.submitButton} style={{ width: "100%" }}>
                                    {t('join_mission.go_to_profile')}
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Progress Bar */}
                                <div className={styles.progressContainer}>
                                    <div className={styles.progressLabels}>
                                        <span>{t('join_mission.profile_completion')}</span>
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
                                            placeholder={t('join_mission.name_placeholder')}
                                            value={profileName}
                                            readOnly
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <input
                                            type="email"
                                            placeholder={t('join_mission.email_placeholder')}
                                            value={profileEmail}
                                            readOnly
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <input
                                            type="tel"
                                            placeholder={t('join_mission.mobile_placeholder')}
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
                                        {isActive ? t('join_mission.complete_profile_btn') : t('join_mission.get_started_btn')}
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
