import DesiHelpersIcon from "@/components/static/DesiHelpersIcon";
import { CUserAvatar } from "./header_components/CUserAvatar";
import { Routes } from "@/services/routes/Routes";
import Link from "next/link";
import { useAuth } from "@/services/authorization/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import { CMobileCanvas } from "../mobile_canvas/CMobileCanvas";
import React from "react";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
import Roles from "@/constants/ERoles";
import styles from "@/styles/Common.module.css";
import Image from "next/image";

export const CHeader = () => {
  const { mobile, tablet } = useAppMediaQuery();
  const router = useRouter();
  const isHidden = router.pathname === Routes.mapSearch;
  const [show, setShow] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { isActive, isProfileBuild } = useAuth();
  const roleStatus = Cookies.get(cookieParams.role);
  const isAdmin = roleStatus === Roles.Admin;
  const isSubAdmin = roleStatus === Roles.SubAdmin;

  useEffect(() => {
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
    { label: "Find Job", href: Routes.landing },
    { label: "Hire Help", href: Routes.landing },
    { label: "About Us", href: "/about" },
    { label: "Resources", href: "/resources" },
  ];

  return (
    <nav className={styles.navbarMain}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        {!isAdmin && !isSubAdmin ? (
          <Link className={styles.navbarBrand} href="/Landing">
            <DesiHelpersIcon />
          </Link>
        ) : (
          <Link className={styles.navbarBrand} href="">
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
          {/* Language Selector */}
          <div className={styles.langSelector}>
            <button
              className={styles.langButton}
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            >
              Eng
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
            {langDropdownOpen && (
              <div className={styles.langDropdown}>
                <button
                  className={styles.langOption}
                  onClick={() => setLangDropdownOpen(false)}
                >
                  English
                </button>
                <button
                  className={styles.langOption}
                  onClick={() => setLangDropdownOpen(false)}
                >
                  Hindi
                </button>
              </div>
            )}
          </div>

          {/* Notification Button - Only show when active */}
          {isActive && (
            <button className={styles.navIconButton} style={{ marginRight: '8px' }}>
              <Image
                src="/newassets/notification.png"
                alt="Notification"
                width={24}
                height={24}
              />
            </button>
          )}

          {/* User Avatar */}
          <CUserAvatar />
        </div>

        {/* Mobile Menu Trigger */}
        {(mobile || tablet) && (
          <CMobileCanvas
            handleClose={handleClose}
            handleShow={handleShow}
            show={show}
          />
        )}
      </div>
    </nav>
  );
};
