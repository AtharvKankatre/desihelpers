import React, { useState, useRef, useEffect } from "react";
import Radar from "radar-sdk-js";
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
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Initialize Radar SDK
    useEffect(() => {
        try {
            Radar.initialize(process.env.NEXT_PUBLIC_RADAR_API_KEY || "");
        } catch (e) {
            // Already initialized
        }
    }, []);

    // Reset form data when modal opens with new initial data
    useEffect(() => {
        if (open) {
            setFormData(initialData);
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [open, initialData]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Debounced Radar autocomplete for address line 1
    const handleAddressInput = (query: string) => {
        setFormData(prev => ({ ...prev, line1: query }));
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!query || query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        timerRef.current = setTimeout(() => {
            Radar.autocomplete({
                query,
                limit: 6,
                layers: ['address'],
            }).then((result: any) => {
                setSuggestions(result.addresses || []);
                setShowSuggestions(true);
            }).catch(() => {
                setSuggestions([]);
            });
        }, 300);
    };

    // Handle selecting an address suggestion — extract ONLY street, auto-fill city/state/zip
    const handleAddressSelect = (address: any) => {
        const streetNumber = address.number || '';
        const street = address.street || '';
        let streetAddress = '';

        if (streetNumber && street) {
            // Best case: we have number + street from Radar
            streetAddress = `${streetNumber} ${street}`;
        } else if (street) {
            streetAddress = street;
        } else {
            // Fallback: strip city, state, zip, country from the formatted address
            let raw = address.addressLabel || address.formattedAddress || '';
            const city = address.city || address.borough || '';
            const state = address.state || address.stateCode || '';
            const zip = address.postalCode || '';
            const country = address.country || address.countryCode || '';
            // Remove city, state, zip, country from the string
            [city, state, zip, country, 'US', 'USA'].forEach(part => {
                if (part) {
                    raw = raw.replace(new RegExp(`[,\\s]*\\b${part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[,\\s]*`, 'gi'), ' ');
                }
            });
            streetAddress = raw.replace(/,\s*$/, '').replace(/^\s*,/, '').trim();
        }

        const city = address.city || address.borough || '';
        const state = address.state || address.stateCode || '';
        const zip = address.postalCode || '';

        setFormData(prev => ({
            ...prev,
            line1: streetAddress,
            city: city || prev.city,
            state: state || prev.state,
            zipCode: zip || prev.zipCode,
        }));

        setShowSuggestions(false);
        setSuggestions([]);
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
                    {/* Address Line 1 — with Radar autocomplete */}
                    <div className={styles.formSection} ref={wrapperRef} style={{ position: 'relative' }}>
                        <label className={styles.fieldLabel}>Address Line 1</label>
                        <input
                            type="text"
                            name="line1"
                            placeholder="Start typing your street address..."
                            className={styles.formInput}
                            value={formData.line1}
                            onChange={(e) => handleAddressInput(e.target.value)}
                            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                            autoComplete="off"
                        />
                        {/* Autocomplete dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
                                background: '#fff', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                border: '1px solid #e0e0e0', maxHeight: '220px', overflowY: 'auto',
                            }}>
                                {suggestions.map((addr: any, idx: number) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleAddressSelect(addr)}
                                        style={{
                                            padding: '10px 14px', cursor: 'pointer', fontSize: '14px',
                                            borderBottom: idx < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#f07c00" stroke="none">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                                        </svg>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{addr.formattedAddress || addr.addressLabel || ''}</div>
                                            <div style={{ fontSize: '12px', color: '#888' }}>
                                                {addr.city || addr.borough || ''}{addr.stateCode ? `, ${addr.stateCode}` : ''} {addr.postalCode || ''}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Address Line 2 */}
                    <div className={styles.formSection}>
                        <label className={styles.fieldLabel}>Address Line 2</label>
                        <input
                            type="text"
                            name="line2"
                            placeholder="Apartment, suite, unit, etc. (optional)"
                            className={styles.formInput}
                            value={formData.line2}
                            onChange={handleChange}
                        />
                    </div>

                    {/* City, State, Zip — auto-filled from address selection */}
                    <div className={styles.formThreeCol}>
                        <div className={styles.formSection}>
                            <label className={styles.fieldLabel}>City</label>
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                className={styles.formInput}
                                value={formData.city}
                                onChange={handleChange}
                                style={{ backgroundColor: formData.city ? '#f8fdf8' : undefined }}
                            />
                        </div>
                        <div className={styles.formSection}>
                            <label className={styles.fieldLabel}>State</label>
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                className={styles.formInput}
                                value={formData.state}
                                onChange={handleChange}
                                style={{ backgroundColor: formData.state ? '#f8fdf8' : undefined }}
                            />
                        </div>
                        <div className={styles.formSection}>
                            <label className={styles.fieldLabel}>Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                placeholder="Zip Code"
                                className={styles.formInput}
                                value={formData.zipCode}
                                onChange={handleChange}
                                style={{ backgroundColor: formData.zipCode ? '#f8fdf8' : undefined }}
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
