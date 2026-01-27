import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import style from "@/styles/Common.module.css";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { CH8Label } from "@/components/reusable/labels/CH8Label";
import { CH7Label } from "@/components/reusable/labels/CH7Label";

interface OtpModalProps {
  show: boolean;
  email: string;
  onHide: () => void;
  onOtpVerified: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ show, email, onHide, onOtpVerified }) => {
  const [errorState, setErrorState] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes timer
  const [resendAvailable, setResendAvailable] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: yup.object({
      otp: yup.string().required("OTP is required"),
    }),
    onSubmit: async (values) => {
      const response = await ApiService.crud(APIDetails.verifyOTP, JSON.stringify({ email, otp: values.otp }));
      if (response[0]) {
        setSuccessMsg("OTP verified successfully!");
        setTimeout(() => {
          setSuccessMsg("");
          onOtpVerified();
          onHide();
        }, 3000);
      } else {
        setErrorState(response[1]);
        setTimeout(() => setErrorState(""), 3000);
      }
    },
  });

  const handleResendOtp = async () => {
    const response = await ApiService.crud(APIDetails.registrationOTP, JSON.stringify({ email }));
    if (response[0]) {
      setResendAvailable(false);
      setTimeLeft(600);
      setSuccessMsg(response[1].message);
      setTimeout(() => setSuccessMsg(""), 5000);
    } else {
      setErrorState(response[1]);
      setTimeout(() => setErrorState(""), 3000);
    }
  };

  const handleOnHide = () => {
    setTimeLeft(600);
    setResendAvailable(false);
    onHide();
    window.location.reload();
  };

  React.useEffect(() => {
    if(show){
      if (timeLeft > 0) {
        const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearInterval(timer);
      } else {
        setResendAvailable(true);
      }
    } 
  }, [show,timeLeft]);

  return (
    <Modal show={show} onHide={handleOnHide} centered backdrop="static" keyboard={false} >
      <Modal.Header closeButton>
        <Modal.Title>Verify OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorState && <Alert variant="danger">{errorState}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="otp">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the OTP sent to your email"
              value={formik.values.otp}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.otp}
            />
            <CH7Label label="Can't find the OTP? Please check your spam folder."></CH7Label>
            <span className={style.pLabel}></span>
            <Form.Control.Feedback type="invalid">
              {formik.errors.otp}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className={`mt-3 ${style.btnPrimary}`}
            disabled={formik.isSubmitting}
          >
            Verify OTP
          </Button>
        </Form>
        <div className="mt-3">
          {resendAvailable ? (
            <Button variant="link" onClick={handleResendOtp}>
              Resend OTP
            </Button>
          ) : (
            <span>Resend OTP available in {Math.floor(timeLeft / 60)}:{timeLeft % 60} minutes</span>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OtpModal;
