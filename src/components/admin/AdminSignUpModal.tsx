import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from '@/services/data/constants/ApiDetails';

interface SignupModalProps {
  show: boolean;
  handleClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ show, handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isJobSeeker, setIsJobSeeker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isEmailValid = (email: string) => {
    const regex = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|aol\.com|icloud\.com|mail\.com|protonmail\.com|yandex\.com|zoho\.com|comcast\.net|verizon\.net|att\.net|live\.com|msn\.com|inpinitesolutions\.com)$/;
    return regex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!isEmailValid(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      const response = await ApiService.crud(APIDetails.AdminSignUp, {
        email,
        password,
        isJobSeeker,
      });
      if (response[0]) {

      }

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'You have successfully signed up!',
        confirmButtonText: 'Ok',
      });

      setEmail('');
      setPassword('');
      setIsJobSeeker(false);
      handleClose();
    } catch (error: any) {
      console.error('Error during registration', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed!',
        text: error.response?.data?.message || 'Something went wrong. Please try again!',
        confirmButtonText: 'Ok',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
              isInvalid={!!emailError}
            />
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formJobSeeker" className="mt-3">
            <Form.Check
              type="checkbox"
              label="Sign up as a Job Seeker"
              checked={isJobSeeker}
              onChange={() => setIsJobSeeker(!isJobSeeker)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSignup}
          disabled={loading || !email || !password || !!emailError}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignupModal;
