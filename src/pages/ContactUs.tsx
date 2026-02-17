import { CInput } from "@/components/form/CInput";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import styles from "@/styles/Forms.module.css";
import style from "@/styles/Common.module.css";
import contactStyles from "@/styles/Contact.module.css"; // Imported new styles
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
          ".notification-popup": { color: "#000000 !important" },
          ".notification-popup *": { color: "#000000 !important" },
          ".language-dropdown": { color: "#000000 !important" },
          ".language-dropdown *": { color: "#000000 !important" },
          ".form-check-input:checked": {
            backgroundColor: "#f07c00 !important",
            borderColor: "#f07c00 !important",
          },
          ".form-check-input:focus": {
            borderColor: "#f07c00 !important",
            boxShadow: "0 0 0 0.25rem rgba(240, 124, 0, 0.25) !important",
          },
          ".form-select:focus, .form-control:focus": {
            borderColor: "#f07c00 !important",
            boxShadow: "0 0 0 0.25rem rgba(240, 124, 0, 0.1) !important",
          },
          ".form-control, .form-select": {
            borderRadius: "12px !important",
            padding: "10px 15px !important",
            border: "1px solid #dee2e6 !important",
            backgroundColor: "#fff !important",
          },
          ".form-control::placeholder": {
            color: "#adb5bd !important",
            opacity: 1
          },
        }}
      />

      <CHeader />

      {/* Hero Section */}
      <Box
        className={contactStyles.heroSection}
        sx={{
          pt: { xs: 12, md: 15 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <div className="container">
          {/* Breadcrumbs */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 3, fontSize: '0.9rem' }}>
            <span style={{ opacity: 0.8 }}>Home</span>
            <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>›</span>
            <span style={{ opacity: 1, fontWeight: 500 }}>Contact Us</span>
          </Box>

          {/* Heading */}
          <h1 className={contactStyles.heroHeading} style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Contact us</h1>
          <p style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 400 }}>
            Questions? Feedback? We're here to help you every step of the way. Reach out to the DesiHelpers team today!
          </p>
        </div>
      </Box>

      <Box sx={{ backgroundColor: '#F4F7FA', minHeight: '60vh', py: { xs: 4, md: 8 }, mt: -6 }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8 d-flex justify-content-center">
              <div className={contactStyles.contactCard}>
                <form onSubmit={formik.handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4 text-start">
                      <label htmlFor="name" className="fw-bold mb-2" style={{ color: '#333' }}>Name <span className="text-danger">*</span></label>
                      <CInput
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        key="name"
                        hint="Enter"
                        error={formik.errors.name}
                        className="text-start"
                        isEnabled={!onLoad}
                        showTitle={false}
                      />
                    </div>

                    <div className="col-md-6 mb-4 text-start">
                      <label htmlFor="email" className="fw-bold mb-2" style={{ color: '#333' }}>Email <span className="text-danger">*</span></label>
                      <CInput
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        key="email"
                        hint="Enter"
                        error={formik.errors.email}
                        className="text-start"
                        isEnabled={!onLoad}
                        showTitle={false}
                      />
                    </div>
                  </div>

                  {/* Query Type */}
                  <div className="text-start mb-4">
                    <label htmlFor="issueType" className="fw-bold mb-2">Query Type <span className="text-danger">*</span></label>
                    <Form.Select
                      id="issueType"
                      name="issueType"
                      className="py-2 px-3"
                      value={formik.values.issueType}
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.issueType}
                      disabled={onLoad}
                      style={{ borderRadius: '12px', backgroundColor: '#F8F9FA', border: '1px solid #dee2e6', padding: '12px 16px', fontSize: '0.95rem' }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="Improvement">Improvement</option>
                      <option value="Application Issues">Application Query</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="ReferABusiness">Refer A Business</option>
                    </Form.Select>
                    {formik.errors.issueType && (
                      <div className="text-danger small mt-1">{formik.errors.issueType}</div>
                    )}
                  </div>

                  {/* Role */}
                  <div className="text-start mb-4">
                    <label className="fw-bold mb-2 d-block">Role <span className="text-danger">*</span></label>
                    <div className="d-flex flex-row align-items-center gap-4">
                      <div className="d-flex align-items-center">
                        <FormCheck
                          type="radio"
                          id="jobPoster"
                          name="role"
                          value="Job Poster"
                          checked={formik.values.role === "Job Poster"}
                          onChange={formik.handleChange}
                          className="m-0 custom-radio"
                        />
                        <label htmlFor="jobPoster" className="ms-2 mb-0" style={{ cursor: 'pointer', fontSize: '0.95rem', color: '#555' }}>Job Poster</label>
                      </div>
                      <div className="d-flex align-items-center">
                        <FormCheck
                          type="radio"
                          id="jobSeeker"
                          name="role"
                          value="Job Seeker"
                          checked={formik.values.role === "Job Seeker"}
                          onChange={formik.handleChange}
                          className="m-0 custom-radio"
                        />
                        <label htmlFor="jobSeeker" className="ms-2 mb-0" style={{ cursor: 'pointer', fontSize: '0.95rem', color: '#555' }}>Service Provider</label>
                      </div>
                    </div>
                    {formik.errors.role && (
                      <div className="text-danger small mt-1">{formik.errors.role}</div>
                    )}
                  </div>

                  {/* Describe Your Query */}
                  <div className="text-start mb-4">
                    <label htmlFor="issueDescription" className="fw-bold mb-2">Describe Your Query <span className="text-danger">*</span></label>
                    <CInputArea
                      id="issueDescription"
                      name="issueDescription"
                      value={formik.values.issueDescription}
                      onChange={formik.handleChange}
                      error={formik.errors.issueDescription}
                      hint="Type your message..."
                      readonly={onLoad}
                      isMandatory={false}
                      showTitle={false}
                      wordLimit={250}
                      style={{ backgroundColor: '#F8F9FA' }}
                    />
                  </div>

                  {/* reCAPTCHA */}
                  <div className={`mb-4 d-flex justify-content-center justify-content-md-start ${contactStyles.recaptchaContainer}`}>
                    <div>
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                        onChange={onRecaptchaChange}
                        theme="light"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-start">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={onLoad}
                      className={contactStyles.submitBtn}
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default ContactUs;
