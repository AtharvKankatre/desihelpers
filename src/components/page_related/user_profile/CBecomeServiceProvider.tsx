import CButton from "@/components/reusable/CButton";
import { CH5Label } from "@/components/reusable/labels/CH5Label";
import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { useAuth } from "@/services/authorization/AuthContext";
import commonStyles from "@/styles/Common.module.css";
import { Routes } from "@/services/routes/Routes";
import router from "next/router";
import { cookieParams } from "@/constants/ECookieParams";
import Cookies from "js-cookie";

let params: any = {
  secure: true,
  expires: 2,
  sameSite: "lax",
};

type Props = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
};

export const CBecomeServiceProvider: FunctionComponent<Props> = ({ ...Props }) => {
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const { isSeeker, setIsSeeker } = useAuth();

  const updateFn = async () => {
    setOnLoad(true);
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
    setOnLoad(false);
  };

  return (
    <>
      <CButton
        buttonClassName="btn btn-warning btn-sm me-2"
        label="Become a Service Provider"
        onClick={() => Props.setShowModal(true)}
      />

      <Modal
        show={Props.showModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
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
            job reqiurements specific to your expertise."
          />
        </Modal.Body>
        {/* <Modal.Footer>
          <Button onClick={(e) => Props.setShowModal(false)}>Close</Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};