import styles from "@/styles/Jobs.module.css";
import { FunctionComponent, useState } from "react";
import { IJobs } from "@/models/Jobs";
import style from "@/styles/Common.module.css";
import Swal from "sweetalert2";
import ViewJobDetailsModal from "./ViewJobDetailsModal"; // Import the modal component
import { CH7Label } from "../reusable/labels/CH7Label";
import { CH4Label } from "../reusable/labels/CH4Label";
import CButton from "../reusable/CButton";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import { useRouter } from "next/router";
import { useAuth } from "@/services/authorization/AuthContext";
import { CH8Label } from "../reusable/labels/CH8Label";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CShareLinkJobs from "../reusable/labels/CShareLinkJobs";

type Props = {
  jobs: IJobs;
  className?: string;
};

export const CJobPosterJob: FunctionComponent<Props> = ({
  jobs,
  className,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IJobs | null>(null);
  const { mobile } = useAppMediaQuery();
  const { isProfileBuild, isActive } = useAuth();
  const router = useRouter();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(jobs.startDate!));

  const viewJobDetailsFn = () => {
    if (!isActive) {
      Swal.fire({
        title: "Alert",
        text: "Please login to view job details",
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
        text: "Please build your profile first before viewing job details.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Landing");
        }
      });
    } else {
      setSelectedJob(jobs);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedJob(null); // Reset selected job
  };

  return (
    <>
      <div className={`card ${className} ps-0 pe-0 ${styles.jobCardDetails}`}>
        <div>
          <img
            src={`${
              jobs.jobType?.image ||
              "/assets/icons/form_icons/icon_dummy_user.svg"
            }`}
            className={mobile ? styles.imageSizeMobile : styles.imageSize}
          />
        </div>
        <div className="card-body">
          <div className={`row pb-2 mb-2 ${style.border_bottom_dark}`}>
            <div className="ml-1 text-start">
              <CH4Label
                label={jobs.subCategory ?? "-"}
                className={` text-warning ${style.JobcardHeight}`}
                
              />
              <CH7Label
                className="text-warning"
                label={`By : ${jobs.userProfile?.displayName}`}
              />
              <CH7Label
              className={` text-warning ${style.JobcardHeight}`}
              label={`${jobs.city ?? "-"} , ${jobs.state ?? "-"}`}
            />
            
            </div>
          </div>
          <div className="card-text text-start">
            <CH7Label label={`Start Date : ${formattedDate}`} />
            <CH7Label label={`Work Type : ${(jobs.workType && jobs.workType !== "" )? jobs.workType : "-"}`} />
            <CH7Label label={`Pay Range : ${jobs.payRange ?? "-"}`} />
          </div>

          <div className="d-flex flex-row w-100 justify-content-between mt-2">
            {jobs.urgent && (
              <div>
                <img
                  src="/assets/icons/form_icons/icon_urgent_need.svg"
                  height={24}
                />
                <CH8Label label="Urgent" />
              </div>
            )}
            <CShareLinkJobs id={jobs.id || ""} /> 
            <CButton
              label="View Details"
              className="w-100 d-flex flex-row justify-content-end mt-2"
              buttonClassName="btn btn-warning"
              onClick={viewJobDetailsFn}
            />
             <ToastContainer />
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <ViewJobDetailsModal
          showModal={showModal}
          handleClose={handleCloseModal}
          job={selectedJob} // Pass the selected job data to the modal
        />
      )}
    </>
  );
};
