import React, { useState, useEffect } from "react";
import styles from "@/styles/Profile.module.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter, FaGlobe } from "react-icons/fa6";

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
    linkedInLink: string;
    twitterLink: string;
    websiteLink: string;
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
            <div className={`${styles.modalContainer} ${styles.modalContainerWithBorder}`}>
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
                                placeholder="First Name"
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
                                placeholder="Last Name"
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
                                placeholder="Display Name"
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
                                <option value="" disabled>Select gender</option>
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
                                placeholder="Email ID"
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
                                placeholder="Mobile Number"
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
                            placeholder="WhatsApp Number"
                        />
                    </div>

                    <h4 className={styles.sectionHeading}>Social Media Details</h4>

                    <div className={styles.formRow}>
                        <div className={styles.formSection}>
                            <label className={styles.socialFieldLabel}>
                                <span className={`${styles.socialIcon} ${styles.fbIcon}`}>
                                    <FaFacebook size={18} color="#1877F2" />
                                </span>
                                Facebook Link
                            </label>
                            <input
                                type="text"
                                name="facebookLink"
                                placeholder="Enter facebook link"
                                className={styles.formInput}
                                value={formData.facebookLink}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formSection}>
                            <label className={styles.socialFieldLabel}>
                                <span className={`${styles.socialIcon} ${styles.igIcon}`}>
                                    <FaInstagram size={18} color="#E4405F" />
                                </span>
                                Instagram Link
                            </label>
                            <input
                                type="text"
                                name="instagramLink"
                                placeholder="Enter instagram link"
                                className={styles.formInput}
                                value={formData.instagramLink}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formSection}>
                            <label className={styles.socialFieldLabel}>
                                <span className={`${styles.socialIcon} ${styles.liIcon}`}>
                                    <FaLinkedin size={18} color="#0A66C2" />
                                </span>
                                LinkedIn Link
                            </label>
                            <input
                                type="text"
                                name="linkedInLink"
                                placeholder="Enter linkedin link"
                                className={styles.formInput}
                                value={formData.linkedInLink || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formSection}>
                            <label className={styles.socialFieldLabel}>
                                <span className={`${styles.socialIcon} ${styles.twIcon}`}>
                                    <FaXTwitter size={18} color="#000000" />
                                </span>
                                Twitter Link
                            </label>
                            <input
                                type="text"
                                name="twitterLink"
                                placeholder="Enter twitter link"
                                className={styles.formInput}
                                value={formData.twitterLink || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formSection}>
                            <label className={styles.socialFieldLabel}>
                                <span className={`${styles.socialIcon} ${styles.webIcon}`}>
                                    <FaGlobe size={18} color="#FF8A00" />
                                </span>
                                Website Link
                            </label>
                            <input
                                type="text"
                                name="websiteLink"
                                placeholder="Enter website link"
                                className={styles.formInput}
                                value={formData.websiteLink || ""}
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
