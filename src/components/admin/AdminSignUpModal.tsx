import React, { useState } from 'react';
import { Modal, Form, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaUserPlus, FaTimes } from 'react-icons/fa';
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from '@/services/data/constants/ApiDetails';
import { toast } from 'react-toastify';
import style from '@/styles/Admin.module.css';

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
        toast.success('User registered successfully!');
      }

      setEmail('');
      setPassword('');
      setIsJobSeeker(false);
      handleClose();
    } catch (error: any) {
      console.error('Error during registration', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const modalStyles = {
    overlay: {
      backdropFilter: 'blur(4px)',
    },
    errorText: {
      color: '#ef4444',
      fontSize: '0.8rem',
      marginTop: '4px',
      fontWeight: 500 as const,
    },
    eyeBtn: {
      background: '#f8fafc',
      border: '1.5px solid #e2e8f0',
      borderLeft: 'none',
      borderRadius: '0 10px 10px 0',
      color: '#6b7a8d',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      padding: '0 14px',
    },
    checkboxLabel: {
      fontSize: '0.9rem',
      color: '#073157',
      fontWeight: 500 as const,
      cursor: 'pointer',
      margin: 0,
    },
    submitBtnDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName={style.adminModalContent}
      dialogClassName=""
    >
      <div className={style.adminModalHeader}>
        <div className={style.adminModalTitle}>
          <span className={style.adminModalTitleIcon}>
            <FaUserPlus size={18} color="#06b9a3" />
          </span>
          Add New User
        </div>
        <button className={style.adminModalCloseBtn} onClick={handleClose}>
          <FaTimes />
        </button>
      </div>

      {/* Body */}
      <div className={style.adminModalBody}>
        <Form>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label className={style.adminModalLabel}>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="e.g. user@gmail.com"
              value={email}
              onChange={handleEmailChange}
              isInvalid={!!emailError}
              className={style.adminModalInput}
            />
            {emailError && (
              <div style={modalStyles.errorText}>{emailError}</div>
            )}
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label className={style.adminModalLabel}>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={style.adminModalInput}
                style={{ borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              />
              <InputGroup.Text
                onClick={togglePasswordVisibility}
                className={style.adminModalEyeBtn}
              >
                {showPassword ? (
                  <FaEye size={16} color="#06b9a3" />
                ) : (
                  <FaEyeSlash size={16} />
                )}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <div
            className={style.adminModalCheckboxWrapper}
            onClick={() => setIsJobSeeker(!isJobSeeker)}
          >
            <input
              type="checkbox"
              checked={isJobSeeker}
              onChange={() => setIsJobSeeker(!isJobSeeker)}
              style={{
                accentColor: '#06b9a3',
                width: '18px',
                height: '18px',
                cursor: 'pointer',
              }}
            />
            <label className={style.adminModalLabel} style={{ marginBottom: 0 }}>
              Register as a Service Provider
            </label>
          </div>
        </Form>
      </div>

      {/* Footer */}
      <div className={style.adminModalFooter}>
        <button className={style.adminModalCancelBtn} onClick={handleClose}>
          Cancel
        </button>
        <button
          className={style.adminModalSubmitBtn}
          style={loading || !email || !password || !!emailError ? { opacity: 0.5, cursor: 'not-allowed', boxShadow: 'none' } : {}}
          onClick={handleSignup}
          disabled={loading || !email || !password || !!emailError}
        >
          <FaUserPlus size={14} />
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </Modal>
  );
};

export default SignupModal;
