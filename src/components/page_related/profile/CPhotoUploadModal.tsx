import React, { useState } from "react";
import styles from "@/styles/Profile.module.css";

interface CPhotoUploadModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (photos: File[]) => void;
}

const CPhotoUploadModal: React.FC<CPhotoUploadModalProps> = ({
    open,
    onClose,
    onSave
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    if (!open) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);
        }
    };

    const handleSave = () => {
        onSave(selectedFiles);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Upload Photo</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.uploadArea}>
                    <div className={styles.uploadIcon}>
                        <div className={styles.cloudIconWrapper}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                                <path d="M17.5 19c3.037 0 5.5-2.463 5.5-5.5 0-2.486-1.654-4.576-3.896-5.232C18.667 4.86 15.657 2 12 2 9.074 2 6.57 3.868 5.602 6.561 3.013 7.025 1 9.284 1 12c0 3.037 2.463 5.5 5.5 5.5h11z" />
                            </svg>
                            <div className={styles.cloudArrow}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 17V7M7 12l5-5 5 5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={styles.uploadText}>
                        Drop your files here or <label className={styles.browseLink}>
                            BROWSE
                            <input type="file" multiple accept=".jpg,.jpeg,.png" onChange={handleFileChange} style={{ display: "none" }} />
                        </label>
                    </div>
                    <p className={styles.uploadLimit}>
                        Supports (JPG, JPEG, PNG) Max 3 photos, each less than 500KB.
                    </p>
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button className={styles.updateBtn} onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default CPhotoUploadModal;
