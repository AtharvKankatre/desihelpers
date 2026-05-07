import DesiHelpersIcon from "@/components/static/DesiHelpersIcon";
import { FaBell } from "react-icons/fa";
import { CUserAvatar } from "./header_components/CUserAvatar";
import { Routes } from "@/services/routes/Routes";
import Link from "next/link";
import { useAuth } from "@/services/authorization/AuthContext";
import React, { FunctionComponent, useState, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import { Zoom } from "@mui/material";
import { useRouter } from "next/router";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import useTranslation from "next-translate/useTranslation";

const CMobileCanvas = dynamic(() => import("@/components/global/mobile_canvas/CMobileCanvas").then(mod => mod.CMobileCanvas));
const CNotificationPopup = dynamic(() => import("./header_components/CNotificationPopup").then(mod => mod.CNotificationPopup));
const CFeedbackModal = dynamic(() => import("./header_components/CFeedbackModal").then(mod => mod.CFeedbackModal));
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
import Roles from "@/constants/ERoles";
import styles from "@/styles/Common.module.css";
import Image from "next/image";
import { useNotification } from "@/context/NotificationContext";
import { FaEnvelope, FaHome } from "react-icons/fa";
import { useChatStore } from "@/stores/ChatStore";// ... imports
// ... imports

const _CHeader = () => {
  const { mobile, tablet } = useAppMediaQuery();
  const router = useRouter();
  const { t } = useTranslation('common');
  const isHidden = router.pathname === Routes.mapSearch;
  const [show, setShow] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const switchLocale = (locale: 'en' | 'hi') => {
    router.push(router.asPath, router.asPath, { locale });
    setLangDropdownOpen(false);
  };

  const currentLang = router.locale === 'hi' ? t('lang_short_hi') : t('lang_short_en');

  // New State for Notifications and Feedback
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { unreadCount } = useNotification();
  const chatUnreadCount = useChatStore((state) => state.unreadTotal);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { isActive, isProfileBuild } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);

  useEffect(() => {
    const roleStatus = Cookies.get(cookieParams.role);
    setIsAdmin(roleStatus === Roles.Admin);
    setIsSubAdmin(roleStatus === Roles.SubAdmin);
  }, []);

  useEffect(() => {
    // ... existing useEffect code
    const navbar = document.getElementById("navbarSupportedContent");
    const syncTransition = () => {
      const navbarHeight = navbar?.scrollHeight ?? 0;
      document.body.style.transition = "padding-top 0.3s ease-in-out";
      document.body.style.paddingTop = `${navbarHeight}px`;
      navbar?.style.setProperty("height", `${navbarHeight}px`, "important");
      navbar?.style.setProperty("transition", "height 0.3s ease-in-out");
    };
    const resetTransition = () => {
      document.body.style.transition = "padding-top 0.3s ease-in-out";
      document.body.style.paddingTop = "0";
      navbar?.style.removeProperty("height");
    };

    navbar?.addEventListener("shown.bs.collapse", syncTransition);
    navbar?.addEventListener("hidden.bs.collapse", resetTransition);

    return () => {
      navbar?.removeEventListener("shown.bs.collapse", syncTransition);
      navbar?.removeEventListener("hidden.bs.collapse", resetTransition);
    };
  }, []);

  const navLinks = [
    { label: t('nav.find_job'), href: Routes.viewAllJobs },
    { label: t('nav.hire_help'), href: Routes.viewAllSeekers },
    { label: t('nav.about_us'), href: "/about" },
    { label: t('nav.resources'), href: "/resources" },
  ];

  return (
    <nav className={styles.navbarMain}>
      <div className={styles.navbarContainer}>
        {/* Mobile Menu Trigger - Left Side */}
        {(mobile || tablet) && (
          <CMobileCanvas
            handleClose={handleClose}
            handleShow={handleShow}
            show={show}
          />
        )}

        {/* Logo - Centered on Mobile */}
        {!isAdmin && !isSubAdmin ? (
          <Link className={`${styles.navbarBrand} ${(mobile || tablet) ? styles.navbarBrandMobile : ''} `} href="/Landing">
            <DesiHelpersIcon />
          </Link>
        ) : (
          <Link className={`${styles.navbarBrand} ${(mobile || tablet) ? styles.navbarBrandMobile : ''} `} href="">
            <DesiHelpersIcon />
          </Link>
        )}

        {/* Desktop Navigation */}
        {!mobile && !tablet && (
          <div className={styles.navbarLinks}>
            {!isHidden && !isAdmin && !isSubAdmin && (
              <>
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className={styles.navLink}
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </div>
        )}

        {/* Right Side Actions */}
        <div className={styles.navbarActions}>
          {/* Language Selector - Desktop only */}
          {!mobile && !tablet && (
            <div className={styles.langSelector}>
              <button
                className={styles.langButton}
                onClick={() => {
                  setNotificationOpen(false);
                  setLangDropdownOpen(!langDropdownOpen);
                }}
              >
                {currentLang}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginLeft: "4px" }}
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <Zoom in={langDropdownOpen} style={{ transformOrigin: 'top right' }}>
                <div className={`${styles.langDropdown} language-dropdown`}>
                  <button
                    className={`${styles.langOption} ${router.locale === 'en' ? styles.langOptionActive : ''}`}
                    onClick={() => switchLocale('en')}
                  >
                    {t('lang_english')}
                  </button>
                  <button
                    className={`${styles.langOption} ${router.locale === 'hi' ? styles.langOptionActive : ''}`}
                    onClick={() => switchLocale('hi')}
                  >
                    {t('lang_hindi')}
                  </button>
                </div>
              </Zoom>
            </div>
          )}

          {/* Home Button */}
          {(mobile || tablet || isActive) && (
            <div style={{ position: "relative", marginRight: mobile ? "0px" : "10px" }}>
              <button
                className={styles.navIconButton}
                onClick={() => router.push(Routes.landing)}
                style={{ position: 'relative' }}
              >
                <FaHome size={mobile ? 20 : 22} style={{ color: "white" }} />
              </button>
            </div>
          )}

          {/* Chat / Messages Button */}
          {(mobile || tablet || isActive) && (
            <div style={{ position: "relative", marginRight: mobile ? "0px" : "10px" }}>
              <button
                className={styles.navIconButton}
                onClick={() => router.push(Routes.messages)}
                style={{ position: 'relative' }}
              >
                <FaEnvelope size={mobile ? 14 : 20} style={{ color: "white" }} />
                {chatUnreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ff0000',
                    borderRadius: '50%',
                    border: '1.5px solid #001838'
                  }}></span>
                )}
              </button>
            </div>
          )}

          {/* Notification Button */}
          {(mobile || tablet || isActive) && (
            <div style={{ position: "relative" }}>
              <button
                className={styles.navIconButton}
                onClick={() => setNotificationOpen(!notificationOpen)}
                style={{ position: 'relative' }}
              >
                <FaBell size={mobile ? 14 : 20} style={{ color: "white" }} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ff0000',
                    borderRadius: '50%',
                    border: '1.5px solid #001838'
                  }}></span>
                )}
              </button>
              <CNotificationPopup
                open={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                onFeedbackClick={() => setFeedbackOpen(true)}
              />
            </div>
          )}

          {/* Profile Avatar */}
          <CUserAvatar size={mobile ? 22 : 30} />
        </div>
      </div>

      {/* Feedback Modal globally placed or typically at root, but here is fine if styled fixed */}
      <CFeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </nav>
  );
}; export const CHeader = memo(_CHeader);
export default CHeader;
