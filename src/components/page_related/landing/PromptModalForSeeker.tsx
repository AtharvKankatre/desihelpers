import React, { useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
import { Routes } from "@/services/routes/Routes";

let params: any = {
  secure: true,
  expires: 2,
  sameSite: "lax",
};

interface JobSeekerModalProps {
  open: boolean;
  wantToBeSeeker: boolean;
  setWantToBeSeeker: (value: boolean) => void;
  handleClose: () => void;
}

const JobSeekerModal: React.FC<JobSeekerModalProps> = ({
  open,
  wantToBeSeeker,
  setWantToBeSeeker,
  handleClose,
}) => {
  const router = useRouter();

  const handleJobSeekerSubmit = async () => {
    const res = await ApiService.crud(
      APIDetails.updateSeekerStatus,
      JSON.stringify({ isJobSeeker: wantToBeSeeker })
    );
    if (res[0]) {
      if(wantToBeSeeker){
        Cookies.set(cookieParams.isSeeker,"true",params);
      }
      handleClose();
      window.location.href= Routes.landing;
    } else {
      alert(res[1]);
    }
  };

  return (
    <Modal show={open} centered>
    <Modal.Header className="justify-content-center">
  <Modal.Title className="w-100 text-center">
    Welcome to Desihelpers.com
  </Modal.Title>
</Modal.Header>

      <Modal.Body>
        <Container className="text-center">
          <p className="text-success" style={{ fontSize: "1rem", marginBottom: "1rem" }}>
            Now you can post your needs to find a Service Provider.
          </p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="wantToBeSeeker"
                checked={wantToBeSeeker}
                onChange={() => setWantToBeSeeker(!wantToBeSeeker)}
                label="Please check, if you wish to sign-up as a Service Provider."
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleJobSeekerSubmit}
              style={{
                backgroundColor: "#1F4E79",
                borderColor: "#1F4E79",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a5891")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1F4E79")}
            >
              {wantToBeSeeker ? "Yes, Sign Me Up!" : "Proceed Anyway"}
            </Button>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default JobSeekerModal;
