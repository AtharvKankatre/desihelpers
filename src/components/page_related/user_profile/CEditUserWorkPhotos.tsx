import React, { useEffect, useState } from "react";
import { CExpandablePanel } from "@/components/reusable/CExpandablePanel";
import { FunctionComponent } from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { CTextIconButton } from "@/components/reusable/CTextIconButton";
import { CWorkPhoto } from "./CWorkPhotoUpload";
import styles from "@/styles/UserProfiles.module.css";
import { IoImageOutline } from "react-icons/io5";
import { SlSizeFullscreen } from "react-icons/sl";
import { toast } from "react-toastify";
import { getWorkPhotoUrls } from "@/utils/s3Helper";

type Props = {
  formik: any;
  workPhotos: string[];
  setDeleteImages: (images: string[]) => void;
  deleteImages: string[];
  setAddImages: (images: string[]) => void;
  addImages: string[];
  setFiles: (files: File[]) => void;
  files: File[];
};

const WorkPhotoImage = ({ s3Path, onSizeClick }: { s3Path: string, onSizeClick: (url: string) => void }) => {
  const [photoUrl, setPhotoUrl] = useState<string>("/assets/icons/form_icons/icon_dummy_user.svg");

  useEffect(() => {
    const fetchPhotoUrl = async () => {
      const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET || "";
      if (bucketName && s3Path) {
        try {
          const urls = await getWorkPhotoUrls(bucketName, [s3Path]);
          if (urls.length > 0) setPhotoUrl(urls[0]);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchPhotoUrl();
  }, [s3Path]);

  return (
    <>
      <img
        src={photoUrl}
        alt="Work photo"
        className="card-img-top seekerPhoto"
      />
      <div className="p-2">
        <Button variant="light" onClick={() => onSizeClick(photoUrl)}>
          <SlSizeFullscreen size={20} className="textPrimary" />
        </Button>
      </div>
    </>
  );
};

export const CEditUserWorkPhotos: FunctionComponent<Props> = ({
  formik,
  workPhotos,
  setDeleteImages,
  deleteImages,
  setAddImages,
  addImages,
  setFiles,
  files,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [workPhotoUrls, setWorkPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchPhotoUrls = async () => {
      const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
      if (!bucketName) {
        console.error('Bucket name is missing');
        return;
      }
      const urls = await getWorkPhotoUrls(bucketName, workPhotos);
      setWorkPhotoUrls(urls);
    };

    fetchPhotoUrls();
  }, [workPhotos]);

  const handleOpen = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(undefined);
  };

  // Function to delete a file that is already present in S3 bucket
  // Note: This function only adds the file path to the [deletedImages] list
  // Actual deletion is done only when the user saves the
  const handleDeleteClick = (image: string) => {

    let images: string[] = deleteImages;

    images.push(image);
    setDeleteImages(images);
    // Remove the image from formik values
    const updatedWorkPhotos = formik.values.uploadPhotoOfWork.filter(
      (photo: string) => photo !== image
    );
    formik.setFieldValue("uploadPhotoOfWork", updatedWorkPhotos);
  };

  // Function to delete a file that has been selected locally but not yet uploaded to s3 bucket
  function deleteLocalImage(imagePath: string) {
    if (addImages.length == 1) {
      setAddImages([]);
    } else {
      let newFiles: string[] = addImages.filter((e) => e !== imagePath);
      setAddImages(newFiles);
    }
  }

  const handleAddPhotos = (newImages: string[]) => {
    // Filter out any invalid or blank entries from newImages
    const validImages = newImages.filter((image) => image && image.trim() !== "");

    const totalImages = [...workPhotos, ...addImages].length;
    // Check if the total images exceed the limit of 3
    if (totalImages + validImages.length > 3) {
      const maxAllowed = 3 - totalImages;
      toast.warning(
        `Only ${maxAllowed} more ${maxAllowed === 1 ? "photo" : "photos"} allowed. Please remove existing photos to upload new ones.`
      );
    } else {
      // Add new valid images if within the limit
      setAddImages([...addImages, ...validImages]);

      // Ensure you're setting valid images in formik values
      // formik.setFieldValue(
      //   "uploadPhotoOfWork",
      //   [...formik.values.uploadPhotoOfWork, ...validImages]
      // );
    }
  };


  return (
    <CExpandablePanel
      title="My Work Photos (Maximum of 3 photos allowed)"
      id="workPhotos"
      isExpanded="show"
    >
      <Row className="g-2">
        {/* Display existing files from S3 bucket */}
        {workPhotos.map((image: string, index: number) => (
          <Col xs={12} sm={2} key={index} className="mt-2 me-4">
            <Card>
              <WorkPhotoImage s3Path={image} onSizeClick={(url) => handleOpen(url)} />
              <Card.Footer className="d-flex flex-row justify-content-between">
                <CTextIconButton
                  label="Delete"
                  icon="/assets/icons/icon_delete.svg"
                  buttonStyle="btn"
                  textStyle="text-danger"
                  onClick={() => handleDeleteClick(image)}
                />
              </Card.Footer>
            </Card>
          </Col>
        ))}
        {/* If new file(s) have been added by the user then show a temp icon with filename */}
        {addImages.length > 0 &&
          addImages.map((e) => (
            <Col
              xs={12}
              sm={2}
              key={"extra"}
              className="mt-2 me-4 align-content-center"
            >
              <Card
                className={`h-100   ${styles.addWorkPhotoButton}`}
                border="secondary"
                bg="light"
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <IoImageOutline size={42} />
                  {e}
                </Card.Body>
                <Card.Footer className="d-flex flex-row justify-content-end w-100">
                  <CTextIconButton
                    label="Delete"
                    icon="/assets/icons/icon_delete.svg"
                    buttonStyle="btn"
                    textStyle="text-danger"
                    onClick={() => deleteLocalImage(e)}
                  />
                </Card.Footer>
              </Card>
            </Col>
          ))}

        {/* If the user is still able to upload more files then show the relative icon */}
        <Col
          xs={12}
          sm={2}
          key={"extra"}
          className="mt-2 me-4 align-content-center"
        >
          {[...workPhotos, ...addImages].length < 3 && (
            <Card
              className={`h-100 align-items-center justify-content-center ${styles.addWorkPhotoButton}`}
              border="secondary"
              bg="light"
            >
              <CWorkPhoto
                formik={formik}
                workPhotos={workPhotos}
                addImages={addImages}
                setAddImages={handleAddPhotos}
                setFiles={setFiles}
                files={files}
                deletedImages={deleteImages}
              />
            </Card>
          )}
        </Col>
      </Row>
      <hr />

      {/* Modal to show image in full screen for better view */}
      <Modal show={open} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Work Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected Work Photo"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </CExpandablePanel>
  );
};