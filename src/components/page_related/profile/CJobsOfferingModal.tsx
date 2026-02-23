import React, { useState } from "react";
import styles from "@/styles/Profile.module.css";

interface JobData {
    id: string;
    title: string;
    jobRequirements: string;
    location: string;
    startDate: string;
    workType: string;
    reqExperience: string;
    payRange: string;
    dietaryPreference: string;
    daysPerWeek: string;
    isExpanded: boolean;
}

interface CJobsOfferingModalProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (jobs: JobData[]) => void;
    initialJobs: JobData[];
}

const CalendarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const CJobsOfferingModal: React.FC<CJobsOfferingModalProps> = ({
    open,
    onClose,
    onUpdate,
    initialJobs
}) => {
    const [jobs, setJobs] = useState<JobData[]>(
        initialJobs && initialJobs.length > 0 ? initialJobs : []
    );

    if (!open) return null;

    const toggleAccordion = (id: string) => {
        setJobs(jobs.map(j => ({
            ...j,
            isExpanded: j.id === id ? !j.isExpanded : false
        })));
    };

    const handleAddJob = () => {
        const newJob: JobData = {
            id: Date.now().toString(),
            title: "Looking for Nanny Services",
            jobRequirements: "",
            location: "Bayonne, New Jersey",
            startDate: "2025-02-24T18:30",
            workType: "Part Time",
            reqExperience: "5",
            payRange: "$15-$25",
            dietaryPreference: "Veg",
            daysPerWeek: "5",
            isExpanded: true
        };
        setJobs([...jobs.map(j => ({ ...j, isExpanded: false })), newJob]);
    };

    const handleRemoveJob = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setJobs(jobs.filter(j => j.id !== id));
    };

    const updateJobField = (id: string, field: keyof JobData, value: string) => {
        setJobs(jobs.map(j => {
            if (j.id === id) {
                return { ...j, [field]: value };
            }
            return j;
        }));
    };

    const handleUpdate = () => {
        onUpdate(jobs);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                {/* Header row: Title + Close */}
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Jobs You Are Offering</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                {/* Subtitle row: description + Add Jobs link */}
                <div className={styles.servicesModalActions}>
                    <p className={styles.modalSubtitle} style={{ margin: 0 }}>
                        Add/Delete Job Opportunities to get listed on deshihelper
                    </p>
                    <div className={styles.addServicesLink} onClick={handleAddJob}>
                        <span style={{ fontSize: '18px', fontWeight: '400' }}>+</span> Add Jobs
                    </div>
                </div>

                {/* Accordion list of jobs */}
                <div className={styles.accordionContainer}>
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className={`${styles.accordionItem} ${job.isExpanded ? styles.accordionActive : ""}`}
                        >
                            {/* Accordion Header */}
                            <div
                                className={styles.accordionHeader}
                                onClick={() => toggleAccordion(job.id)}
                            >
                                <span className={styles.accordionTitle}>{job.title}</span>
                                <div className={styles.accordionHeaderActions}>
                                    {jobs.length > 1 && (
                                        <button
                                            className={styles.removeServiceBtn}
                                            onClick={(e) => handleRemoveJob(job.id, e)}
                                            title="Remove Job"
                                        >
                                            ×
                                        </button>
                                    )}
                                    <div className={`${styles.accordionChevron} ${job.isExpanded ? styles.rotate180 : ""}`}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Accordion Content — Form Fields */}
                            {job.isExpanded && (
                                <div className={styles.accordionContent}>
                                    {/* Job Requirements */}
                                    <div className={styles.formSection} style={{ padding: 0 }}>
                                        <label className={styles.fieldLabel}>Job Requirements</label>
                                        <div className={styles.textareaContainer}>
                                            <textarea
                                                className={styles.textarea}
                                                value={job.jobRequirements}
                                                onChange={(e) => updateJobField(job.id, 'jobRequirements', e.target.value)}
                                                placeholder="Needs of the job (e.g. Nanny for 6 month old)"
                                                maxLength={1250}
                                                style={{ minHeight: '100px', padding: '15px' }}
                                            />
                                            <span className={styles.wordCount}>
                                                {job.jobRequirements.length}/250 words
                                            </span>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className={styles.formSection} style={{ padding: 0, marginTop: '15px' }}>
                                        <label className={styles.fieldLabel}>Location</label>
                                        <select
                                            className={styles.formSelect}
                                            value={job.location}
                                            onChange={(e) => updateJobField(job.id, 'location', e.target.value)}
                                        >
                                            <option value="">Select Location</option>
                                            <option value="Bayonne, New Jersey">Bayonne, New Jersey</option>
                                            <option value="Bothell, Washington">Bothell, Washington</option>
                                            <option value="Seattle, Washington">Seattle, Washington</option>
                                            <option value="Dallas, Texas">Dallas, Texas</option>
                                            <option value="Boston, Massachusetts">Boston, Massachusetts</option>
                                        </select>
                                    </div>

                                    {/* Triple column rows */}
                                    <div className={styles.formRow3} style={{ marginTop: '15px' }}>
                                        <div className={styles.formSection} style={{ padding: 0 }}>
                                            <label className={styles.fieldLabel}>Start Date</label>
                                            <div className={styles.inputWithIcon}>
                                                <input
                                                    type="datetime-local"
                                                    className={styles.formInput}
                                                    value={job.startDate}
                                                    onChange={(e) => updateJobField(job.id, 'startDate', e.target.value)}
                                                />
                                                <div className={styles.fieldIcon}><CalendarIcon /></div>
                                            </div>
                                        </div>
                                        <div className={styles.formSection} style={{ padding: 0 }}>
                                            <label className={styles.fieldLabel}>Work Type</label>
                                            <select
                                                className={styles.formSelect}
                                                value={job.workType}
                                                onChange={(e) => updateJobField(job.id, 'workType', e.target.value)}
                                            >
                                                <option value="Part Time">Part Time</option>
                                                <option value="Full Time">Full Time</option>
                                                <option value="Contract">Contract</option>
                                            </select>
                                        </div>
                                        <div className={styles.formSection} style={{ padding: 0 }}>
                                            <label className={styles.fieldLabel}>
                                                Req Exp <span className={styles.labelHint}>(in yrs)</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={styles.formInput}
                                                value={job.reqExperience}
                                                onChange={(e) => updateJobField(job.id, 'reqExperience', e.target.value)}
                                                placeholder="Required Experience"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formRow3}>
                                        <div className={styles.formSection} style={{ padding: 0 }}>
                                            <label className={styles.fieldLabel}>Pay Range</label>
                                            <select
                                                className={styles.formSelect}
                                                value={job.payRange}
                                                onChange={(e) => updateJobField(job.id, 'payRange', e.target.value)}
                                            >
                                                <option value="$15-$25">$15-$25</option>
                                                <option value="$25-$40">$25-$40</option>
                                                <option value="$40-$60">$40-$60</option>
                                                <option value="$60+">$60+</option>
                                            </select>
                                        </div>
                                        <div className={styles.formSection} style={{ padding: 0 }}>
                                            <label className={styles.fieldLabel}>Dietary Preference</label>
                                            <select
                                                className={styles.formSelect}
                                                value={job.dietaryPreference}
                                                onChange={(e) => updateJobField(job.id, 'dietaryPreference', e.target.value)}
                                            >
                                                <option value="Veg">Veg</option>
                                                <option value="Non-Veg">Non-Veg</option>
                                                <option value="Veg/Non-Veg">Veg/Non-Veg</option>
                                            </select>
                                        </div>
                                        <div className={styles.formSection} style={{ padding: 0 }}>
                                            <label className={styles.fieldLabel}>Days per week</label>
                                            <select
                                                className={styles.formSelect}
                                                value={job.daysPerWeek}
                                                onChange={(e) => updateJobField(job.id, 'daysPerWeek', e.target.value)}
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer: Cancel + Update */}
                <div className={styles.modalActions}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button className={styles.updateBtn} onClick={handleUpdate}>Update</button>
                </div>
            </div>
        </div>
    );
};

export default CJobsOfferingModal;

