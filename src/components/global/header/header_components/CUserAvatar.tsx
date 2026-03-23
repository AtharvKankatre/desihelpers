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
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";

interface CUserAvatarProps {
  className?: string;
  style?: React.CSSProperties;
  onToggle?: (isOpen: boolean) => void;
}

export const CUserAvatar: FunctionComponent<CUserAvatarProps> = ({ className, style, onToggle }) => {
  const { isActive, setIsActive, isProfileBuild } = useAuth();
  const { userProfile, reset } = userProfileStore();
  const router = useRouter();
  let sStore = seekerStore();
  let jStore = jobStore();

  const [popupOpen, setPopupOpen] = useState(false);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [userData, setUserData] = useState({
    name: "",
    location: "",
    lastLogin: new Date().toLocaleString(),
    profileCompletion: 0,
    profilePhoto: "/newassets/account_circle.png",
    listProfileAs: "Both"
  });

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
        if (onToggle) onToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, onToggle]);

  // Sync local data whenever the global userProfile store changes
  useEffect(() => {
    if (userProfile && Object.keys(userProfile).length > 0) {
      const p = userProfile;
      const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim() || "User";
      const location = `${p.city || ""}, ${p.state || ""}`.replace(/^, |, $/g, "") || "";

      // Calculate completion based on key profile fields
      const fields = [
        p.firstName,
        p.lastName,
        p.email,
        p.mobile || p.phone,
        p.addressLine1,
        p.city,
        p.state,
        p.zipCode,
        p.languagesSpoken && p.languagesSpoken.length > 0 ? "filled" : "",
        p.aboutMe,
        p.gender,
        p.displayName,
      ];
      const filled = fields.filter(
        (f) => f !== undefined && f !== null && f !== ""
      ).length;
      const percent = Math.round((filled / fields.length) * 100);

      // If we have a profile photo, we might need to sign it if it's new
      const updatePhoto = async () => {
        let signedPhoto = "/newassets/account_circle.png";
        if (p.profilePhoto && p.profilePhoto !== "/newassets/account_circle.png") {
          try {
            const { getWorkPhotoUrls } = await import("@/utils/s3Helper");
            const signedUrls = await getWorkPhotoUrls("", [p.profilePhoto]);
            signedPhoto = (signedUrls && signedUrls.length > 0) ? signedUrls[0] : p.profilePhoto;
          } catch (s3Error) {
            signedPhoto = p.profilePhoto;
          }
        }
        
        setUserData({
          name: fullName,
          location: location,
          lastLogin: userData.lastLogin,
          profileCompletion: percent,
          profilePhoto: signedPhoto,
          listProfileAs: p.listProfileAs || "Both"
        });
      };
      
      updatePhoto();
    }
  }, [userProfile]);

  // Initial fetch on mount to ensure store is populated
  useEffect(() => {
    if (!isActive) return;
    const fetchProfile = async () => {
      try {
        const result = await ApiService.crud(APIDetails.getUserProfile);
        if (result[0] && result[1]) {
          const { setUserProfile } = userProfileStore.getState();
          setUserProfile(result[1]);
        }
      } catch (err) {
        console.error("Error fetching profile for avatar initialization:", err);
      }
    };
    fetchProfile();
  }, [isActive]);

  if (isActive) {
    return (
      <div ref={wrapperRef} style={{ position: "relative" }}>
        <button
          ref={avatarRef}
          className={className || `${styles.avatar}`}
          type="button"
          onClick={() => {
            const newState = !popupOpen;
            setPopupOpen(newState);
            if (onToggle) onToggle(newState);
          }}
        >
          <Image
            src={typeof userData.profilePhoto === 'string' && userData.profilePhoto.trim().length > 1 ? userData.profilePhoto : "/newassets/account_circle.png"}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-circle"
            style={{ objectFit: 'cover' }}
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
