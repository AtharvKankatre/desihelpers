import React, { useState } from "react";
import styles from "@/styles/Profile.module.css";

interface ServiceData {
    id: string;
    title: string;
    category: string;
    subCategory: string;
    description: string;
    experience: string;
    offeringNow: string;
    isExpanded: boolean;
}

interface CServicesModalProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (services: ServiceData[]) => void;
    initialServices: ServiceData[];
}

const CServicesModal: React.FC<CServicesModalProps> = ({
    open,
    onClose,
    onUpdate,
    initialServices
}) => {
    const [services, setServices] = useState<ServiceData[]>(initialServices && initialServices.length > 0 ? initialServices : []);

    if (!open) return null;

    const toggleAccordion = (id: string) => {
        setServices(services.map(s => ({
            ...s,
            isExpanded: s.id === id ? !s.isExpanded : false
        })));
    };

    const handleAddService = () => {
        const newService: ServiceData = {
            id: Date.now().toString(),
            title: "New Service",
            category: "Professionals",
            subCategory: "General",
            description: "",
            experience: "",
            offeringNow: "Yes",
            isExpanded: true
        };
        setServices([...services.map(s => ({ ...s, isExpanded: false })), newService]);
    };

    const handleRemoveService = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setServices(services.filter(s => s.id !== id));
    };

    const updateServiceField = (id: string, field: keyof ServiceData, value: string) => {
        setServices(services.map(s => {
            if (s.id === id) {
                let title = s.title;
                if (field === 'subCategory') title = value + " Services";
                return { ...s, [field]: value, title };
            }
            return s;
        }));
    };

    const handleUpdate = () => {
        onUpdate(services);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Services Provided</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.servicesModalActions}>
                    <p className={styles.modalSubtitle}>
                        Add/Delete services to get listed on deshihelper
                    </p>
                    <div className={styles.addServicesLink} onClick={handleAddService}>
                        <span>+</span> Add Services
                    </div>
                </div>

                <div className={styles.accordionContainer}>
                    {services.map((service) => (
                        <div key={service.id} className={`${styles.accordionItem} ${service.isExpanded ? styles.accordionActive : ""}`}>
                            <div
                                className={styles.accordionHeader}
                                onClick={() => toggleAccordion(service.id)}
                            >
                                <span className={styles.accordionTitle}>{service.title}</span>
                                <div className={styles.accordionHeaderActions}>
                                    <button
                                        className={styles.removeServiceBtn}
                                        onClick={(e) => handleRemoveService(service.id, e)}
                                        title="Remove Service"
                                    >
                                        ×
                                    </button>
                                    <div className={`${styles.accordionChevron} ${service.isExpanded ? styles.rotate180 : ""}`}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {service.isExpanded && (
                                <div className={styles.accordionContent}>
                                    <div className={styles.formRow}>
                                        <div className={styles.formSection}>
                                            <label className={styles.fieldLabel}>Category</label>
                                            <select
                                                className={styles.formSelect}
                                                value={service.category}
                                                onChange={(e) => updateServiceField(service.id, 'category', e.target.value)}
                                            >
                                                <option value="Professionals">Professionals</option>
                                                <option value="Freelancers">Freelancers</option>
                                                <option value="Home Services">Home Services</option>
                                            </select>
                                        </div>
                                        <div className={styles.formSection}>
                                            <label className={styles.fieldLabel}>Sub-Category</label>
                                            <select
                                                className={styles.formSelect}
                                                value={service.subCategory}
                                                onChange={(e) => updateServiceField(service.id, 'subCategory', e.target.value)}
                                            >
                                                <option value="Gas Station Jobs">Gas Station Jobs</option>
                                                <option value="Photography">Photography</option>
                                                <option value="Event Planning">Event Planning</option>
                                                <option value="Retail">Retail</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={styles.formSection}>
                                        <label className={styles.fieldLabel}>Service Description</label>
                                        <textarea
                                            className={styles.textarea}
                                            value={service.description}
                                            onChange={(e) => updateServiceField(service.id, 'description', e.target.value)}
                                            placeholder="Describe the service..."
                                        />
                                        <span className={styles.wordCount}>{service.description.length}/250 words</span>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formSection}>
                                            <label className={styles.fieldLabel}>Experience <span className={styles.labelHint}>(in yrs)</span></label>
                                            <input
                                                type="text"
                                                className={styles.formInput}
                                                value={service.experience}
                                                onChange={(e) => updateServiceField(service.id, 'experience', e.target.value)}
                                            />
                                        </div>
                                        <div className={styles.formSection}>
                                            <label className={styles.fieldLabel}>Offering Now</label>
                                            <div className={styles.radioGroup}>
                                                <label className={styles.radioLabel}>
                                                    <input
                                                        type="radio"
                                                        name={`offering-${service.id}`}
                                                        checked={service.offeringNow === "Yes"}
                                                        onChange={() => updateServiceField(service.id, 'offeringNow', "Yes")}
                                                    />
                                                    <span className={styles.radioCircle}></span>
                                                    Yes
                                                </label>
                                                <label className={styles.radioLabel}>
                                                    <input
                                                        type="radio"
                                                        name={`offering-${service.id}`}
                                                        checked={service.offeringNow === "No"}
                                                        onChange={() => updateServiceField(service.id, 'offeringNow', "No")}
                                                    />
                                                    <span className={styles.radioCircle}></span>
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button className={styles.updateBtn} onClick={handleUpdate}>Update</button>
                </div>
            </div>
        </div>
    );
};

export default CServicesModal;
