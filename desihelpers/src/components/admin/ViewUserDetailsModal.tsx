import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col,Image } from 'react-bootstrap'; // Example using Bootstrap
import { CUserWorkPhotos } from '../page_related/user_profile/CUserWorkPhotos';
import { CExperienceDetails } from '../page_related/user_profile/CExperienceDetails';
import { CDisplay } from '../reusable/CDisplay';
import Link from 'next/link';
import { getWorkPhotoUrls } from '@/utils/s3Helper';

interface UserModalProps {
  show: boolean;
  userData: any; // Define a proper type for userData if possible
  handleClose: () => void;
}



const UserModal: React.FC<UserModalProps> = ({ show, userData, handleClose }) => {
    const whatappApiUrl = process.env.NEXT_PUBLIC_WHATAPP_API;
    const handleWhatsAppClick = () => {
      const whatsappURL = `${whatappApiUrl}send?phone=${userData?.mobile?.replace(/[^\d]/g, "")}`;
      window.open(whatsappURL, "_blank");
    };
    const dummyImage = "/assets/icons/form_icons/icon_dummy_user.svg";
    const [PhotoUrls, setPhotoUrls] = useState<string | undefined>(undefined);


  
    function returnAddress() {
      return `${userData?.city ?? "-"}, ${userData?.state ?? "-"}`;
    }
    function returnName() {
      return `${userData?.firstName ?? "-"} ${userData?.lastName ?? "-"}`;
    }
  
    function returnLanguages() {
      return userData?.languagesSpoken == null
        ? ""
        : `${userData?.languagesSpoken.toString().split(",").join(", ")}`;
    }
    useEffect(() => {
      const fetchPhotoUrls = async () => {
        const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
        if (!bucketName) {
          return;
        }
        const photo = userData?.profilePhoto;
        const photosArray = photo ? [photo] : [];
        const urls = getWorkPhotoUrls(bucketName, photosArray);
        setPhotoUrls(urls.length > 0 ? urls[0] : undefined);  // Expecting only one URL
      };
    
      fetchPhotoUrls();
    }, [userData?.profilePhoto]);
  
  return (
    <Modal show={show} onHide={handleClose}
    size="xl"
    aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
      
        <Modal.Title>
          <div className="d-flex flex-row align-items-center">
              <Image
                src={PhotoUrls || dummyImage}
                height={36}
                width={36}
                roundedCircle
                className="me-2"
              />
              {userData?.displayName ?? "-"}
            </div></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mt-4">
        <Col sm={12} md={4}>
              <CDisplay
                heading="Name"
                icon={dummyImage}
                label={returnName()}
              />
            </Col>
            <Col sm={4}>
              <CDisplay
                heading="Email"
                icon="/assets/icons/form_icons/icon_email.svg"
                label={
                    userData?.email ? (
                    <Link
                      href={`mailto:${userData?.email}`}
                      style={{ cursor: "pointer" }} 
                    >
                      {userData?.email}
                    </Link>
                  ) : (
                    "-"
                  )
                }
              />
            </Col>
            {userData?.showPhone && (
              <>
                <Col sm={12} md={4}>
                  <CDisplay
                    heading="Phone"
                    icon="/assets/icons/form_icons/icon_phone.svg"
                    label={userData?.phone ?? "Not Mentioned"}
                  />
                </Col>
                </>
            )}
              {userData?.showMobile && (
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
                      label={userData?.mobile ?? "Not Mentioned"}
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
                label={`${userData?.commutePreference ?? "Not mentioned"}`}
              />
            </Col>
            <Col sm={12} md={4}>
              <CDisplay
                heading="Dietary Preference"
                icon="/assets/icons/form_icons/icon_diet.svg"
                label={`${userData?.dietaryRestrictions ?? "Not mentioned"}`}
              />
            </Col>
            <Col sm={12} md={4}>
              <CDisplay
                heading="OK With Pets"
                icon="/assets/icons/form_icons/icon_pets.svg"
                label={`${
                    userData?.okWithPets == true
                    ? "Yes"
                    : userData?.okWithPets == false
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
                  typeof userData?.facebookLink === 'undefined' || userData?.facebookLink?.length == 0 ? (
                    "Not provided"
                  ) : (
                    <Link
                      href={`${userData?.facebookLink!}`}
                       target="_blank"
                        //rel="noopener noreferrer"
                      style={{ cursor: "pointer" }} 
                    >
                      {userData?.facebookLink!}
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
                  typeof userData?.instagram === 'undefined' || userData?.instagram?.length == 0 ? (
                    "Not provided"
                  ) : (
                    <Link
                      href={`${userData?.instagram!}`}
                       target="_blank"
                       // rel="noopener noreferrer"
                      style={{ cursor: "pointer" }} 
                    >
                      {userData?.instagram!}
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
                  typeof userData?.websiteLink === 'undefined' || userData?.websiteLink?.length == 0 ? (
                    "Not provided"
                  ) : (
                    <Link
                      href={`${userData?.websiteLink!}`}
                       target="_blank"
                        //rel="noopener noreferrer"
                      style={{ cursor: "pointer" }} 
                    >
                      {userData?.websiteLink!}
                    </Link>
                  )
                }
              />
            </Col>
          </Row>

          {/* Show details on experience and other parameters */}
          <CExperienceDetails profile={userData} />

          <CUserWorkPhotos workPhotos={userData?.uploadPhotoOfWork ?? []} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;
