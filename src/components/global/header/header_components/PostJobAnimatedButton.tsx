import { useRouter } from "next/router";
import Swal from "sweetalert2";
import styles from "@/styles/Common.module.css";
import { useAuth } from "@/services/authorization/AuthContext";

export const PostJobAnimatedButton = () => {
  const router = useRouter();
  const { isProfileBuild, isActive } = useAuth();

  const handleClick = () => {

    if (!isActive) {
      Swal.fire({
        title: "Alert",
        text: "Please Login before posting a job",
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
        text: "Please build your profile first before posting a job.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Landing");
        }
      });
    } else {
      router.push("/jobs/PostAJob");
    }
  };

  return (
    <button
      className={`btn btn-secondary bgSecondary text-light ms-2 ${styles.postJobAnimatedButton}`}
      type="button"
      onClick={handleClick}
    >
      Post A Job
    </button>
  );
};
