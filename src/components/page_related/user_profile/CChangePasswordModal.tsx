import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import styles from "@/styles/Common.module.css";

interface ChangePasswordModalProps {
  open: boolean;
  handleClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  handleClose,
}) => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleClickShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

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
      setTimeout(() => setErrorState(null), 3000);
      return;
    }

    if (newPassword.length < passwordRules.minLength) {
      setErrorState("Password must be at least 8 characters.");
      setTimeout(() => setErrorState(null), 3000);
      return;
    }

    if (!passwordRules.hasUpperCase(newPassword)) {
      setErrorState("Password must contain at least one uppercase letter.");
      setTimeout(() => setErrorState(null), 3000);
      return;
    }

    if (!passwordRules.hasNumber(newPassword)) {
      setErrorState("Password must contain at least one number.");
      setTimeout(() => setErrorState(null), 3000);
      return;
    }

    if (!passwordRules.hasSpecialChar(newPassword)) {
      setErrorState("Password must contain at least one special character.");
      setTimeout(() => setErrorState(null), 3000);
      return;
    }

    setErrorState(null);
    setSuccessMsg(null);

    const changePasswordResponse = await ApiService.crud(
      APIDetails.changePassword,
      JSON.stringify({ currentPassword, newPassword })
    );

    if (changePasswordResponse[0]) {
      setSuccessMsg("Password Changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setSuccessMsg(null), 2000);
      setTimeout(() => handleClose(), 2000);
    //   setErrorState(null);
     // handleClose();
    } else {
      setErrorState(changePasswordResponse[1]);
      setTimeout(() => setErrorState(null), 3000);
    }
  };

  return (
    <>
      <Modal show={open} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className={`${styles.pLabel}`}>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorState && <p style={{ color: "red" }}>{errorState}</p>}
          {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="currentPassword" className="mt-3">
              <Form.Label>Current Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <InputGroup.Text onClick={handleClickShowCurrentPassword}>
                  {showCurrentPassword ? <BiSolidShow /> : <BiSolidHide />}
                </InputGroup.Text>
              </InputGroup>
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
                  {showPassword ? <BiSolidShow /> : <BiSolidHide />}
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
                  {showConfirmPassword ? <BiSolidShow /> : <BiSolidHide />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <div className="container">
              <div className="row justify-content-center">
                <Button
                  type="submit"
                  className={`btn text-white mt-4 ${styles.btnPrimary} ${styles.btnGap}`}
                >
                  Submit
                </Button>
                <Button
                  className={`btn mt-4 ml-2 ${styles.btnCancel} ${styles.btnGap}`}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
