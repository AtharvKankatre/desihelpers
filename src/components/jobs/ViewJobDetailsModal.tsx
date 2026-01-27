import React, { FunctionComponent, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { IJobs } from "@/models/Jobs";
import Link from "next/link";
import styles from "@/styles/Jobs.module.css";
import { CDottedDivider } from "../reusable/CDottedDivider";
import { CH5Label } from "../reusable/labels/CH5Label";
import { CDisplay } from "../reusable/CDisplay";
import { Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { formatDate } from "@/services/functions/FormatDate";
import { CH8Label } from "../reusable/labels/CH8Label";
import { CH4Label } from "../reusable/labels/CH4Label";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import style from "@/styles/UserProfiles.module.css"
import { getWorkPhotoUrls } from "@/utils/s3Helper";

type Props = {
  showModal: boolean;
  handleClose: () => void;
  job: IJobs;
};

const ViewJobDetailsModal: FunctionComponent<Props> = ({
  showModal,
  handleClose,
  job,
}) => {
  const { tablet } = useAppMediaQuery();
  const dummyImage = "/assets/icons/form_icons/icon_dummy_user.svg";
  const [PhotoUrls, setPhotoUrls] = useState<string | undefined>(undefined);

  const whatappApiUrl = process.env.NEXT_PUBLIC_WHATAPP_API;
  const handleWhatsAppClick = () => {
    const whatsappURL = `${whatappApiUrl}send?phone=${job.userProfile?.mobile?.replace(/[^\d]/g, "")}`;
    window.open(whatsappURL, "_blank");
  };

  useEffect(() => {
    const fetchPhotoUrls = async () => {
      const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
      if (!bucketName) {
        return;
      }
      const photo = job.userProfile?.profilePhoto;
      const photosArray = photo ? [photo] : [];
      const urls = getWorkPhotoUrls(bucketName, photosArray);
      setPhotoUrls(urls.length > 0 ? urls[0] : undefined);  // Expecting only one URL
    };
  
    fetchPhotoUrls();
  }, [job.userProfile?.profilePhoto]);

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      className={styles.customModalWidth} // Custom class added here
      size="xl"
      aria-labelledby="example-modal-sizes-title-xl"
      centered
      backdrop="static" 
    >
      <Modal.Header closeButton>
        <Modal.Title className="d-flex flex-row w-100 justify-content-between align-items-center">
          <div className="d-flex flex-row justify-content-between align-items-center">
            {job.urgent ? (
              <div>
                <img
                  src="/assets/icons/form_icons/icon_urgent_need.svg"
                  height={34}
                />
                <CH8Label label="Urgent" />
              </div>
            ) : (
              <img src={job.jobType?.icons} height={34} />
            )}
            <CH4Label
              label={`Looking for ${job.subCategory ?? "-"} Services`}
              className="displayIconHeadingLabel genericWordWrap me-2 ms-2"
            />
          </div>
        </Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body className="pt-0">
        <Row>
          <Col sm={12} className="pt-2 modalImportantInfo">
            <CDisplay
              className="mb-0"
              heading="Job Description"
              icon="/assets/icons/form_icons/icon_job_description.svg"
              label={
                <div className={style.scrollableDescription}>
                  {job.aboutRequirement ?? "Not mentioned"}
                </div>
              }
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={tablet ? 12 : 4}>
            <CDisplay
              heading="Location"
              icon="/assets/icons/form_icons/icon_address.svg"
              label={`${job.city}, ${job.state}`}
            />
          </Col>
          <Col md={tablet ? 12 : 4}>
            <CDisplay
              heading="Start Date"
              icon="/assets/icons/form_icons/icon_calendar.svg"
              label={`${formatDate(job.startDate?.toString())}`}
            />
          </Col>
          <Col md={tablet ? 12 : 4}>
            <CDisplay
              heading="Required Experience (in years)"
              icon="/assets/icons/form_icons/icon_experience.svg"
              label={`${job.requiredExperience ?? "Not mentioned"}`}
            />
          </Col>

          <Col md={tablet ? 12 : 4}>
            <CDisplay
              heading="Work Type"
              icon="/assets/icons/form_icons/ico_work_type.svg"
              label={job.workType ?? "Not mentioned"}
            />
          </Col>
          <Col md={tablet ? 12 : 4}>
            <CDisplay
              heading="Days per week"
              icon="/assets/icons/form_icons/icon_no_of_days.svg"
              label={`${job.numberOfDays ?? "Not mentioned"}`}
            />
          </Col>
          <Col md={tablet ? 12 : 4}>
            <CDisplay
              heading="Pay Range"
              icon="/assets/icons/form_icons/icon_pay_range.svg"
              label={`${job.payRange ?? "Not mentioned"}`}
            />
          </Col>
          <Col md={tablet ? 12 : 4}>
            <CDisplay
              heading="Dietary Preference"
              icon="/assets/icons/form_icons/icon_diet.svg"
              label={job.dietaryPreference ?? "Not mentioned"}
            />
          </Col>
        </Row>
      </Modal.Body>

      {/* Modal Footer */}
      <Modal.Footer className="modalImportantInfo">
        <Container fluid className="p-0">
          <Row md={12}>
            <Col md={tablet ? 12 : 4}>
              <CDisplay
                heading="Posted by : "
                icon={PhotoUrls || dummyImage}
                label={job.userProfile?.displayName ?? "-"}
                isRounded={true}
              />
            </Col>
            <Col md={tablet ? 12 : 4}>
            <CDisplay
                heading="Email"
                icon="/assets/icons/form_icons/icon_email.svg"
                label={
                  job.userProfile?.email ? (
                    <Link
                      href={`mailto:${job.userProfile.email}`}
                      style={{ cursor: "pointer" }} // Add pointer cursor
                    >
                      {job.userProfile.email}
                    </Link>
                  ) : (
                    "-"
                  )
                }
              />
            </Col>
            <Col
              md={tablet ? 12 : 4}
              className="justify-content-center align-content-center"
            >
              {job.userProfile?.showMobile && (
                <div
                  className="d-flex flex-row align-items-center"
                  onClick={handleWhatsAppClick}
                  style={{ cursor: "pointer" }}
                >
                  <CDisplay
                    heading="Whatsapp"
                    icon="/assets/icons/form_icons/icon_whatsapp.svg"
                    label={job.userProfile?.mobile ?? "Not Mentioned"}
                  />
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewJobDetailsModal;
