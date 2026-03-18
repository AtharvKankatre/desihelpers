import { useRouter } from "next/router";
import { toast } from "react-toastify";
import styles from "@/styles/Common.module.css";
import { useAuth } from "@/services/authorization/AuthContext";

export const PostJobAnimatedButton = () => {
  const router = useRouter();
  const { isProfileBuild, isActive } = useAuth();

  const handleClick = () => {

    if (!isActive) {
      toast.info("Please Login before posting a job");
      router.push("/Login");
    } else if (!isProfileBuild) {
      toast.warning("Please build your profile first before posting a job.");
      router.push("/Landing");
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
