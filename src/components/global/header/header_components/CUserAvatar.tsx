import { FunctionComponent, useState, useRef, useEffect } from "react";
import styles from "@/styles/Common.module.css";
import { useAuth } from "@/services/authorization/AuthContext";
import CookieService from "@/services/authorization/CookieService";
import { Routes } from "@/services/routes/Routes";
import Link from "next/link";
import { userProfileStore } from "@/stores/UserProfileStore";
import { seekerStore } from "@/stores/SeekerStore";
import { jobStore } from "@/stores/JobStore";
import { useRouter } from "next/router";
import Image from "next/image";
import { CProfilePopup } from "./CProfilePopup";

export const CUserAvatar: FunctionComponent = () => {
  const { isActive, setIsActive, isProfileBuild } = useAuth();
  const { reset } = userProfileStore();
  const router = useRouter();
  let sStore = seekerStore();
  let jStore = jobStore();

  const [popupOpen, setPopupOpen] = useState(false);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const logOut = () => {
    reset();
    sStore.reset();
    jStore.reset();
    window.location.href = Routes.login;
    CookieService.clearCookies();
    setIsActive(false);
  };

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Dummy user data for display - in real app, fetch from store/context
  const userData = {
    name: "Desi Helper",
    location: "Bellevue, Washington",
    lastLogin: "01/04/2024 05:08:50",
    profileCompletion: 65,
  };

  if (isActive) {
    return (
      <div ref={wrapperRef} style={{ position: "relative" }}>
        <button
          ref={avatarRef}
          className={`${styles.avatar}`}
          type="button"
          onClick={() => setPopupOpen(!popupOpen)}
          style={{ width: '40px', height: '40px' }}
        >
          <Image
            src="/newassets/account_circle.png"
            alt="Profile"
            width={28}
            height={28}
          />
        </button>

        <CProfilePopup
          open={popupOpen}
          user={userData}
          onLogout={logOut}
          onClose={() => setPopupOpen(false)}
          anchorEl={avatarRef.current}
        />
      </div>
    );
  }

  return (
    <Link href="/Login" className={`btn ms-2 ${styles.headerButtonCSS}`}>
      Sign In
    </Link>
  );
};
