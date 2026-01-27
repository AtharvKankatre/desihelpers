import { FunctionComponent, useState } from "react";
import { BsPersonGear } from "react-icons/bs";
import styles from "@/styles/Common.module.css";
import { useAuth } from "@/services/authorization/AuthContext";
import CookieService from "@/services/authorization/CookieService";
import { Routes } from "@/services/routes/Routes";
import Link from "next/link";
import { userProfileStore } from "@/stores/UserProfileStore";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { seekerStore } from "@/stores/SeekerStore";
import { jobStore } from "@/stores/JobStore";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Roles from "@/constants/ERoles";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
import Image from "next/image";

export const CUserAvatar: FunctionComponent = () => {
  const { isActive, setIsActive } = useAuth();
  const { isSeeker, isProfileBuild } = useAuth();
  const { reset } = userProfileStore();
  const router = useRouter();
  let sStore = seekerStore();
  let jStore = jobStore();
  const roleStatus = Cookies.get(cookieParams.role);
  const isAdmin = roleStatus === Roles.Admin;
  const isSubAdmin = roleStatus === Roles.SubAdmin;
  const logOut = () => {
    reset();
    sStore.reset();
    jStore.reset();
    window.location.href = Routes.login;
    CookieService.clearCookies();
    setIsActive(false);
  };

  const myPostedJobs = () => {
    if (!isProfileBuild) {
      Swal.fire({
        icon: "warning",
        title: "Profile Incomplete",
        text: "Please build your profile first before finding helpers in your area.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Landing");
        }
      });
    } else {
      router.push("/jobs/MyPostedJobs");
    }
  };

  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggleTooltip = () => {
    setShowTooltip(!showTooltip); // Toggle the tooltip visibility on click
  };

  const handleCloseTooltip = () => {
    setShowTooltip(false); // Close the tooltip programmatically
  };

  if (isActive) {
    return (
      <div className="dropdown">
        <button
          className={`btn btn-dropdown ${styles.avatar}`}
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ padding: 0, border: "none", background: "transparent" }}
        >
          <Image
            src="/newassets/account_circle.png"
            alt="Profile"
            width={34}
            height={34}
          />
        </button>

        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="dropdownMenuButton"
        >
          {!isAdmin && !isSubAdmin ? (
            <>
              {" "}
              <li>
                <Link className="dropdown-item" href={Routes.userProfile}>
                  My Profile
                </Link>
              </li>
              <li>
                <button className="dropdown-item" onClick={myPostedJobs}>
                  My Posted Jobs
                </button>
              </li>
            </>
          ) : null}

          <li>
            <button className="dropdown-item" onClick={logOut}>
              Log Out
            </button>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <Link href="/Login" className={`btn ms-2 ${styles.headerButtonCSS}`}>
      Sign In
    </Link>
  );
};
