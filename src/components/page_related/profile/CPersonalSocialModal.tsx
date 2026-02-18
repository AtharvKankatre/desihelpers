import React, { useState, useEffect } from "react";
import styles from "@/styles/Profile.module.css";

interface PersonalSocialData {
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
}

interface CPersonalSocialModalProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (data: PersonalSocialData) => void;
    initialData: PersonalSocialData;
}

const CPersonalSocialModal: React.FC<CPersonalSocialModalProps> = ({
    open,
    onClose,
    onUpdate,
    initialData
}) => {
    const [formData, setFormData] = useState<PersonalSocialData>(initialData);

    useEffect(() => {
        if (open) {
            setFormData(initialData);
        }
    }, [open, initialData]);

    if (!open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setFormData(prev => ({
            ...prev,
            whatsappSameAsMobile: checked,
            whatsappNumber: checked ? prev.mobileNumber : prev.whatsappNumber
        }));
    };

    const handleUpdate = () => {
        onUpdate(formData);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Personal & Social Details</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.modalBody}>
                    <h4 className={styles.sectionHeading}>Personal Details</h4>

                    <div className={styles.formRow}>
                        <div className={styles.formSection}>
                            <label className={styles.fieldLabel}>First name</label>
                            <input
                                type="text"
                                name="firstName"
                                className={styles.formInput}
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formSection}>
                            <label className={styles.fieldLabel}>Last name</label>
                            <input
                                type="text"
                                name="lastName"
                                className={styles.formInput}
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formSection}>
                            <label className={styles.fieldLabel}>Display name</label>
                            <input
                                type="text"
                                name="displayName"
                                className={styles.formInput}
                                value={formData.displayName}
                                onChange={handleChange}
                                placeholder="Enter"
                            />
                        </div>
                        <div className={styles.formSection}>
                            <label className={styles.fieldLabel}>Gender</label>
                            <select
                                name="gender"
                                className={styles.formSelect}
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formSection}>
                            <label className={styles.fieldLabel}>Email ID</label>
                            <input
                                type="email"
                                name="email"
                                className={styles.formInput}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formSection}>
                            <label className={styles.fieldLabel}>Mobile number</label>
                            <input
                                type="text"
                                name="mobileNumber"
                                className={styles.formInput}
                                value={formData.mobileNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.checkboxWrapper}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={formData.whatsappSameAsMobile}
                                onChange={handleCheckboxChange}
                            />
                            <span className={styles.checkboxCustom}></span>
                            WhatsApp number same as mobile no
                        </label>
                    </div>

                    <div className={`${styles.formSection} ${formData.whatsappSameAsMobile ? styles.disabledField : ""}`}>
                        <label className={styles.fieldLabel}>WhatsApp number</label>
                        <input
                            type="text"
                            name="whatsappNumber"
                            className={styles.formInput}
                            value={formData.whatsappSameAsMobile ? formData.mobileNumber : formData.whatsappNumber}
                            onChange={handleChange}
                            disabled={formData.whatsappSameAsMobile}
                            placeholder="Enter WhatsApp Number"
                        />
                    </div>

                    <h4 className={styles.sectionHeading}>Social Media Details</h4>

                    <div className={styles.formRow}>
                        <div className={styles.formSection}>
                            <label className={styles.socialFieldLabel}>
                                <span className={`${styles.socialIcon} ${styles.fbIcon}`}>
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                                </span>
                                Facebook Link
                            </label>
                            <input
                                type="text"
                                name="facebookLink"
                                className={styles.formInput}
                                value={formData.facebookLink}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formSection}>
                            <label className={styles.socialFieldLabel}>
                                <span className={`${styles.socialIcon} ${styles.igIcon}`}>
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.976-.976 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.353 2.612 6.766 6.953 6.966 1.28.059 1.688.072 4.947.072s3.667-.013 4.947-.072c4.351-.2 6.763-2.612 6.963-6.966.059-1.28.073-1.688.073-4.947s-.014-3.667-.073-4.947c-.2-4.357-2.612-6.77-6.963-6.973C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                </span>
                                Instagram Link
                            </label>
                            <input
                                type="text"
                                name="instagramLink"
                                className={styles.formInput}
                                value={formData.instagramLink}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button className={styles.updateBtn} onClick={handleUpdate}>Update</button>
                </div>
            </div>
        </div>
    );
};

export default CPersonalSocialModal;
