import React, { useRef, useState } from "react";
import styles from "@/styles/Profile.module.css";

interface CPhotoUploadModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (photos: File[]) => void;
    isLoading?: boolean;
}

const CPhotoUploadModal: React.FC<CPhotoUploadModalProps> = ({
    open,
    onClose,
    onSave,
    isLoading = false
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    // Use a ref so the input is always accessible regardless of which branch renders
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!open) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Limit to 5MB
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit. Please choose a smaller image.");
                e.target.value = "";
                return;
            }

            setSelectedFiles([file]);

            // Clean up old preview URL
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            // Generate new preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSave = () => {
        if (selectedFiles.length === 0) return;
        // Pass files to parent — the parent's async handler will close the modal on success
        onSave(selectedFiles);
        // Clean up object URL now (the file data is captured in selectedFiles)
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setSelectedFiles([]);
        // NOTE: Do NOT call onClose() here — the parent closes the modal after upload succeeds
    };

    const handleCancel = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setSelectedFiles([]);
        onClose();
    };

    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            // Reset value so re-selecting the same file still triggers onChange
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Update Profile Photo</h2>
                    <button className={styles.closeBtn} onClick={handleCancel}>×</button>
                </div>

                {/* Hidden file input — always in the DOM so it's always clickable */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />

                <div className={styles.uploadArea}>
                    {previewUrl ? (
                        <div className={styles.previewContainer}>
                            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                            <div className={styles.changePhotoBtn} onClick={triggerFileSelect}>
                                Change Photo
                            </div>
                        </div>
                    ) : (
                        <div className={styles.uploadEmptyState}>
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
                                <span className={styles.browseLink} onClick={triggerFileSelect}>
                                    Select Photo
                                </span>
                            </div>
                            <p className={styles.uploadLimit}>
                                Supports (JPG, JPEG, PNG) Max 5MB file size.
                            </p>
                        </div>
                    )}
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.cancelBtn} onClick={handleCancel} disabled={isLoading}>Cancel</button>
                    <button
                        className={styles.updateBtn}
                        onClick={handleSave}
                        disabled={selectedFiles.length === 0 || isLoading}
                        style={{ opacity: (selectedFiles.length === 0 || isLoading) ? 0.6 : 1, cursor: (selectedFiles.length === 0 || isLoading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {isLoading ? (
                            <>
                                <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                Uploading...
                            </>
                        ) : 'Save Photo'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CPhotoUploadModal;
