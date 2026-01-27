import { IUserProfileModel } from "@/models/UserProfileModel";
import { FunctionComponent, useEffect, useState } from "react";
import { Col, Image, Modal, Row,} from "react-bootstrap";
import { MdKeyboardArrowRight } from "react-icons/md";
import { CExperienceDetails } from "../page_related/user_profile/CExperienceDetails";
import { CUserWorkPhotos } from "../page_related/user_profile/CUserWorkPhotos";
import CButton from "../reusable/CButton";
import { CH7Label } from "../reusable/labels/CH7Label";
import { CDisplay } from "../reusable/CDisplay";
import { CH4Label } from "../reusable/labels/CH4Label";
import { CUserPhoto } from "../page_related/user_profile/CUserPhoto";
import Link from "next/link";
import { getWorkPhotoUrls } from "@/utils/s3Helper";

type Props = {
  profile: IUserProfileModel;
  source?: string;
  setModal?: boolean;
  toggleModal?: () => void;
};

export const CDisplaySeekerDetailsModal: FunctionComponent<Props> = ({
  profile,
  source,
  setModal,
  toggleModal,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const dummyImage = "/assets/icons/form_icons/icon_dummy_user.svg";
  const [PhotoUrls, setPhotoUrls] = useState<string | undefined>(undefined);

  const toggleModalFn = () => {
    setShowModal(!showModal);
    if (toggleModal != null) {
      toggleModal();
    }
  };

  useEffect(() => {
    if (setModal != null) {
      if (setModal) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    }
  }, [setModal]);

  const whatappApiUrl = process.env.NEXT_PUBLIC_WHATAPP_API;
  const handleWhatsAppClick = () => {
    const whatsappURL = `${whatappApiUrl}send?phone=${profile?.mobile?.replace(/[^\d]/g, "")}`;
    window.open(whatsappURL, "_blank");
  };

  function returnAddress() {
    return `${profile?.city ?? "-"}, ${profile?.state ?? "-"}`;
  }

  function returnLanguages() {
    return profile?.languagesSpoken == null
      ? ""
      : `${profile?.languagesSpoken.toString().split(",").join(", ")}`;
  }

  useEffect(() => {
    const fetchPhotoUrls = async () => {
      const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
      if (!bucketName) {
        return;
      }
      const photo = profile.profilePhoto;
      const photosArray = photo ? [photo] : [];
      const urls = getWorkPhotoUrls(bucketName, photosArray);
      setPhotoUrls(urls.length > 0 ? urls[0] : undefined);  // Expecting only one URL
    };
  
    fetchPhotoUrls();
  }, [profile.profilePhoto]);

  return (
    <>
      {/* Button to toggle Modal */}

      {source == "landing" ? (
        <CButton
          className="d-flex flex-row w-100 justify-content-end p-2"
          buttonClassName="btn btn-warning bgWarning"
          label="View Details"
          onClick={toggleModalFn}
        />
      ) : source == "all" ? (
        <CButton
          buttonClassName="btn btn-warning bgWarning btn-sm"
          label="View"
          onClick={toggleModalFn}
        />
      ) : (
        <div
          id={profile.userId}
          className="d-flex flex-row justify-content-end p-1 me-2 mb-1"
        >
          <div
            className="btn btn-link viewProfileLink d-flex flex-row p-1 align-items-center"
            onClick={toggleModalFn}
          >
            <CH7Label label="View Full Profile" />
            <MdKeyboardArrowRight size={20} />
          </div>
        </div>
      )}

      {/* Actual Modal */}
      <Modal
        show={showModal}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton onClick={toggleModalFn}>
          <Modal.Title>
            <div className="d-flex flex-row align-items-center">
              <Image
                src={PhotoUrls || dummyImage}
                height={36}
                width={36}
                roundedCircle
                className="me-2"
              />
              {profile.displayName ?? "-"}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mt-4">
            <Col sm={4}>
              <CDisplay
                heading="Email"
                icon="/assets/icons/form_icons/icon_email.svg"
                label={
                  profile?.email ? (
                    <Link
                      href={`mailto:${profile.email}`}
                      style={{ cursor: "pointer" }} // Add pointer cursor
                    >
                      {profile.email}
                    </Link>
                  ) : (
                    "-"
                  )
                }
              />
            </Col>
            {profile.showPhone && (
              <>
                <Col sm={12} md={4}>
                  <CDisplay
                    heading="Phone"
                    icon="/assets/icons/form_icons/icon_phone.svg"
                    label={profile?.phone ?? "Not Mentioned"}
                  />
                </Col>
                </>
            )}
              {profile.showMobile && (
              <>
               <Col sm={12} md={4}>
                  <div
                    className="d-flex flex-row align-items-center"
                    onClick={handleWhatsAppClick}
                    style={{ cursor: "pointer" }}
                  >
                    <CDisplay
                      heading="Whatsapp"
                      icon="/assets/icons/form_icons/icon_whatsapp.svg"
                      // label={"Click to connect"}
                      label={profile?.mobile ?? "Not Mentioned"}
                    />
                  </div>
               
                </Col>
              </>
            )}
               

          </Row>

          <Row>
            <Col sm={12} md={4}>
              <CDisplay
                heading="Languages Spoken"
                icon="/assets/icons/form_icons/icon_languages_spoken.svg"
                label={returnLanguages()}
              />
            </Col>
            <Col sm={12} md={8}>
              <CDisplay
                heading="Location"
                icon="/assets/icons/form_icons/icon_address.svg"
                label={returnAddress()}
              />
            </Col>
          </Row>

          <Row>
            <Col sm={12} md={4}>
              <CDisplay
                heading="Commute Preference"
                icon="/assets/icons/form_icons/icon_commute.svg"
                label={`${profile?.commutePreference ?? "Not mentioned"}`}
              />
            </Col>
            <Col sm={12} md={4}>
              <CDisplay
                heading="Dietary Preference"
                icon="/assets/icons/form_icons/icon_diet.svg"
                label={`${profile?.dietaryRestrictions ?? "Not mentioned"}`}
              />
            </Col>
            <Col sm={12} md={4}>
              <CDisplay
                heading="OK With Pets"
                icon="/assets/icons/form_icons/icon_pets.svg"
                label={`${
                  profile?.okWithPets == true
                    ? "Yes"
                    : profile?.okWithPets == false
                    ? "No"
                    : "Not mentioned"
                }`}
              />
            </Col>
          </Row>

          <Row>
            <Col sm={12} md={4}>
              <CDisplay
                heading="Facebook"
                icon="/assets/icons/form_icons/icon_facebook.svg"
               
                label={
                  typeof profile?.facebookLink === 'undefined' || profile?.facebookLink?.length == 0 ? (
                    "Not provided"
                  ) : (
                    <Link
                      href={`${profile?.facebookLink!}`}
                       target="_blank"
                        rel="noopener noreferrer"
                      style={{ cursor: "pointer" }} 
                    >
                      Click to open link
                    </Link>
                  )
                }
              />
            </Col>
            <Col sm={12} md={4}>
              <CDisplay
                heading="Instagram"
                icon="/assets/icons/form_icons/icon_instagram.svg"
                label={
                  typeof profile?.instagram === 'undefined' || profile?.instagram?.length == 0 ? (
                    "Not provided"
                  ) : (
                    <Link
                      href={`${profile?.instagram!}`}
                       target="_blank"
                        rel="noopener noreferrer"
                      style={{ cursor: "pointer" }} 
                    >
                        Click to open link
                    </Link>
                  )
                }
              />
            </Col>
            <Col sm={12} md={4}>
              <CDisplay
                heading="Website"
                icon="/assets/icons/form_icons/icon_website.svg"
                label={
                  typeof profile?.websiteLink === 'undefined' || profile?.websiteLink?.length == 0 ? (
                    "Not provided"
                  ) : (
                    <Link
                      href={`${profile?.websiteLink!}`}
                       target="_blank"
                        rel="noopener noreferrer"
                      style={{ cursor: "pointer" }} 
                    >
                       Click to open link
                    </Link>
                  )
                }
              />
            </Col>
          </Row>

          {/* Show details on experience and other parameters */}
          <CExperienceDetails profile={profile} />

          <CUserWorkPhotos workPhotos={profile?.uploadPhotoOfWork ?? []} />
        </Modal.Body>
        <Modal.Footer>
          <CButton
            label="Close"
            buttonClassName="btn btn-secondary"
            onClick={toggleModalFn}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};
