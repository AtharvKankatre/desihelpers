import React, { useState } from "react";
import styles from "@/styles/Profile.module.css";

interface CEditProfileModalProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (data: any) => void;
    initialData: {
        aboutMe: string;
        languages: string[];
        commutePreference: string;
        dietaryPreference: string;
        okWithPets: string;
    };
}

const CEditProfileModal: React.FC<CEditProfileModalProps> = ({
    open,
    onClose,
    onUpdate,
    initialData
}) => {
    const [aboutMe, setAboutMe] = useState(initialData.aboutMe);
    const [languages, setLanguages] = useState(initialData.languages);
    const [commute, setCommute] = useState(initialData.commutePreference);
    const [dietary, setDietary] = useState(initialData.dietaryPreference);
    const [pets, setPets] = useState(initialData.okWithPets);

    if (!open) return null;

    const handleUpdate = () => {
        onUpdate({
            aboutMe,
            languages,
            commutePreference: commute,
            dietaryPreference: dietary,
            okWithPets: pets
        });
        onClose();
    };

    const wordCount = aboutMe.trim() === "" ? 0 : aboutMe.trim().split(/\s+/).length;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Edit Profile</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <p className={styles.modalSubtitle}>
                    Providing detailed information about yourself will increase chances of getting connected with more people in the community
                </p>

                <div className={styles.formSection}>
                    <label className={styles.fieldLabel}>About Me</label>
                    <div className={styles.textareaContainer}>
                        <textarea
                            className={styles.textarea}
                            value={aboutMe}
                            onChange={(e) => setAboutMe(e.target.value)}
                            placeholder="Tell us about yourself..."
                        />
                        <span className={styles.wordCount}>{wordCount}/250 words</span>
                    </div>
                </div>

                <div className={styles.formSection} style={{ marginTop: '10px' }}>
                    <label className={styles.fieldLabel}>Spoken Languages</label>
                    <div className={styles.multiSelect}>
                        {languages.map((lang, index) => (
                            <span key={index} className={styles.langTag}>
                                {lang} <span className={styles.removeTag}>×</span>
                            </span>
                        ))}
                        <div className={styles.chevronIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.radioGroupsRow}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label className={styles.fieldLabel}>Commute Preference</label>
                            <div className={styles.radioGroup}>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="commute"
                                        value="Have a Ride"
                                        checked={commute === "Have a Ride"}
                                        onChange={(e) => setCommute(e.target.value)}
                                    />
                                    <span className={styles.radioCircle}></span>
                                    Have a Ride
                                </label>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="commute"
                                        value="Require a Ride"
                                        checked={commute === "Require a Ride"}
                                        onChange={(e) => setCommute(e.target.value)}
                                    />
                                    <span className={styles.radioCircle}></span>
                                    Require a Ride
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <label className={styles.fieldLabel}>Dietary Preference</label>
                    <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="dietary"
                                value="Veg"
                                checked={dietary === "Veg"}
                                onChange={(e) => setDietary(e.target.value)}
                            />
                            <span className={styles.radioCircle}></span>
                            Veg
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="dietary"
                                value="Non-Veg"
                                checked={dietary === "Non-Veg"}
                                onChange={(e) => setDietary(e.target.value)}
                            />
                            <span className={styles.radioCircle}></span>
                            Non-Veg
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="dietary"
                                value="Veg/Non-Veg"
                                checked={dietary === "Veg/Non-Veg"}
                                onChange={(e) => setDietary(e.target.value)}
                            />
                            <span className={styles.radioCircle}></span>
                            Veg/Non-Veg
                        </label>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <label className={styles.fieldLabel}>OK With Pets</label>
                    <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="pets"
                                value="Yes"
                                checked={pets === "Yes"}
                                onChange={(e) => setPets(e.target.value)}
                            />
                            <span className={styles.radioCircle}></span>
                            Yes
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="pets"
                                value="No"
                                checked={pets === "No"}
                                onChange={(e) => setPets(e.target.value)}
                            />
                            <span className={styles.radioCircle}></span>
                            No
                        </label>
                    </div>
                </div>

                <div className={styles.modalActions} style={{ borderTop: 'none', paddingBottom: '30px', justifyContent: 'center', gap: '20px' }}>
                    <button className={styles.cancelBtn} style={{ width: '180px' }} onClick={onClose}>Cancel</button>
                    <button className={styles.updateBtn} style={{ width: '180px' }} onClick={handleUpdate}>Update</button>
                </div>
            </div>
        </div>
    );
};

export default CEditProfileModal;
