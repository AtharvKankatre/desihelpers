import React, { FormEvent } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import styles from "@/styles/Common.module.css";

interface ForgotPasswordModalProps {
  show: boolean;
  handleClose: () => void;
  handleForgotPasswordSubmit: (event: FormEvent<HTMLFormElement>) => void;
  forgotPasswordEmail: string;
  setForgotPasswordEmail: (email: string) => void;
  errorFP?: string;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  show,
  handleClose,
  handleForgotPasswordSubmit,
  forgotPasswordEmail,
  setForgotPasswordEmail,
  errorFP,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className={styles.pLabel}>Forgot Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={`${styles.bodyText}`}>Enter your email to receive a password reset OTP.</p>
        {errorFP && <Alert variant="danger">{errorFP}</Alert>}
        <Form onSubmit={handleForgotPasswordSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>
          <div className='container'>
            <div className='row  justify-content-center'>
          <Button variant="primary" type="submit" className={`btn text-white mt-4 ${styles.btnPrimary} ${styles.btnGap}`}>
            Submit
          </Button>
          <Button  onClick={handleClose} className={`btn mt-4 ml-2  ${styles.btnCancel} ${styles.btnGap}`} >
            Cancel
          </Button>
          </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordModal;
