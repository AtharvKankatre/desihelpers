import React, { FunctionComponent, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";
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
  const router = useRouter();

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
      const urls = await getWorkPhotoUrls(bucketName, photosArray);
      setPhotoUrls(urls.length > 0 ? urls[0] : undefined);  // Expecting only one URL
    };

    fetchPhotoUrls();
  }, [job.userProfile?.profilePhoto]);

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      size="lg"
      centered
      scrollable
      aria-labelledby="example-modal-sizes-title-xl"
      backdrop="static"
      style={{ paddingTop: "70px" }}
    >
      <Modal.Header
        closeButton
        closeVariant="white"
        style={{
          background: "linear-gradient(135deg, #073157 0%, #0a4a7f 100%)",
          borderBottom: "none",
          padding: "14px 20px",
        }}
      >
        <Modal.Title>
          <div className="d-flex flex-row align-items-center" style={{ gap: "10px" }}>
            {job.urgent ? (
              <span style={{
                background: "#ff4444",
                color: "#fff",
                fontSize: "0.68rem",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "12px",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}>
                ⚠ Urgent
              </span>
            ) : (
              <img src={job.jobType?.icons} height={22} style={{ filter: "brightness(0) invert(1)", opacity: 0.8 }} />
            )}
            <span style={{ color: "#fff", fontSize: "1rem", fontWeight: 600 }}>
              Looking for {job.subCategory ?? "-"} Services
            </span>
          </div>
        </Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body style={{ padding: "20px 24px", maxHeight: "55vh", overflowY: "auto" }}>
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
      <Modal.Footer style={{ borderTop: "1px solid #eef2f7", padding: "14px 20px", flexDirection: "column", gap: "12px" }}>
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
                      style={{ cursor: "pointer" }}
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
        <div className="d-flex w-100 justify-content-end" style={{ gap: "10px" }}>
          {job.postedBy && (
            <button
              style={{
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.88rem",
                padding: "8px 20px",
                background: "linear-gradient(135deg, #06b9a3, #04d9c0)",
                border: "none",
                color: "#fff",
              }}
              onClick={() => {
                handleClose();
                router.push(`/Messages?userId=${job.postedBy}`);
              }}
            >
              💬 Message Poster
            </button>
          )}
          <button
            style={{
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.88rem",
              padding: "8px 24px",
              background: "#073157",
              border: "none",
              color: "#fff",
            }}
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewJobDetailsModal;
