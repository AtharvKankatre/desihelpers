import React from "react";
import { Offcanvas } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/services/authorization/AuthContext";
import styles from "./CMobileCanvas.module.css";
import { FaPen, FaUser, FaShareAlt, FaSignOutAlt, FaMapMarkerAlt, FaAt } from "react-icons/fa";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
import { Routes } from "@/services/routes/Routes";

interface CMobileCanvasProps {
    show: boolean;
    handleClose: () => void;
    handleShow: () => void;
}

export const CMobileCanvas: React.FC<CMobileCanvasProps> = ({ show, handleClose }) => {
    const router = useRouter();
    const { email } = useAuth(); // Only get available props

    // Fallback for user data since it's not in context
    const displayName = "Desi Helper"; // User name not in context/cookies easily available without API call
    // We could try to get it from cookies if it exists, or just use default.
    // Previous code implied it might be there.

    // Location not in context, using default or placeholder
    const location = "Bellevue, Washington";
    const lastLogin = "Last Login: Today";

    const handleLogout = () => {
        // Basic logout logic matching typical patterns
        Cookies.remove(cookieParams.accessToken);
        Cookies.remove(cookieParams.refreshToken);
        Cookies.remove(cookieParams.role);
        Cookies.remove(cookieParams.isActive);
        Cookies.remove(cookieParams.isSeeker);
        Cookies.remove(cookieParams.isProfileBuild);
        Cookies.remove(cookieParams.email);

        router.push(Routes.login);
        handleClose();
    };

    const navigateToProfile = () => {
        router.push(Routes.userProfile);
        handleClose();
    };

    return (
        <Offcanvas show={show} onHide={handleClose} placement="start" className={styles.offcanvasContainer}>
            <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
                <div className={styles.userInfo}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <h5 className={styles.userName}>{displayName}</h5>
                        <FaPen className={styles.editIcon} onClick={navigateToProfile} />
                    </div>
                    <div className={styles.locationInfo}>
                        <FaMapMarkerAlt />
                        <span>{location}</span>
                    </div>
                    <div className={styles.lastLogin}>{lastLogin}</div>
                </div>
            </Offcanvas.Header>
            <Offcanvas.Body style={{ padding: 0 }}>
                <div className={styles.menuContainer}>

                    <Link href={Routes.userProfile} className={styles.menuItem} onClick={handleClose}>
                        <div className={styles.iconBox}>
                            <FaUser />
                        </div>
                        <span>My Profile</span>
                    </Link>

                    <div className={styles.completionCard}>
                        <span className={styles.cardTitle}>Complete Your Profile</span>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: "65%" }}></div>
                        </div>
                        <div className={styles.cardDesc}>
                            Complete your profile to get more visibility and better matches.
                        </div>
                    </div>

                    <div className={styles.dropdownSection}>
                        <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#333", marginBottom: "5px" }}>
                            List Your Profile As
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div className={styles.iconBox}>
                                <FaAt />
                            </div>
                            <select className={styles.profileDropdown} defaultValue="both">
                                <option value="both">Both</option>
                                <option value="seeker">Job Seeker</option>
                                <option value="provider">Service Provider</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.separator}></div>

                    <button className={styles.menuItem} style={{ background: "none", border: "none", width: "100%", justifyContent: "flex-start" }}>
                        <div className={styles.iconBox}>
                            <FaShareAlt />
                        </div>
                        <span>Share Your Profile</span>
                    </button>

                    <button className={styles.menuItem} onClick={handleLogout} style={{ background: "none", border: "none", width: "100%", justifyContent: "flex-start" }}>
                        <div className={`${styles.iconBox} ${styles.logoutIconBox}`}>
                            <FaSignOutAlt />
                        </div>
                        <span className={styles.logoutBtn}>Logout</span>
                    </button>

                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};
