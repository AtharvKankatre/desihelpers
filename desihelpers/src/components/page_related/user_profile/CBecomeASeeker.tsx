import CButton from "@/components/reusable/CButton";
import { CH5Label } from "@/components/reusable/labels/CH5Label";
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { useAuth } from "@/services/authorization/AuthContext";
import commonStyles from "@/styles/Common.module.css";
import { cookieParams } from "@/constants/ECookieParams";
import Cookies from "js-cookie";
import router from "next/router";
import { Routes } from "@/services/routes/Routes";
import { IUserProfileModel } from "@/models/UserProfileModel";
import React from "react";
import { userProfileStore } from "@/stores/UserProfileStore";

let params: any = {
  secure: true,
  expires: 2,
  sameSite: "lax",
};

type Props = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
};

export const CBecomeASeeker: FunctionComponent<Props> = ({ showModal, setShowModal }) => {
  const [onLoad, setOnload] = useState<boolean>(true);
  const { isSeeker, setIsSeeker } = useAuth();
  const [profile, setProfile] = useState<IUserProfileModel | null>(null);
  
  const handleClose = () => {
    // Props.setShowModal(false);
    setShowModal(false); // Close the modal on user action
  };

  // Fetch profile using API (example logic)
  useEffect(() => {
    const getProfile = async () => {
      var result = await ApiService.crud(APIDetails.getUserProfile);
      if (result[0] == true) {
        setProfile(result[1] as IUserProfileModel);
      }
      setOnload(false);
    };

    getProfile();

    return () => {};
  }, []);

  const updateFn = async () => {
    setOnload(true);
    try {
      var result = await ApiService.crud(
        APIDetails.updateSeekerStatus,
        JSON.stringify({ isJobSeeker: true })
      );

      if (result[0]) {
        setIsSeeker(true);
        Cookies.set(cookieParams.isSeeker, "true", params);
        var result = await ApiService.crud(APIDetails.getUserProfile);
        let q: string = JSON.stringify(result[1]);
        router.push({ pathname: Routes.editSeeekerForm, query: { queryData: q } });
      } else {
        alert(result[1]);
      }
    } catch (error) {
      console.error("Error updating seeker status:", error);
    } finally {
      setOnload(false);
    }
  };

  return (
    <>
        {/* <CButton
        buttonClassName="btn btn-warning btn-sm me-2"
        label="Become Job Seeker"
        onClick={() => Props.setShowModal(true)}
      /> */}
      <Modal
        show={showModal} // Control modal visibility
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Become a Service Provider
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="m-4">
          <InputGroup className="mb-3">
            <InputGroup.Checkbox
              aria-label="Checkbox for following text input"
              disabled={onLoad}
            />
            <Form.Control
              className="me-4"
              aria-label="Text input with checkbox"
              value="Check to become a service provider"
              readOnly={true}
            />
            <CButton label="Confirm" onClick={updateFn} />
          </InputGroup>
          <CH5Label
            label="Enabling this will allow you to add your professional skills to your
            profile. It will also make your profile visible to people who have
            job requirements specific to your expertise."
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
