import { IJobs } from "@/models/Jobs";
import { FunctionComponent, useState } from "react";
import styles from "@/styles/Jobs.module.css";
import { CH5Label } from "../reusable/labels/CH5Label";
import { CH6Label } from "../reusable/labels/CH6Label";
import { CDottedDivider } from "../reusable/CDottedDivider";
import { formatDate } from "@/services/functions/FormatDate";
import CButton from "../reusable/CButton";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/router";
import ViewJobDetailsModal from "./ViewJobDetailsModal";
import { Button, Modal } from "react-bootstrap";

type Props = {
  job: IJobs;
  className?: string;
  deleteAJob: (p0: IJobs) => void;
  editAJob: (p0: IJobs) => void;
};

export const CMyJobDisplayCard: FunctionComponent<Props> = ({ ...Props }) => {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IJobs | null>(null);

  const [showDModal, setShowDModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDModal(false);
    Props.deleteAJob(Props.job);
  };

  const handleClose = () => {
    setShowDModal(false);
  };

  const deleteJob = () => Props.deleteAJob(Props.job);

  const editJob = () => Props.editAJob(Props.job);

  const viewJobDetails = () => {
    setShowDetails(!showDetails);
  };

  const viewJobDetailsFn = () => {
    setSelectedJob(Props.job);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedJob(null); // Reset selected job
  };

  let workType: string =
    Props.job.workType!.length == 0 ? "NA" : Props.job.workType!;
  let startDate: string = formatDate(Props.job.startDate?.toString());
  let noOfDays: string =
    Props.job.numberOfDays == undefined || Props.job.numberOfDays == 0
      ? "NA"
      : Props.job.numberOfDays?.toString();
  let payRange: string =
    Props.job.payRange == undefined || Props.job.payRange?.length == 0
      ? "NA"
      : Props.job.payRange;
      let city : string =  Props.job.city!.length == 0 ? "NA" : Props.job.city!;
      let state : string =  Props.job.state!.length == 0 ? "NA" : Props.job.state!;

  return (
    <div className={`${Props.className}`}>
      <div
        className={`container ${styles.myPostJobCard} align-items-center p-2 mb-4`}
      >
        <div className="d-flex flex-row justify-content-between">
          <CH5Label label={Props.job.subCategory ?? "-"} />
          <img height={32} src={Props.job.jobType?.icons} />
        </div>
        <CH6Label label={Props.job.jobType?.name ?? "-"} />
        <CH6Label label={`From : ${startDate}`} />
        <CDottedDivider />
        <div className="d-flex flex-row justify-content-between">
          <CH6Label label={`Work Type : ${workType}`} />
          <CH6Label label={`Pay Range : ${payRange}`} />
        </div>
        <div className="d-flex flex-row justify-content-between">
          <CH6Label label={`Days : ${noOfDays}`} />
        </div>
        <div className="d-flex flex-row justify-content-between">
          <CH6Label label={`Location : ${city}, ${state}`} />
        </div>

        <CDottedDivider />

        <div className="d-flex flex-row justify-content-between align-items-center">
          <div className="col-md-5 d-flex justify-content-between">
            <RiDeleteBin6Line
              className={`${styles.deleteIcon} mb-2`}
              size={28}
              onClick={handleDeleteClick}
            />
          </div>
          <div className="d-flex flex-row">
            <CButton
              buttonClassName="btn mb-2 w-100 bgWarning"
              label="Edit"
              onClick={editJob}
            />

            <CButton
              buttonClassName="btn text-white bgPrimary mb-2 w-100"
              label="View"
              onClick={viewJobDetailsFn}
            />
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

      <Modal show={showDModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
