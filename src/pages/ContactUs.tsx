import { CInput } from "@/components/form/CInput";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import styles from "@/styles/Forms.module.css";
import style from "@/styles/Common.module.css";
import { Button, Form, FormCheck } from "react-bootstrap";
import commonStyles from "@/styles/Common.module.css";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";
import { CInputArea } from "@/components/form/CInputArea";
import { CH3Label } from "@/components/reusable/labels/CH3Label";
import { CHeader } from "@/components/global/header/CHeader";
import { Box, GlobalStyles } from "@mui/material";
import Head from "next/head";


const ContactUs: React.FC = () => {
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const router = useRouter();
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const onRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);

  };

  const isEmailValid = (email: string) => {
    const regex =
      /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|aol\.com|icloud\.com|mail\.com|protonmail\.com|yandex\.com|zoho\.com|comcast\.net|verizon\.net|att\.net|live\.com|msn\.com|inpinitesolutions\.com)$/;
    return regex.test(email);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "Job Poster",
      issueType: "",
      issueDescription: "",
      captchaToken: recaptchaToken,
    },
    validationSchema: yup.object({
      name: yup.string().trim().required("Name is required"),
      email: yup
        .string()
        .email("Must be a valid email")
        .required("Email is required")
        .test("is-valid-email", "Email domain is not allowed", (value) => {
          return isEmailValid(value || "");
        }),
      role: yup.string().required("Role is required"),
      issueType: yup.string().required("Please select a query type"),
      issueDescription: yup.string().trim().required("Please describe the query"),
    }),

    onSubmit: async (values) => {

      // Check if reCAPTCHA token is present
      if (!recaptchaToken) {
        Swal.fire({
          title: "reCAPTCHA Required",
          text: "Please complete the reCAPTCHA.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      setOnLoad(true);
      values.captchaToken = recaptchaToken;
      const res = await ApiService.crud(APIDetails.contactUs, values);
      setOnLoad(false);

      if (res[0]) {
        Swal.fire({
          title: "Success",
          text: res[1].message,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/Landing");
        });
      } else {
        Swal.fire({
          title: "Error",
          text: res[1],
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/Landing");
        });
      }
    },
  });

  const handleCancel = () => {
    router.push("/Landing");
  };

  return (
    <>
      <Head>
        <title>Contact Us | DesiHelpers</title>
      </Head>

      <GlobalStyles
        styles={{
          header: {
            background: "transparent !important",
            backgroundColor: "transparent !important",
            boxShadow: "none !important",
            position: "absolute !important",
            width: "100% !important",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          },
          "header a:not(.notification-popup *):not(.notification-popup):not(.language-dropdown *):not(.language-dropdown)": {
            color: "#ffffff !important",
          },
          "header button:not(.notification-popup *):not(.notification-popup):not(.language-dropdown *):not(.language-dropdown)": {
            color: "#ffffff !important",
          },
          "header .langButton": {
            color: "#ffffff !important",
          },
          // Force notification popup text to be visible
          ".notification-popup": {
            color: "#000000 !important",
          },
          ".notification-popup *": {
            color: "#000000 !important",
          },
          ".notification-popup .MuiTypography-root": {
            color: "#000000 !important",
          },
          ".notification-popup b": {
            color: "#000000 !important",
          },
          // Force language dropdown text to be visible
          ".language-dropdown": {
            color: "#000000 !important",
          },
          ".language-dropdown *": {
            color: "#000000 !important",
          },
          ".language-dropdown button": {
            color: "#000000 !important",
          },
          // Orange accent for radio buttons and select
          ".form-check-input:checked": {
            backgroundColor: "#fd7e14 !important",
            borderColor: "#fd7e14 !important",
          },
          ".form-check-input:focus": {
            borderColor: "#fd7e14 !important",
            boxShadow: "0 0 0 0.25rem rgba(253, 126, 20, 0.25) !important",
          },
          ".form-select:focus": {
            borderColor: "#fd7e14 !important",
            boxShadow: "0 0 0 0.25rem rgba(253, 126, 20, 0.25) !important",
          },
        }}
      />

      <CHeader />

      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(180deg, #00132F 0%, #003E95 100%)',
        color: '#ffffff',
        pt: 15,
        pb: 5,
        textAlign: 'center'
      }}>
        <div className="container">
          {/* Breadcrumbs */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 3, opacity: 0.8 }}>
            <span>Home</span>
            <span>›</span>
            <span>Contact Us</span>
          </Box>

          {/* Heading */}
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Contact us</h1>
          <p style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Have questions or need help? We're here to assist you. Reach out to us anytime!
          </p>
        </div>
      </Box>

      <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh', py: 3 }}>
        <div className={`container ${styles.formAlternateBody}`}>
          <div className="row justify-content-center">
            <div className={`row col-md-6 mx-auto ${styles.formBody}`}>
              <CH3Label label="Contact Us" className="text-center mb-2" />
              <form onSubmit={formik.handleSubmit}>
                {/* Name and Email Side by Side */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <CInput
                      id="name"
                      name="Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      key="name"
                      hint="Enter"
                      error={formik.errors.name}
                      className="text-start"
                      isEnabled={onLoad}
                      isMandatory={true}
                    />
                  </div>
                  <div className="col-md-6">
                    <CInput
                      id="email"
                      name="Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      key="email"
                      hint="Enter"
                      error={formik.errors.email}
                      className="text-start"
                      isEnabled={onLoad}
                      isMandatory={true}
                    />
                  </div>
                </div>


                <div className="col-md-12 text-start mb-3 ">
                  <label className="fw-bold control-label mb-2">Role <span className="text-danger"> *</span></label>
                  <div className="row text-start mb-3 ">
                    <Form.Group className="d-flex">
                      <div className="col-auto ">
                        <FormCheck
                          type="radio"
                          id="jobPoster"
                          name="role"
                          value="Job Poster"
                          checked={formik.values.role === "Job Poster"}
                          onChange={formik.handleChange}
                          label="Job Poster"

                        />
                      </div>
                      <div className="col-auto ms-3">
                        <FormCheck
                          type="radio"
                          id="jobSeeker"
                          name="role"
                          value="Job Seeker"
                          checked={formik.values.role === "Job Seeker"}
                          onChange={formik.handleChange}
                          label="Job Seeker"
                        />
                      </div>
                    </Form.Group>
                    {formik.errors.role && (
                      <div className="text-danger">{formik.errors.role}</div>
                    )}
                  </div>
                </div>


                <div className="col-md-12 text-start mb-3">
                  <label htmlFor="issueType" className="fw-bold mb-2">Query Type <span className="text-danger"> *</span></label>
                  <Form.Select
                    id="issueType"
                    name="issueType"
                    value={formik.values.issueType}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.issueType}
                    disabled={onLoad}
                  >
                    <option value="" disabled>
                      Select a query type
                    </option>
                    <option value="Improvement">Improvement</option>
                    <option value="Application Issues">Application Query</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="ReferABusiness">Refer A Business</option>
                  </Form.Select>
                  {formik.errors.issueType && (
                    <div className="text-danger">{formik.errors.issueType}</div>
                  )}
                </div>


                <div className="col-md-12 text-start mb-3">
                  <label htmlFor="issueType" className="fw-bold mb-2">Describe Your Query <span className="text-danger"> *</span></label>
                  <CInputArea
                    id="issueDescription"
                    name="issueDescription"
                    value={formik.values.issueDescription}
                    onChange={formik.handleChange}
                    error={formik.errors.issueDescription}
                    hint="Describe your query here"
                    readonly={onLoad}
                    isMandatory={true}
                    showTitle={false}
                    wordLimit={500}
                  />
                </div>

                {/* reCAPTCHA widget */}
                <div className="col-md-12 text-start mb-3">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                    onChange={onRecaptchaChange}
                    theme="light"
                  />
                </div>

                {/* Submit Button - Orange */}
                <div className="col-md-12 text-start mb-3">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={onLoad}
                    style={{
                      backgroundColor: '#fd7e14',
                      border: 'none',
                      padding: '12px 40px',
                      borderRadius: '24px',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default ContactUs;
