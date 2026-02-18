import React, { useEffect, useState } from "react";
import OtherDataServices from "@/services/other_data/OtherDataServices";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { useRouter } from "next/router";
import { Button, Form, Image, Modal, Ratio, Spinner } from "react-bootstrap";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import styles from "@/styles/UserProfiles.module.css";
import { getWorkPhotoUrls } from "@/utils/s3Helper";

type Props = {
  profile: IUserProfileModel | null;
  returnNewProfile?: (newProfile: IUserProfileModel) => void;
  hideEditIcon?: boolean;
};

export const CUserPhoto: React.FC<Props> = ({ ...Props }) => {
  const router = useRouter();
  const otherServices = new OtherDataServices();
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [PhotoUrls, setPhotoUrls] = useState<string | undefined>(undefined);

  // Modal handlers
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFileName(event.target.files[0].name); // Set the selected file name
    }
  };

  const upLoadImage = async () => {
    setIsLoading(true);
    let fileName: string = `profilePhotos/${Props.profile?.userId}`;

    // The first api should save the profile photo in s3 bucket
    var result = await otherServices.uploadProfilePhoto(file!, fileName);

    if (result[0] == true) {
      // The second should update the profile object in the database
      let p: IUserProfileModel = Props.profile!;
      p.profilePhoto = result[1];
      var res = await ApiService.crud(APIDetails.updateUserProfile, "", p);

      if (res[0]) {
        handleClose();
      }
    } else {
      alert(result[1]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchPhotoUrls = async () => {
      const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
      if (!bucketName) {
        return;
      }
      const photo = Props.profile?.profilePhoto;
      const photosArray = photo ? [photo] : [];
      const urls = getWorkPhotoUrls(bucketName, photosArray);
      setPhotoUrls(urls.length > 0 ? urls[0] : undefined);  // Expecting only one URL
    };
  
    fetchPhotoUrls();
  }, [Props.profile?.profilePhoto]);
  

  return (
    <>
      <div className={styles.imageDiv}>
        <Ratio aspectRatio="1x1">
          <Image
            roundedCircle
            src={`${
              PhotoUrls??
              "/assets/icons/form_icons/icon_dummy_user.svg"
            }`}
          />
        </Ratio>
        {!Props.hideEditIcon && (
          <Image
            src="/assets/icons/form_icons/icon_edit_photo.svg"
            height={34}
            onClick={handleShow}
            className={styles.editIcon}
            color="white"
          />
        )}
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group
            controlId="formFileSm"
            className="mb-3"
            onChange={handleFileChange}
          >
            <Form.Control type="file" size="sm" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={upLoadImage}>
            Upload{" "}
            {isLoading && (
              <span>
                <Spinner animation="border" size="sm" />
              </span>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
