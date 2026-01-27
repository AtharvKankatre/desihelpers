import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import Link from "next/link";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import styles from "@/styles/Common.module.css";
import { CH7Label } from "@/components/reusable/labels/CH7Label";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ResetPasswordModalProps {
  open: boolean;
  handleClose: () => void;
  email: string;
  successMessage?: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  open,
  handleClose,
  email,
  successMessage,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes timer
  const [resendAvailable, setResendAvailable] = useState<boolean>(false);
  const [resendModalOpen, setResendModalOpen] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendAvailable(true);
    }
  }, [timeLeft]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const passwordRules = {
      minLength: 8,
      hasUpperCase: (value: string) => /[A-Z]/.test(value),
      hasNumber: (value: string) => /\d/.test(value),
      hasSpecialChar: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };

    if (newPassword !== confirmNewPassword) {
      setErrorState("New Password and Confirm New Password do not match.");
      setTimeout(() => setErrorState(""), 3000);
      return;
    }

    if (newPassword.length < passwordRules.minLength) {
      setErrorState("Password must be at least 8 characters.");
      setTimeout(() => setErrorState(""), 3000);
      return;
    }

    if (!passwordRules.hasUpperCase(newPassword)) {
      setErrorState("Password must contain at least one uppercase letter.");
      setTimeout(() => setErrorState(""), 3000);
      return;
    }

    if (!passwordRules.hasNumber(newPassword)) {
      setErrorState("Password must contain at least one number.");
      setTimeout(() => setErrorState(""), 3000);
      return;
    }

    if (!passwordRules.hasSpecialChar(newPassword)) {
      setErrorState("Password must contain at least one special character.");
      setTimeout(() => setErrorState(""), 3000);
      return;
    }

    setErrorState(null);
    setSuccessMsg(null);

    const response = await ApiService.crud(
      APIDetails.forgotPassword,
      JSON.stringify({ email, otp, newPassword })
    );
    if (response[0]) {

      setOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
      setSuccessMsg("Password reset successfully.");
      setTimeout(() => setSuccessMsg(""), 2000);
      setSuccessMsg(null);
      setErrorState(null);
      handleClose();
    } else {
      alert(response[1]);
    }
  };

  const purpose = "password_reset";
  const resendOtp = async () => {
    const response = await ApiService.crud(
      APIDetails.resendOTP,
      JSON.stringify({ email, purpose })
    );
    if (response[0]) {
      setTimeLeft(600);
      setResendAvailable(false);
      setSuccessMsg("Password resent OTP sent successfully.");
      //   setErrorState(null);
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorState("Failed to resend OTP. Please try again.");
      setTimeout(() => setErrorState(""), 3000);
    }
  };

  return (
    <>
      <Modal show={open} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className={`${styles.pLabel}`}>
            Reset Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {errorState && <p style={{ color: "red" }}>{errorState}</p>}
          {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} disabled />
            </Form.Group>

            <Form.Group controlId="otp" className="mt-3">
              <Form.Label>OTP</Form.Label>
              <Form.Control
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <CH7Label label={"Can't find the OTP? Please check your spam folder."}/>
              {timeLeft > 0 ? (
                <p className="mt-2">
                  OTP valid for : {Math.floor(timeLeft / 60)}:{timeLeft % 60}
                </p>
              ) : (
                <Link href="#" passHref>
                  <Button variant="link" onClick={() => resendOtp()}>
                    Resend OTP
                  </Button>
                </Link>
              )}
            </Form.Group>

            <Form.Group controlId="newPassword" className="mt-3">
              <Form.Label>New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <InputGroup.Text onClick={handleClickShowPassword}>
                  <span>
                    {" "}
                    {showPassword ? <BiSolidShow /> : <BiSolidHide />}
                  </span>
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="confirmNewPassword" className="mt-3">
              <Form.Label>Confirm New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
                <InputGroup.Text onClick={handleClickShowConfirmPassword}>
                  <span>
                    {" "}
                    {showConfirmPassword ? <BiSolidShow /> : <BiSolidHide />}
                  </span>
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <div className="container">
              <div className="row  justify-content-center">
                <Button
                  type="submit"
                  className={`btn text-white mt-4 ${styles.btnPrimary} ${styles.btnGap}`}
                >
                  Reset Password
                </Button>
                <Button
                  className={`btn mt-4 ml-2  ${styles.btnCancel} ${styles.btnGap}`}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={resendModalOpen}
        onHide={() => setResendModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Resend OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to resend the OTP to your email?</p>
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => {
              resendOtp();
              //   setResendModalOpen(false);
            }}
          >
            {" "}
            Resend OTP
          </Button>
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => setResendModalOpen(false)}
          >
            Cancel
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ResetPasswordModal;
