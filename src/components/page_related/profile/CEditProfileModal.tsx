import React, { useState } from "react";
import styles from "@/styles/Profile.module.css";
import LanguageSelect from "@/components/form/CMultiSelect";

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
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                <p className={styles.modalSubtitle}>
                    Providing detailed information about yourself will increase chances of getting connected with more people in the community
                </p>

                <div className={styles.modalBody}>
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
                        <LanguageSelect
                            value={languages}
                            onChange={(selected) => setLanguages(selected)}
                            onBlur={() => { }}
                            name="Spoken Languages"
                            id="languages"
                            hideError={true}
                        />
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
                                            value="Have a ride"
                                            checked={commute === "Have a ride"}
                                            onChange={(e) => setCommute(e.target.value)}
                                        />
                                        <span className={styles.radioCircle}></span>
                                        Have a ride
                                    </label>
                                    <label className={styles.radioLabel}>
                                        <input
                                            type="radio"
                                            name="commute"
                                            value="Will need a ride"
                                            checked={commute === "Will need a ride"}
                                            onChange={(e) => setCommute(e.target.value)}
                                        />
                                        <span className={styles.radioCircle}></span>
                                        Will need a ride
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
                </div>

                <div className={styles.modalActions} style={{ borderTop: 'none', paddingBottom: '30px', justifyContent: 'center', gap: '20px' }}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button className={styles.updateBtn} onClick={handleUpdate}>Update</button>
                </div>
            </div>
        </div>
    );
};

export default CEditProfileModal;
