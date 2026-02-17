import React, { useState, useEffect } from "react";
import styles from "@/styles/Profile.module.css";

interface TestimonialData {
    id: string | number;
    rating: number;
    text: string;
    reviewerName?: string;
    reviewerLocation?: string;
}

interface CFeedbackModalProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (feedback: { rating: number; text: string; id?: string | number }) => void;
    initialData?: TestimonialData | null;
}

const CFeedbackModal: React.FC<CFeedbackModalProps> = ({
    open,
    onClose,
    onUpdate,
    initialData
}) => {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");

    useEffect(() => {
        if (open) {
            if (initialData) {
                setRating(initialData.rating);
                setText(initialData.text);
            } else {
                setRating(0);
                setText("");
            }
        }
    }, [open, initialData]);

    if (!open) return null;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({
            id: initialData?.id,
            rating,
            text
        });
        onClose();
    };

    const handleAddNew = () => {
        setRating(0);
        setText("");
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{initialData ? "Edit Feedback" : "Testimonials"}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.servicesModalActions} style={{ marginBottom: '10px' }}>
                    <p className={styles.modalSubtitle}>
                        Add/Delete testimonials to get listed on deshihelper
                    </p>
                    <div className={styles.addServicesLink} onClick={handleAddNew}>
                        <span>+</span> Add Feedback
                    </div>
                </div>

                <div className="p-4 pt-2">
                    <form onSubmit={handleSave}>
                        <div className="mb-4 p-3 rounded" style={{ border: '1px solid #eee', backgroundColor: '#fff' }}>
                            <div className="mb-3">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <label className="fw-bold fs-6 m-0" style={{ color: '#001838' }}>Rate Experience</label>
                                    <div className="d-flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className="cursor-pointer"
                                                role="button"
                                                onClick={() => setRating(star)}
                                                style={{
                                                    color: star <= rating ? "#f07c00" : "#e0e0e0",
                                                    fontSize: '24px',
                                                    transition: 'color 0.2s',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <textarea
                                    className={styles.textarea}
                                    rows={4}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Write your feedback here..."
                                    required
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        padding: '0',
                                        resize: 'none',
                                        fontSize: '14px',
                                        boxShadow: 'none',
                                        minHeight: '100px'
                                    }}
                                />
                            </div>
                        </div>

                        <div className={styles.modalActions} style={{ marginTop: '20px' }}>
                            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                            <button type="submit" className={styles.updateBtn}>{initialData ? "Update" : "Submit"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CFeedbackModal;
