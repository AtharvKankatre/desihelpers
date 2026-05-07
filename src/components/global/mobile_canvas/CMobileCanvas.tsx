import React, { useState } from "react";
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
import useTranslation from "next-translate/useTranslation";

interface CMobileCanvasProps {
    show: boolean;
    handleClose: () => void;
    handleShow: () => void;
}

export const CMobileCanvas: React.FC<CMobileCanvasProps> = ({ show, handleClose, handleShow }) => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const {
        setIsActive,
        setIsSeeker,
        setIsProfileBuild
    } = useAuth();

    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    const switchLocale = (locale: 'en' | 'hi') => {
        router.push(router.asPath, router.asPath, { locale });
        setLangDropdownOpen(false);
    };
    const currentLang = router.locale === 'hi' ? t('lang_short_hi') : t('lang_short_en');

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
        { label: t('nav.find_job'), icon: <FaSearch />, path: Routes.viewAllJobs },
        { label: t('nav.hire_help'), icon: <FaHandsHelping />, path: Routes.viewAllSeekers },
        { label: t('nav.about_us'), icon: <FaInfoCircle />, path: "/about" },
        { label: t('nav.resources'), icon: <FaBookOpen />, path: "/resources" },
        { label: t('canvas.my_profile'), icon: <FaUser />, path: Routes.userProfile },
    ];

    // Footer Data
    const services = [
        { name: t('footer.home_baby'), href: Routes.landing },
        { name: t('footer.baking'), href: Routes.landing },
        { name: t('footer.catering'), href: Routes.landing },
        { name: t('footer.event_help'), href: Routes.landing },
        { name: t('footer.tutoring'), href: Routes.landing },
        { name: t('footer.professionals'), href: Routes.landing },
    ];

    const pages = [
        { name: t('footer.about_us'), href: Routes.aboutUs || "/about" },
        { name: t('footer.resources'), href: Routes.resources || "/resources" },
    ];

    const otherLinks = [
        { name: t('footer.privacy_policy'), href: Routes.privacyPolicy },
        { name: t('footer.contact_us'), href: Routes.contactUs },
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
                onClick={show ? handleClose : handleShow}
                style={{
                    background: "transparent",
                    border: "none",
                    color: "white",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 4px 8px 0px",
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
                            <div className={styles.headerRightActions}>
                                <div className={styles.langSelector}>
                                    <button
                                        className={styles.langButton}
                                        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                    >
                                        {currentLang}
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    {langDropdownOpen && (
                                        <div className={styles.langDropdown}>
                                            <button className={`${styles.langOption} ${router.locale === 'en' ? styles.langOptionActive : ''}`} onClick={() => switchLocale('en')}>{t('lang_english')}</button>
                                            <button className={`${styles.langOption} ${router.locale === 'hi' ? styles.langOptionActive : ''}`} onClick={() => switchLocale('hi')}>{t('lang_hindi')}</button>
                                        </div>
                                    )}
                                </div>
                                <FaTimes className={styles.closeIcon} onClick={handleClose} />
                            </div>
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
                            <span className={styles.logoutBtn}>{t('canvas.logout')}</span>
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
                                <h4 className={styles.footerColTitle}>{t('footer.services')}</h4>
                                <ul className={styles.footerColList}>
                                    {services.map((service, index) => (
                                        <li key={index}><Link href={service.href}>{service.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.footerCol}>
                                <h4 className={styles.footerColTitle}>{t('footer.pages')}</h4>
                                <ul className={styles.footerColList}>
                                    {pages.map((p, index) => (
                                        <li key={index}><Link href={p.href}>{p.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.footerCol}>
                                <h4 className={styles.footerColTitle}>{t('footer.quick_links')}</h4>
                                <ul className={styles.footerColList}>
                                    {otherLinks.map((l, index) => (
                                        <li key={index}><Link href={l.href}>{l.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className={styles.drawerCopyright}>
                            {t('footer.copyright')}
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};
