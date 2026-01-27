import { CInput } from "@/components/form/CInput";
import { MainBG } from "@/components/page_related/landing/BackGround";
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
        if (!recaptchaToken ) {
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
    <MainBG className={`${commonStyles.bgImageContactUs}`}>
      <div className={`container ${styles.formAlternateBody}`}>        
        <div className="row justify-content-center">          
          <div className={`row col-md-6 mx-auto ${styles.formBody}`}>
            <CH3Label label="Contact Us" className="text-center mb-2"/>
            <form onSubmit={formik.handleSubmit}>
              <CInput
                id="name"
                name="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                key="name"
                hint="Enter your name"
                error={formik.errors.name}
                className="col-md-12 text-start"
                isEnabled={onLoad}
                isMandatory={true}
              />
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
              
              <div className="container">
                <div className="row justify-content-center">
                  <Button
                    onClick={handleCancel}
                    className={`btn mt-4 ml-2 ${style.btnCancel} ${style.btnGap}`}
                    disabled={onLoad}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className={`btn text-white mt-4 ${style.btnPrimary} ${style.btnGap}`}
                    disabled={onLoad}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainBG>
  );
};

export default ContactUs;
