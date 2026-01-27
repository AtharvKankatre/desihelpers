import React, { useState } from "react";
import { BsPlusSquareFill } from "react-icons/bs";
import OtherDataServices from "@/services/other_data/OtherDataServices";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { useRouter } from "next/router";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

type Props = {
  formik: any;
  workPhotos: string[];
  setAddImages: (images: string[]) => void;
  addImages: string[];
  setFiles: (files: File[]) => void;
  files: File[];
  deletedImages: string[];
};

export const CWorkPhoto: React.FC<Props> = ({ ...Props }) => {
  const otherServices = new OtherDataServices();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modal handlers
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     const selectedFiles = Array.from(event.target.files);

  //     let existingLength: number = Props.workPhotos.length ?? 0;
  //     let deletedLength: number = Props.deletedImages.length;
  //     let addLength: number = selectedFiles.length;

  //     if (addLength - (existingLength - deletedLength) > 3) {
  //       alert("You can only upload a maximum of 3 photos.");
  //       return;
  //     }

  //     Props.setFiles(selectedFiles);
  //     Props.setAddImages(selectedFiles.map((e) => e.name));
  //     handleClose();
  //   }
  // };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
  
      let existingLength: number = Props.workPhotos.length ?? 0;
      let deletedLength: number = Props.deletedImages.length;
      let newImagesCount: number = selectedFiles.length;
      const netExistingPhotos = Math.abs(existingLength - deletedLength);
      const remainingSpace = Math.max(3 - netExistingPhotos, 0);
  
      // Check if the number of newly selected files exceeds the allowed space
      if (newImagesCount > remainingSpace) {
        Swal.fire({
          icon: "warning",
          title: `Upload Limit Reached`,
          text: `Only ${remainingSpace} more photo(s) allowed or please remove existing photos to upload new ones.`,
        });
        return;
      }
  
      // Check for file size (limit: 500KB)
      const filesOverSizeLimit = selectedFiles.filter(
        (file) => file.size > 500 * 1024
      );
  
      if (filesOverSizeLimit.length > 0) {
        Swal.fire({
          icon: "error",
          title: "File Size Exceeded",
          text: "Each file must be less than 500KB.",
        });
        return;
      }
  
      // Proceed with adding selected files if within allowed limits
      Props.setFiles(selectedFiles);
      Props.setAddImages(selectedFiles.map((file) => file.name));
      handleClose();
    }
  };
  
  

  return (
    <>
      <BsPlusSquareFill onClick={handleShow} size={34} />
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Photos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group
            controlId="formFileSm"
            className="mb-3"
            onChange={handleFileChange}
          >
            <Form.Control type="file" multiple size="sm" />
            <small>Max 3 photos, each less than 500KB.</small>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
