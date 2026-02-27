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
                    <div className={styles.formCard}>
                        <h3 className={styles.cardTitle}>Create Your Profile</h3>

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
                    </div>
                </div>
            </div>
        </section>
    );
};
