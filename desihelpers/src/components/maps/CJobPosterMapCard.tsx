import { Card } from "react-bootstrap";
import { CH7Label } from "../reusable/labels/CH7Label";
import { CH5Label } from "../reusable/labels/CH5Label";
import { MdVisibility } from "react-icons/md";
import { formatDate } from "@/services/functions/FormatDate";
import { IJobs } from "@/models/Jobs";
import styles from "@/styles/Common.module.css";
import { FunctionComponent, useState } from "react";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import jobStyles from "@/styles/Jobs.module.css";
import ViewJobDetailsModal from "../jobs/ViewJobDetailsModal";

type Props = {
  e: IJobs;
};

export const CJobPosterMapCard: FunctionComponent<Props> = ({ e }) => {
  const { mobile } = useAppMediaQuery();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card
        onClick={() => setShowModal(true)}
        className={
          mobile
            ? jobStyles.jobPosterCardForMapMobile
            : jobStyles.jobPosterCardForMap
        }
      >
        <Card.Img
          className={jobStyles.jobPosterCardForMapImg}
          src={e.jobType?.image}
          alt="Card image"
        />
        <Card.ImgOverlay className={jobStyles.jobPosterCardForMapOverlay}>
          <Card.Title>
            <div className={jobStyles.jobPosterCardForMapFirstRow}>
              <CH5Label
                className="text-warning fw-medium"
                label={e.subCategory ?? "-"}
              />
              <MdVisibility />
            </div>
            <CH7Label
              className="text-warning"
              label={`Start Date : ${formatDate(e.startDate?.toString())}`}
            />
            <div className={styles.whiteDivider} />
          </Card.Title>

          <div className={jobStyles.workTypeAndPayRange}>
            <CH7Label label={`Work Type : ${e.workType ?? "-"}`} />
            <CH7Label label={`Pay Range : ${e.payRange ?? "Not given"}`} />
          </div>

          <CH7Label label={`Location : ${e.city ?? "-"} , ${e.state ?? "-"}`} />
          <CH7Label
            className="text-warning"
            label={`By : ${e.userProfile?.displayName ?? "NA"}`}
          />
        </Card.ImgOverlay>
      </Card>
      {showModal && (
        <ViewJobDetailsModal
          showModal={showModal}
          job={e}
          handleClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
