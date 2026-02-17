import React from "react";
import { Offcanvas } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/services/authorization/AuthContext";
import styles from "./CMobileCanvas.module.css";
import { FaUser, FaSignOutAlt, FaMapMarkerAlt, FaSearch, FaHandsHelping, FaInfoCircle, FaBookOpen, FaTimes } from "react-icons/fa";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
import { Routes } from "@/services/routes/Routes";
import Image from "next/image";

interface CMobileCanvasProps {
    show: boolean;
    handleClose: () => void;
    handleShow: () => void;
}

export const CMobileCanvas: React.FC<CMobileCanvasProps> = ({ show, handleClose, handleShow }) => {
    const router = useRouter();
    const {
        setIsActive,
        setIsSeeker,
        setIsProfileBuild
    } = useAuth();

    // Fallback for user data
    const displayName = "Desi Helper";
    const location = "Bellevue, Washington";
    const lastLogin = "Last Login: Today";

    const handleLogout = () => {
        // Clear Cookies
        Cookies.remove(cookieParams.accessToken);
        Cookies.remove(cookieParams.refreshToken);
        Cookies.remove(cookieParams.role);
        Cookies.remove(cookieParams.isActive);
        Cookies.remove(cookieParams.isSeeker);
        Cookies.remove(cookieParams.isProfileBuild);
        Cookies.remove(cookieParams.email);

        // Update Context
        setIsActive(false);
        setIsSeeker(false);
        setIsProfileBuild(false);

        router.push(Routes.login);
        handleClose();
    };

    const navigateToProfile = () => {
        router.push(Routes.userProfile);
        handleClose();
    };

    const menuItems = [
        { label: "Find Job", icon: <FaSearch />, path: Routes.viewAllJobs },
        { label: "Hire Help", icon: <FaHandsHelping />, path: Routes.landing },
        { label: "About Us", icon: <FaInfoCircle />, path: "/about" },
        { label: "Resources", icon: <FaBookOpen />, path: "/resources" },
        { label: "My Profile", icon: <FaUser />, path: Routes.userProfile },
    ];

    // Footer Data
    const services = [
        { name: "Home & Baby care", href: Routes.landing },
        { name: "Baking", href: Routes.landing },
        { name: "Catering", href: Routes.landing },
        { name: "Event Help", href: Routes.landing },
        { name: "Tutoring", href: Routes.landing },
        { name: "Professionals", href: Routes.landing },
    ];

    const pages = [
        { name: "About Us", href: Routes.aboutUs || "/about" },
        { name: "Resources", href: Routes.resources || "/resources" },
    ];

    const otherLinks = [
        { name: "Privacy Policy", href: Routes.privacyPolicy },
        { name: "Contact Us", href: Routes.contactUs },
    ];

    const socialLinks = [
        { name: "Facebook", href: "https://facebook.com/people/Desi-Helpers/61571408365670/", icon: "/assets/icons/icon_facebook_logo.svg" },
        { name: "Instagram", href: "https://www.instagram.com/desihelpers/profilecard/?igsh=bzc4OHl3ZmJuaWJl", icon: "/assets/icons/icon_instagram.svg" },
        { name: "Twitter", href: "https://x.com/@desihelpers", icon: "/assets/icons/icon_twitter.svg" },
        { name: "LinkedIn", href: "https://linkedin.com/company/desihelpers", icon: "/assets/icons/icon_linkedin.svg" },
        { name: "YouTube", href: "https://youtube.com/@desihelpers", icon: "/assets/icons/icon_youtube.svg" },
    ];

    return (
        <>
            <button
                onClick={handleShow}
                style={{
                    background: "transparent",
                    border: "none",
                    color: "white",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 8px 8px 0px",
                    marginLeft: "-10px"
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 18H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <Offcanvas show={show} onHide={handleClose} placement="start" className={styles.offcanvasContainer}>
                <Offcanvas.Header className={styles.offcanvasHeader}>
                    <div className={styles.userInfo}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <div className={styles.locationInfo}>
                                <FaMapMarkerAlt />
                                <span>{location}</span>
                            </div>
                            <FaTimes className={styles.closeIcon} onClick={handleClose} />
                        </div>
                        <div className={styles.lastLogin}>{lastLogin}</div>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ padding: 0, display: "flex", flexDirection: "column" }}>
                    <div className={styles.menuContainer}>
                        {menuItems.map((item, index) => (
                            <Link key={index} href={item.path} className={styles.menuItem} onClick={handleClose}>
                                <div className={styles.iconBox}>
                                    {item.icon}
                                </div>
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        <div className={styles.separator}></div>

                        <button className={styles.menuItem} onClick={handleLogout} style={{ background: "none", border: "none", width: "100%", justifyContent: "flex-start" }}>
                            <div className={`${styles.iconBox} ${styles.logoutIconBox}`}>
                                <FaSignOutAlt />
                            </div>
                            <span className={styles.logoutBtn}>Logout</span>
                        </button>
                    </div>

                    <div className={styles.drawerFooter}>
                        <div className={styles.footerBrand}>
                            <img
                                src="/DesiHelpers_without-tag-line.svg"
                                alt="DesiHelpers"
                                style={{ maxHeight: "40px", width: "auto", marginBottom: "1rem" }}
                            />
                            <div className={styles.socialIconsRow}>
                                {socialLinks.map((social, index) => (
                                    <Link key={index} href={social.href} target="_blank" rel="noopener noreferrer">
                                        <Image src={social.icon} alt={social.name} width={20} height={20} className={styles.footerSocialIcon} />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className={styles.footerLinksGrid}>
                            <div className={styles.footerCol}>
                                <h4 className={styles.footerColTitle}>SERVICES</h4>
                                <ul className={styles.footerColList}>
                                    {services.map((service, index) => (
                                        <li key={index}><Link href={service.href}>{service.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.footerCol}>
                                <h4 className={styles.footerColTitle}>PAGES</h4>
                                <ul className={styles.footerColList}>
                                    {pages.map((p, index) => (
                                        <li key={index}><Link href={p.href}>{p.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.footerCol}>
                                <h4 className={styles.footerColTitle}>QUICK LINKS</h4>
                                <ul className={styles.footerColList}>
                                    {otherLinks.map((l, index) => (
                                        <li key={index}><Link href={l.href}>{l.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className={styles.drawerCopyright}>
                            © 2025 Desi Helpers. All rights reserved.
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};
