import React, { memo } from "react";
import styles from "@/styles/ViewAllJobs.module.css";
import { IJobs } from "@/models/Jobs";

interface JobTableRowProps {
    job: IJobs;
    onViewDetails: (id: string) => void;
    formatDate: (date?: Date) => string;
}

const JobTableRow: React.FC<JobTableRowProps> = ({ job, onViewDetails, formatDate }) => {
    return (
        <tr>
            <td>{job.jobType?.name ?? "-"}</td>
            <td>{job.workType ?? "-"}</td>
            <td>{formatDate(job.startDate)}</td>
            <td className={styles.centeredTd}>
                {job.urgent ? (
                    <span className={styles.urgentIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2V4M19.07 4.93L17.66 6.34M4.93 4.93L6.34 6.34" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" />
                            <path d="M7 11C7 8.23858 9.23858 6 12 6C14.7614 6 17 8.23858 17 11V16H7V11Z" fill="#EE0000" />
                            <path d="M12 9C11.4477 9 11 9.44772 11 10V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V10C13 9.44772 12.5523 9 12 9Z" fill="white" fillOpacity="0.5" />
                            <path d="M5 16C5 15.4477 5.44772 15 6 15H18C18.5523 15 19 15.4477 19 16V17C19 17.5523 18.5523 18 18 18H6C5.44772 18 5 17.5523 5 17V16Z" fill="#EE0000" />
                            <path d="M10 18C10 19.1046 10.8954 20 12 20C13.1046 20 14 19.1046 14 18H10Z" fill="#EE0000" />
                        </svg>
                    </span>
                ) : <span className={styles.notUrgent}>—</span>}
            </td>
            <td>{`${job.city ?? "-"}, ${job.state ?? "-"}`}</td>
            <td>{job.distance ? `${job.distance} miles away` : "—"}</td>
            <td>{job.userProfile?.displayName ?? "-"}</td>
            <td>
                <span className={styles.viewDetailsLink} onClick={() => onViewDetails(job._id ?? job.id ?? "")}>View Job Details</span>
            </td>
        </tr>
    );
};

export default memo(JobTableRow);
