import React, { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as yup from "yup";
import { Form, Row, Col } from "react-bootstrap";
import { CPasswordInput } from "@/components/form/CPassword";
import { CInput } from "@/components/form/CInput";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import OtpModal from "@/components/page_related/register/OTPVerificationModal";
import style from "@/styles/Common.module.css";
import Swal from "sweetalert2";

type Props = {
  callback: () => void;
};

const Register: React.FC<Props> = ({ callback }) => {
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [otpModalOpen, setOtpModalOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const sendOtp = async (email: string) => {
    const response = await ApiService.crud(
      APIDetails.registrationOTP,
      JSON.stringify({ email })
    );

    if (response[0]) {
      setOtpModalOpen(true);
    } else {
      Swal.fire({
        title: "Alert",
        text: response[1],
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  const isEmailValid = (email: string) => {
    const regex =
      /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|aol\.com|icloud\.com|mail\.com|protonmail\.com|yandex\.com|zoho\.com|comcast\.net|verizon\.net|att\.net|live\.com|msn\.com|inpinitesolutions\.com)$/;
    return regex.test(email);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      isJobSeeker: false,
      isEighteenPlus: false,
    },
    onSubmit: async (values) => {
      setOnLoad(true);

      if (!values.isEighteenPlus) {
        alert("You must be 18 years or older to sign up.");
        setOnLoad(false);
        return;
      }

      setEmail(values.email);
      await sendOtp(values.email);
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Must be a valid email")
        .required("Email is required")
        .test("is-valid-email", "Email domain is not allowed", (value) => {
          return isEmailValid(value || "");
        }),
      password: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .required("Password is required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
      isEighteenPlus: yup
        .boolean()
        .oneOf([true], "You must be 18 years or older to sign up.")
        .required(),
    }),
  });

  const handleOtpVerified = async () => {
    const apiPayload = {
      email: formik.values.email,
      password: formik.values.password,
      isJobSeeker: formik.values.isJobSeeker,
    };

    const res = await ApiService.crud(APIDetails.signup, apiPayload);
    if (res[0]) {
      Swal.fire({
        title: "Success! Welcome to DesiHelpers.com",
        text: "Let us find the help you need!",
        icon: "success",
        imageUrl: "/DesiHelpersLogo.svg",
        imageAlt: "Custom image",
        imageWidth: 300,
        imageHeight: "auto",
        confirmButtonText: "OK",
      }).then(() => {
        callback();
      });
    } else {
      alert(res[1]);
    }
    setOnLoad(false);
  };

  const handleOnHide = () => {
    setOnLoad(false);
    setOtpModalOpen(false);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <CInput
          id="email"
          name="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          key="email"
          hint="Enter your email address"
          error={formik.errors.email}
          className="col-md-12 text-start"
          isEnabled={onLoad}
          isMandatory={true}
        />
        <CPasswordInput
          id="password"
          name="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          key="password"
          hint="Enter your password"
          error={formik.errors.password}
          className="col-md-12 text-start"
          isEnabled={onLoad}
          isMandatory={true}
        />
        <CPasswordInput
          id="confirmPassword"
          name="Confirm Password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          key="confirmPassword"
          hint="Confirm your password"
          error={formik.errors.confirmPassword}
          className="col-md-12 text-start"
          isEnabled={onLoad}
          isMandatory={true}
        />

        <Row className="mt-3">
          <Col xs={6}>
            <Form.Group controlId="isJobSeeker">
              <Form.Check
                type="checkbox"
                label="Sign Up for Service Provider"
                checked={formik.values.isJobSeeker}
                onChange={formik.handleChange}
                disabled={onLoad}
              />
            </Form.Group>
          </Col>
          <Col xs={6}>
            <Form.Group controlId="isEighteenPlus">
              <Form.Check
                type="checkbox"
                label="I am 18 years or older"
                checked={formik.values.isEighteenPlus}
                onChange={formik.handleChange}
                disabled={onLoad}
                isInvalid={!!formik.errors.isEighteenPlus}
                feedback={formik.errors.isEighteenPlus}
              />
            </Form.Group>
          </Col>
        </Row>

        <button
          type="submit"
          className={style.signupButton}
          disabled={onLoad}
        >
          Sign Up
        </button>
      </form>

      <OtpModal
        show={otpModalOpen}
        email={email}
        onHide={() => {
          handleOnHide();
        }}
        onOtpVerified={handleOtpVerified}
      />
    </>
  );
};

export default Register;
