import { CLabel } from "@/components/reusable/labels/CLabel";
import { FaCircle } from "react-icons/fa6";
import styles from "@/styles/Landing.module.css";
import style from "@/styles/Common.module.css";
import CButton from "@/components/reusable/CButton";
import { Routes } from "@/services/routes/Routes";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { useAuth } from "@/services/authorization/AuthContext";
import Link from "next/link";

export const WelcomeBanner = () => {
  const router = useRouter();
  const { isProfileBuild, isActive } = useAuth();

  const handleClick = () => {
    if (!isActive) {
      Swal.fire({
        title: "Alert",
        text: "Please login to find helpers in your area",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Login");
        }
      });
    } else if (!isProfileBuild) {
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
      router.push(Routes.mapSearch);
    }
  };

  return (
    <div
      id="welcomeBanner"
      className={`row col-md-10 mb-2 col-sm-12 ${styles.welcomeBanner} ${styles.welcomeBannerMsg}`}
    >
      <div className="mx-auto">
        <CLabel className="h1 fw-bold fs-1" label="welcome_banner" />
        <div
          className={`d-flex flex-row align-items-baseline text-center mt-3 ${styles.welcomeBanner}`}
        >
          <CLabel className="pe-2 h5" label="Connect" />
          <FaCircle color="#FFA500" size={12} />
          <CLabel className="px-2 h5" label="Care" />
          <FaCircle color="#06b9a3" size={12} />
          <CLabel className="px-2 h5" label="Excel" />
        </div>
        {/* <div className={`mt-3 ${style.h6CSS} ${style.pLabelSmall}`}>
          <CLabel label="OTP service is temporarily disabled for manual registration and password reset." className="" />
          <CLabel label="For help with password reset, email us at " className="" />
          <CLabel label="info[at]desihelpers.com " className="" />
          <CLabel label="Use Google or Facebook to log in." className="" />
        </div> */}
        {/* <CLabel
          className={`mt-3 ${style.h6CSS} `}
          label="(Website is being developed with new features, sorry for the inconvenience.)"
        /> */}
        <CLabel
          className={`mt-3 w-auto ${style.pLabel}`}
          label="Find Service Providers / Jobs in your area"
        />
        <CButton
          className="mb-3 w-auto"
          buttonClassName="btn btn-primary bgPrimary btn-md"
          label="Click Here"
          onClick={() => handleClick()}
        />
      </div>
    </div>
  );
};
