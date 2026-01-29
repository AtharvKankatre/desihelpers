import React from "react";
import styles from "@/styles/JoinMissionSection.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export const JoinMissionSection: React.FC = () => {

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
                                <span className={styles.progressHighlight}>0%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill}></div>
                            </div>
                        </div>

                        {/* Form Inputs */}
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    placeholder="Surinder Kaur"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <input
                                    type="tel"
                                    placeholder="Mobile Number"
                                    className={styles.input}
                                />
                            </div>

                            <button type="submit" className={styles.submitButton}>
                                Get Started
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
