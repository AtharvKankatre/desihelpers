import React, { memo } from "react";
import styles from "@/styles/ViewAllJobs.module.css";
import { IJobs } from "@/models/Jobs";

interface JobCardProps {
    job: IJobs;
    onViewDetails: (id: string) => void;
    formatDate: (date?: Date) => string;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails, formatDate }) => {
    return (
        <div className={styles.jobCard}>
            <div className={styles.cardTopRow}>
                <span className={styles.cardPostedBy}>Posted 2 days ago by <strong>{job.userProfile?.displayName ?? "Srilatha Nair"}</strong></span>
                <span className={styles.cardPrice}>$15-$25 <span className={styles.cardPriceUnit}>/hr</span></span>
            </div>
            <div className={styles.cardTitleRow}>
                <h3 className={styles.cardJobTitle}>
                    {job.jobType?.name ?? "Nanny"}
                    {job.urgent && (
                        <span className={styles.cardUrgentStar}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2V4M19.07 4.93L17.66 6.34M4.93 4.93L6.34 6.34" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" />
                                <path d="M7 11C7 8.23858 9.23858 6 12 6C14.7614 6 17 8.23858 17 11V16H7V11Z" fill="#EE0000" />
                                <path d="M5 16C5 15.4477 5.44772 15 6 15H18C18.5523 15 19 15.4477 19 16V17C19 17.5523 18.5523 18 18 18H6C5.44772 18 5 17.5523 5 17V16Z" fill="#EE0000" />
                            </svg>
                        </span>
                    )}
                </h3>
                <div className={styles.cardTitleActions}>
                    {job.urgent && <span className={styles.cardOnlineBadge}>ONLINE</span>}
                    <button className={styles.cardShareBtn} title="Share">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className={styles.cardDetails}>
                <div className={styles.cardDetailItem}>
                    <span className={styles.cardIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </span>
                    <span>Start Date: <strong>{formatDate(job.startDate)}</strong></span>
                </div>
                <div className={styles.cardDetailItem}>
                    <span className={styles.cardIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                    </span>
                    <span>Work Type: <strong>{job.workType ?? "Full Time"}</strong></span>
                </div>
                <div className={styles.cardDetailItem}>
                    <span className={styles.cardIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                    </span>
                    <span>{job.distance ? `${job.distance} miles away` : "—"}, {job.city ?? "Bothell"}, {job.state ?? "Washington"}</span>
                </div>
            </div>
            <div className={styles.cardTags}>
                <span className={styles.cardIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="M22 22l-5-10-5 10" /><path d="M14 18h6" /></svg></span>
                <span className={styles.cardTag}>English</span><span className={styles.cardTag}>Hindi</span><span className={styles.cardTagMore}>+2</span>
            </div>
            <div className={styles.cardFooter}>
                <div className={styles.cardViewDetails} onClick={() => onViewDetails(job._id ?? job.id ?? "")}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
                    View Job Details
                </div>
            </div>
        </div>
    );
};

export default memo(JobCard);
