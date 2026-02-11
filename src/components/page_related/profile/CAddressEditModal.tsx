import React, { useState } from "react";
import styles from "@/styles/Profile.module.css";

interface AddressData {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zipCode: string;
}

interface CAddressEditModalProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (address: AddressData) => void;
    initialData: AddressData;
}

const CAddressEditModal: React.FC<CAddressEditModalProps> = ({
    open,
    onClose,
    onUpdate,
    initialData
}) => {
    const [formData, setFormData] = useState<AddressData>(initialData);

    if (!open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        onUpdate(formData);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Address Details</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.formSection}>
                        <label className={styles.fieldLabel}>Address Line 1</label>
                        <input
                            type="text"
                            name="line1"
                            className={styles.formInput}
                            value={formData.line1}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formSection}>
                        <label className={styles.fieldLabel}>Address Line 2</label>
                        <input
                            type="text"
                            name="line2"
                            className={styles.formInput}
                            value={formData.line2}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formThreeCol}>
                        <div className={styles.formSection}>
                            <label className={styles.fieldLabel}>City</label>
                            <select
                                name="city"
                                className={styles.formSelect}
                                value={formData.city}
                                onChange={handleChange}
                            >
                                <option value="Bellevue">Bellevue</option>
                                <option value="Seattle">Seattle</option>
                                <option value="Redmond">Redmond</option>
                                <option value="Kirkland">Kirkland</option>
                            </select>
                        </div>
                        <div className={styles.formSection}>
                            <label className={styles.fieldLabel}>State</label>
                            <select
                                name="state"
                                className={styles.formSelect}
                                value={formData.state}
                                onChange={handleChange}
                            >
                                <option value="Washington">Washington</option>
                                <option value="Oregon">Oregon</option>
                                <option value="California">California</option>
                                <option value="Texas">Texas</option>
                            </select>
                        </div>
                        <div className={styles.formSection}>
                            <label className={styles.fieldLabel}>Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                className={styles.formInput}
                                value={formData.zipCode}
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

export default CAddressEditModal;
