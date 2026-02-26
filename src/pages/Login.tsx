import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Image from "next/image";
import { useRouter } from "next/router";
import style from "@/styles/Common.module.css";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import Swal from "sweetalert2";
import CookieService from "@/services/authorization/CookieService";

// Define the form data interface for all steps
interface SignupFormData {
  // Step 1
  email: string;
  otp: string[];
  isOtpSent: boolean;
  isOtpVerified: boolean;
  // Step 2
  firstName: string;
  lastName: string;
  displayName: string;
  gender: string;
  isEighteenPlus: boolean;
  mobileNumber: string;
  whatsappSameAsMobile: boolean;
  whatsappNumber: string;
  // Step 3
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  // Step 4
  profilePicture: File | null;
  facebookLink: string;
  instagramLink: string;
  linkedinLink: string;
  twitterLink: string;
  websiteLink: string;
}

type ViewMode = "signup" | "login";

const Login = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("login");
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [isLoginOtpSent, setIsLoginOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState(["", "", "", "", "", ""]);
  const [loginTimer, setLoginTimer] = useState(59);
  const loginTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiBaseUrl = process.env.NEXT_PUBLIC_Base_API_URL;

  // Fetch states on component mount and check query params
  useEffect(() => {
    fetchStates();
    if (router.query.mode === "signup") {
      setViewMode("signup");
      setCurrentStep(1);
    }
  }, [router.query.mode]);

  // Hardcoded US states as fallback when API requires auth
  const US_STATES_FALLBACK = [
    { id: "AL", name: "Alabama" }, { id: "AK", name: "Alaska" }, { id: "AZ", name: "Arizona" },
    { id: "AR", name: "Arkansas" }, { id: "CA", name: "California" }, { id: "CO", name: "Colorado" },
    { id: "CT", name: "Connecticut" }, { id: "DE", name: "Delaware" }, { id: "FL", name: "Florida" },
    { id: "GA", name: "Georgia" }, { id: "HI", name: "Hawaii" }, { id: "ID", name: "Idaho" },
    { id: "IL", name: "Illinois" }, { id: "IN", name: "Indiana" }, { id: "IA", name: "Iowa" },
    { id: "KS", name: "Kansas" }, { id: "KY", name: "Kentucky" }, { id: "LA", name: "Louisiana" },
    { id: "ME", name: "Maine" }, { id: "MD", name: "Maryland" }, { id: "MA", name: "Massachusetts" },
    { id: "MI", name: "Michigan" }, { id: "MN", name: "Minnesota" }, { id: "MS", name: "Mississippi" },
    { id: "MO", name: "Missouri" }, { id: "MT", name: "Montana" }, { id: "NE", name: "Nebraska" },
    { id: "NV", name: "Nevada" }, { id: "NH", name: "New Hampshire" }, { id: "NJ", name: "New Jersey" },
    { id: "NM", name: "New Mexico" }, { id: "NY", name: "New York" }, { id: "NC", name: "North Carolina" },
    { id: "ND", name: "North Dakota" }, { id: "OH", name: "Ohio" }, { id: "OK", name: "Oklahoma" },
    { id: "OR", name: "Oregon" }, { id: "PA", name: "Pennsylvania" }, { id: "RI", name: "Rhode Island" },
    { id: "SC", name: "South Carolina" }, { id: "SD", name: "South Dakota" }, { id: "TN", name: "Tennessee" },
    { id: "TX", name: "Texas" }, { id: "UT", name: "Utah" }, { id: "VT", name: "Vermont" },
    { id: "VA", name: "Virginia" }, { id: "WA", name: "Washington" }, { id: "WV", name: "West Virginia" },
    { id: "WI", name: "Wisconsin" }, { id: "WY", name: "Wyoming" }, { id: "DC", name: "District of Columbia" }
  ];

  const fetchStates = async () => {
    console.log("Fetching states...");
    const response = await ApiService.crud(APIDetails.fetchStates, null);
    console.log("States API response:", response);
    if (response[0] && Array.isArray(response[1]) && response[1].length > 0) {
      console.log("States data:", response[1]);
      setStates(response[1]);
    } else {
      console.warn("Using fallback US states (API requires auth)");
      setStates(US_STATES_FALLBACK);
    }
  };

  const fetchCities = async (stateId: string) => {
    const response = await ApiService.crud(
      [APIDetails.fetchCities[0] + stateId, APIDetails.fetchCities[1], APIDetails.fetchCities[2]],
      null
    );
    if (response[0] && Array.isArray(response[1]) && response[1].length > 0) {
      setCities(response[1]);
    } else {
      // Fallback: Allow user to type city name manually
      // For now, show a message that cities couldn't be loaded
      console.warn("Cities API requires auth, using empty list");
      setCities([]);
    }
  };

  // Validation schemas for each step
  const step1Schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    isOtpVerified: yup.boolean().oneOf([true], "Please verify OTP"),
  });

  const step2Schema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    isEighteenPlus: yup.boolean().oneOf([true], "You must be 18+"),
    mobileNumber: yup.string().required("Mobile number is required"),
  });

  const step3Schema = yup.object({
    addressLine1: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
  });

  const step4Schema = yup.object({});

  const getValidationSchema = () => {
    switch (currentStep) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      case 4: return step4Schema;
      default: return step1Schema;
    }
  };

  const formik = useFormik<SignupFormData>({
    initialValues: {
      email: "",
      otp: ["", "", "", "", "", ""],
      isOtpSent: false,
      isOtpVerified: false,
      firstName: "",
      lastName: "",
      displayName: "",
      gender: "",
      isEighteenPlus: false,
      mobileNumber: "",
      whatsappSameAsMobile: true,
      whatsappNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      profilePicture: null,
      facebookLink: "",
      instagramLink: "",
      linkedinLink: "",
      twitterLink: "",
      websiteLink: "",
    },
    validationSchema: getValidationSchema(),
    validateOnChange: false,
    onSubmit: async () => {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        await handleFinalSubmit();
      }
    },
  });

  // Send OTP for signup
  const sendSignupOtp = async () => {
    if (!formik.values.email) {
      formik.setFieldError("email", "Email is required");
      return;
    }

    setIsLoading(true);
    const response = await ApiService.crud(
      APIDetails.registrationOTP,
      JSON.stringify({ email: formik.values.email })
    );
    setIsLoading(false);

    if (response[0]) {
      formik.setFieldValue("isOtpSent", true);
      Swal.fire({
        title: "OTP Sent!",
        text: "Check your email for the verification code",
        icon: "success",
        timer: 2000,
      });
    } else {
      Swal.fire({
        title: "Error",
        text: response[1] || "Failed to send OTP",
        icon: "error",
      });
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const otpString = formik.values.otp.join("");
    if (otpString.length !== 6) {
      Swal.fire({ title: "Error", text: "Please enter complete OTP", icon: "error" });
      return;
    }

    setIsLoading(true);
    const response = await ApiService.crud(
      APIDetails.verifyOTP,
      JSON.stringify({ email: formik.values.email, otp: otpString })
    );
    setIsLoading(false);

    if (response[0]) {
      formik.setFieldValue("isOtpVerified", true);
      Swal.fire({
        title: "Verified!",
        text: "Email verified successfully",
        icon: "success",
        timer: 1500,
      });
    } else {
      Swal.fire({
        title: "Error",
        text: response[1] || "Invalid OTP",
        icon: "error",
      });
    }
  };

  // Handle OTP input for signup
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...formik.values.otp];
    newOtp[index] = value;
    formik.setFieldValue("otp", newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !formik.values.otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Final submit - create account and profile
  const handleFinalSubmit = async () => {
    setIsLoading(true);

    try {
      // Step 1: Create user account
      const signupPayload = {
        email: formik.values.email,
        password: "TempPass123!", // Will be set via OTP login
        isJobSeeker: false,
      };

      const signupRes = await ApiService.crud(APIDetails.signup, signupPayload);

      if (!signupRes[0]) {
        throw new Error(signupRes[1] || "Failed to create account");
      }

      // Step 2: Auto-login to get JWT tokens (needed for profile creation)
      const loginRes = await ApiService.crud(APIDetails.login, {
        email: formik.values.email,
        password: "TempPass123!",
      });

      if (!loginRes[0] || !loginRes[1]?.access_token) {
        // Account created but auto-login failed
        Swal.fire({
          title: "Account Created!",
          text: "Please login with OTP to complete your profile.",
          icon: "success",
        }).then(() => {
          formik.resetForm();
          setCurrentStep(1);
          setViewMode("login");
        });
        setIsLoading(false);
        return;
      }

      // Save tokens so the profile API call is authenticated
      CookieService.SetCookies(loginRes[1]);

      // Step 3: Create user profile with corrected field names
      const profilePayload: any = {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        displayName: formik.values.displayName || `${formik.values.firstName} ${formik.values.lastName}`,
        gender: formik.values.gender,
        email: formik.values.email,
        mobile: formik.values.mobileNumber,
        phone: formik.values.whatsappSameAsMobile ? formik.values.mobileNumber : formik.values.whatsappNumber,
        addressLine1: formik.values.addressLine1,
        addressLine2: formik.values.addressLine2,
        city: formik.values.city,
        state: formik.values.state,
        zipCode: formik.values.zipCode,
      };

      // Only add social links if they are filled
      if (formik.values.facebookLink) profilePayload.facebookLink = formik.values.facebookLink;
      if (formik.values.instagramLink) profilePayload.instagram = formik.values.instagramLink;
      if (formik.values.linkedinLink) profilePayload.linkedinLink = formik.values.linkedinLink;
      if (formik.values.twitterLink) profilePayload.twitterLink = formik.values.twitterLink;
      if (formik.values.websiteLink) profilePayload.websiteLink = formik.values.websiteLink;

      const profileRes = await ApiService.crud(APIDetails.postUserProfile, profilePayload);

      if (profileRes[0]) {
        // Step 4: Re-login to get fresh tokens with isProfile=true
        const refreshLoginRes = await ApiService.crud(APIDetails.login, {
          email: formik.values.email,
          password: "TempPass123!",
        });
        if (refreshLoginRes[0] && refreshLoginRes[1]?.access_token) {
          CookieService.SetCookies(refreshLoginRes[1]);
        }

        Swal.fire({
          title: "Welcome to DesiHelpers!",
          text: "Your account and profile have been created successfully!",
          icon: "success",
          confirmButtonText: "View My Profile",
        }).then(() => {
          router.push("/profile");
        });
      } else {
        // Account created + logged in, but profile save failed
        Swal.fire({
          title: "Account Created!",
          text: "You are logged in. Please complete your profile from the profile page.",
          icon: "info",
          confirmButtonText: "Continue",
        }).then(() => {
          router.push("/profile");
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong",
        icon: "error",
      });
    }

    setIsLoading(false);
  };

  // Google/Facebook login handlers
  const googleLoginFn = () => {
    window.location.href = `${apiUrl}auth/google?redirect_uri=${apiBaseUrl}api/auth/google/callback`;
  };

  const facebookLoginFn = () => {
    window.location.href = `${apiUrl}auth/facebook?redirect_uri=${apiBaseUrl}api/auth/facebook/callback`;
  };

  // Handle Login OTP Timer
  useEffect(() => {
    if (isLoginOtpSent && loginTimer > 0) {
      loginTimerRef.current = setInterval(() => {
        setLoginTimer((prev) => prev - 1);
      }, 1000);
    } else if (loginTimer === 0 && loginTimerRef.current) {
      clearInterval(loginTimerRef.current);
    }

    return () => {
      if (loginTimerRef.current) clearInterval(loginTimerRef.current);
    };
  }, [isLoginOtpSent, loginTimer]);

  // Handle Send Login OTP
  const handleSendLoginOtp = async () => {
    if (!loginEmail) {
      Swal.fire({ title: "Error", text: "Please enter your email", icon: "error" });
      return;
    }

    const sanitizedEmail = loginEmail.trim().toLowerCase();
    setIsLoading(true);

    const res = await ApiService.crud(
      APIDetails.sendLoginOTP,
      { email: sanitizedEmail }
    );

    setIsLoading(false);
    if (res[0]) {
      setIsLoginOtpSent(true);
      setLoginTimer(59);
      setLoginOtp(["", "", "", "", "", ""]);
      Swal.fire({
        title: "OTP Sent!",
        text: "Check your email for the login code",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({ title: "Error", text: res[1] || "Failed to send OTP", icon: "error" });
    }
  };

  // Handle Login OTP Input Change
  const handleLoginOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...loginOtp];
    newOtp[index] = value;
    setLoginOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`login-otp-${index + 1}`)?.focus();
    }
  };

  const handleLoginOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !loginOtp[index] && index > 0) {
      document.getElementById(`login-otp-${index - 1}`)?.focus();
    }
  };

  // Handle Verify Login OTP
  const handleVerifyLoginOtp = async () => {
    const otpString = loginOtp.join("");
    if (otpString.length !== 6) {
      Swal.fire({ title: "Error", text: "Please enter complete OTP", icon: "error" });
      return;
    }

    const sanitizedEmail = loginEmail.trim().toLowerCase();
    setIsLoading(true);

    const loginRes = await ApiService.crud(
      APIDetails.verifyLoginOTP,
      { email: sanitizedEmail, otp: otpString }
    );

    setIsLoading(false);
    if (loginRes[0]) {
      if (loginRes[1] && loginRes[1].access_token) {
        CookieService.SetCookies(loginRes[1]);
      } else {
        Swal.fire({ title: "Login Error", text: "Invalid server response. Please try again.", icon: "error" });
        return;
      }

      Swal.fire({
        title: "Login Successful",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        router.push("/profile");
      });
    } else {
      Swal.fire({ title: "Login Failed", text: loginRes[1] || "Please try again", icon: "error" });
    }
  };

  // Render left panel (shared between signup and login)
  const renderLeftPanel = () => (
    <div className={style.signupLeftPanel}>
      {/* Hero Section with Images */}
      <div className={style.signupHeroSection}>
        {/* Background Arrow - increased size */}
        <Image
          src="/newassets/arrow.png"
          alt=""
          width={700}
          height={950}
          className={style.signupBackgroundArrow}
        />

        {/* Small green decorative arrow top left */}
        <span className={style.signupDecorGreen}>✦</span>

        {/* Small red X decoration */}
        <span className={style.signupDecorX}>✕</span>

        {/* Center design - combined handshake, dollar, arrows */}
        <Image
          src="/newassets/centerdesign.png"
          alt="Handshake"
          width={320}
          height={320}
          className={style.signupCenterDesign}
        />
      </div>

      {/* Tagline */}
      <h2 className={style.signupTagline} style={{ position: 'relative', zIndex: 10 }}>
        Connecting <span className={style.signupHighlightOrange}>Seekers</span> And{" "}
        <span className={style.signupHighlightGreen}>Providers</span> In<br />
        ONE Trusted DESI Community<br />
        Platform.
      </h2>

      {/* Description */}
      <p className={style.signupDescription}>
        A trusted space where families and friends can easily find help, share
        services, and support each other—just like asking a neighbors back home,
        but online this time.
      </p>

      {/* Stats */}
      <div className={style.signupStats}>
        <div className={style.signupStatItem}>
          <span className={style.signupStatNumber}>200+</span>
          <span className={style.signupStatLabel}>Daily Visitors</span>
        </div>
        <div className={style.signupStatDivider}></div>
        <div className={style.signupStatItem}>
          <span className={style.signupStatNumber}>1200+</span>
          <span className={style.signupStatLabel}>Number of members</span>
        </div>
      </div>
    </div>
  );

  // Render progress bar
  const renderProgressBar = () => (
    <div className={style.progressBarContainer}>
      <div
        className={style.progressBar}
        style={{ width: `${(currentStep / 4) * 100}%` }}
      />
    </div>
  );

  // Render Step 1 - Create Account
  const renderStep1 = () => (
    <div className={style.stepContent}>
      <h3 className={style.stepTitle}>Create Account</h3>

      {/* Social Login */}
      <div className={style.signupSocialButtons}>
        <button type="button" onClick={googleLoginFn} className={style.socialButton}>
          <Image src="/assets/icons/icon_google-logo.svg" alt="Google" width={20} height={20} />
          Create with Google
        </button>
        <button type="button" onClick={facebookLoginFn} className={style.socialButton}>
          <Image src="/assets/icons/icon_facebook_logo.svg" alt="Facebook" width={20} height={20} />
          Create with Facebook
        </button>
      </div>

      <div className={style.dividerWithText}>
        <span>OR</span>
      </div>

      {/* Email Input */}
      <div className={style.formGroup}>
        <label className={style.formLabel}>
          Email ID <span className={style.required}>*</span>
        </label>
        <div className={style.inputWithButton}>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="Enter email ID"
            className={style.formInput}
            disabled={formik.values.isOtpVerified}
          />
          {!formik.values.isOtpVerified && (
            <button
              type="button"
              onClick={sendSignupOtp}
              className={style.verifyButton}
              disabled={isLoading || !formik.values.email}
            >
              {formik.values.isOtpSent ? "RESEND" : "VERIFY"}
            </button>
          )}
          {formik.values.isOtpVerified && (
            <span className={style.verifiedBadge}>✓ Verified</span>
          )}
        </div>
        {formik.errors.email && <span className={style.errorText}>{formik.errors.email}</span>}
      </div>

      {/* OTP Input */}
      {formik.values.isOtpSent && !formik.values.isOtpVerified && (
        <>
          <p className={style.otpHint}>Click on Verify to receive OTP on your email</p>
          <div className={style.signupOtpInputs}>
            {formik.values.otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className={style.signupOtpInput}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={verifyOtp}
            className={style.verifyOtpButton}
            disabled={isLoading}
          >
            Verify OTP
          </button>
        </>
      )}

      {/* Sign Up Button */}
      <button
        type="submit"
        className={style.signupButton}
        disabled={!formik.values.isOtpVerified || isLoading}
      >
        Sign Up
      </button>

      <p className={style.switchModeText}>
        Already have an account?{" "}
        <button type="button" onClick={() => setViewMode("login")} className={style.linkButton}>
          Login
        </button>
      </p>
    </div>
  );

  // Render Step 2 - Build Your Profile
  const renderStep2 = () => (
    <div className={style.stepContent}>
      <h3 className={style.stepTitle}>Build Your Profile</h3>
      <p className={style.stepSubtitle}>Enter below details to personalize your experience.</p>

      <div className={style.formRow}>
        <div className={style.formGroup}>
          <label className={style.formLabel}>First name <span className={style.required}>*</span></label>
          <input
            type="text"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            placeholder="Enter first name"
            className={style.formInput}
          />
          {formik.errors.firstName && <span className={style.errorText}>{formik.errors.firstName}</span>}
        </div>
        <div className={style.formGroup}>
          <label className={style.formLabel}>Last name <span className={style.required}>*</span></label>
          <input
            type="text"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            placeholder="Enter last name"
            className={style.formInput}
          />
          {formik.errors.lastName && <span className={style.errorText}>{formik.errors.lastName}</span>}
        </div>
      </div>

      <div className={style.formRow}>
        <div className={style.formGroup}>
          <label className={style.formLabel}>Display name</label>
          <input
            type="text"
            name="displayName"
            value={formik.values.displayName}
            onChange={formik.handleChange}
            placeholder="Enter display name"
            className={style.formInput}
          />
        </div>
        <div className={style.formGroup}>
          <label className={style.formLabel}>Gender</label>
          <select
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            className={style.formSelect}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className={style.checkboxGroup}>
        <input
          type="checkbox"
          id="isEighteenPlus"
          name="isEighteenPlus"
          checked={formik.values.isEighteenPlus}
          onChange={formik.handleChange}
          className={style.checkbox}
        />
        <label htmlFor="isEighteenPlus" className={style.checkboxLabel}>
          I am 18 years or older
        </label>
      </div>
      {formik.errors.isEighteenPlus && <span className={style.errorText}>{formik.errors.isEighteenPlus}</span>}

      <div className={style.formRow}>
        <div className={style.formGroup}>
          <label className={style.formLabel}>Email ID <span className={style.required}>*</span></label>
          <input
            type="email"
            value={formik.values.email}
            className={style.formInput}
            disabled
          />
        </div>
        <div className={style.formGroup}>
          <label className={style.formLabel}>Mobile number <span className={style.required}>*</span></label>
          <input
            type="tel"
            name="mobileNumber"
            value={formik.values.mobileNumber}
            onChange={formik.handleChange}
            placeholder="Enter mobile number"
            className={style.formInput}
          />
          {formik.errors.mobileNumber && <span className={style.errorText}>{formik.errors.mobileNumber}</span>}
        </div>
      </div>

      <div className={style.checkboxGroup}>
        <input
          type="checkbox"
          id="whatsappSameAsMobile"
          name="whatsappSameAsMobile"
          checked={formik.values.whatsappSameAsMobile}
          onChange={formik.handleChange}
          className={style.checkbox}
        />
        <label htmlFor="whatsappSameAsMobile" className={style.checkboxLabel}>
          WhatsApp number same as mobile no
        </label>
      </div>

      {!formik.values.whatsappSameAsMobile && (
        <div className={style.formGroup}>
          <label className={style.formLabel}>WhatsApp number</label>
          <input
            type="tel"
            name="whatsappNumber"
            value={formik.values.whatsappNumber}
            onChange={formik.handleChange}
            placeholder="Enter WhatsApp Number"
            className={style.formInput}
          />
        </div>
      )}

      <div className={style.stepButtons}>
        <button type="submit" className={style.signupButton} disabled={isLoading}>
          Next
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={style.backButton}
        >
          Back
        </button>
      </div>
    </div>
  );

  // Render Step 3 - Address Details
  const renderStep3 = () => (
    <div className={style.stepContent}>
      <h3 className={style.stepTitle}>Address details</h3>
      <p className={style.stepSubtitle}>Enter below details for verification and contact.</p>

      <div className={style.formGroup}>
        <label className={style.formLabel}>Address Line 1 <span className={style.required}>*</span></label>
        <input
          type="text"
          name="addressLine1"
          value={formik.values.addressLine1}
          onChange={formik.handleChange}
          placeholder="Enter"
          className={style.formInput}
        />
        {formik.errors.addressLine1 && <span className={style.errorText}>{formik.errors.addressLine1}</span>}
      </div>

      <div className={style.formGroup}>
        <label className={style.formLabel}>Address Line 2</label>
        <input
          type="text"
          name="addressLine2"
          value={formik.values.addressLine2}
          onChange={formik.handleChange}
          placeholder="Enter"
          className={style.formInput}
        />
      </div>

      <div className={style.formRow}>
        <div className={style.formGroup}>
          <label className={style.formLabel}>State <span className={style.required}>*</span></label>
          <select
            name="state"
            value={formik.values.state}
            onChange={formik.handleChange}
            className={style.formSelect}
          >
            <option value="">Select State</option>
            {states.map((state: any) => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          {formik.errors.state && <span className={style.errorText}>{formik.errors.state}</span>}
        </div>
        <div className={style.formGroup}>
          <label className={style.formLabel}>City <span className={style.required}>*</span></label>
          <input
            type="text"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            placeholder="Enter your city"
            className={style.formInput}
          />
          {formik.errors.city && <span className={style.errorText}>{formik.errors.city}</span>}
        </div>
      </div>

      <div className={style.formGroup}>
        <label className={style.formLabel}>Zip Code</label>
        <input
          type="text"
          name="zipCode"
          value={formik.values.zipCode}
          onChange={formik.handleChange}
          placeholder="Enter"
          className={style.formInput}
        />
      </div>

      <div className={style.stepButtons}>
        <button type="submit" className={style.signupButton} disabled={isLoading}>
          Next
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className={style.backButton}
        >
          Back
        </button>
      </div>
    </div>
  );

  // Render Step 4 - Social Details
  const renderStep4 = () => (
    <div className={style.stepContent}>
      <h3 className={style.stepTitle}>Social details</h3>
      <p className={style.stepSubtitle}>Enter below details to connect your social profiles.</p>

      {/* Profile Picture Upload */}
      <div className={style.formGroup}>
        <label className={style.formLabel}>Profile Picture</label>
        <p className={style.uploadHint}>Add your photo to build trust and attract more opportunities – profiles with pictures get hired faster!</p>
        <div className={style.uploadArea}>
          <div className={style.uploadIcon}>📷</div>
          <p>Drag and drop your photo here, or <span className={style.browseLink}>browse</span></p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                formik.setFieldValue("profilePicture", e.target.files[0]);
              }
            }}
            className={style.fileInput}
          />
        </div>
      </div>

      <div className={style.formRow}>
        <div className={style.formGroup}>
          <label className={style.formLabel}>
            <Image src="/assets/icons/icon_facebook.svg" alt="" width={16} height={16} />
            Facebook Link
          </label>
          <input
            type="url"
            name="facebookLink"
            value={formik.values.facebookLink}
            onChange={formik.handleChange}
            placeholder="Enter"
            className={style.formInput}
          />
        </div>
        <div className={style.formGroup}>
          <label className={style.formLabel}>
            <Image src="/assets/icons/icon_instagram.svg" alt="" width={16} height={16} />
            Instagram Link
          </label>
          <input
            type="url"
            name="instagramLink"
            value={formik.values.instagramLink}
            onChange={formik.handleChange}
            placeholder="Enter"
            className={style.formInput}
          />
        </div>
      </div>

      <div className={style.formRow}>
        <div className={style.formGroup}>
          <label className={style.formLabel}>
            <Image src="/assets/icons/icon_linkedin.svg" alt="" width={16} height={16} />
            LinkedIn Link
          </label>
          <input
            type="url"
            name="linkedinLink"
            value={formik.values.linkedinLink}
            onChange={formik.handleChange}
            placeholder="Enter"
            className={style.formInput}
          />
        </div>
        <div className={style.formGroup}>
          <label className={style.formLabel}>
            <Image src="/assets/icons/icon_twitter.svg" alt="" width={16} height={16} />
            Twitter Link
          </label>
          <input
            type="url"
            name="twitterLink"
            value={formik.values.twitterLink}
            onChange={formik.handleChange}
            placeholder="Enter"
            className={style.formInput}
          />
        </div>
      </div>

      <div className={style.formGroup}>
        <label className={style.formLabel}>
          🌐 Website Link
        </label>
        <input
          type="url"
          name="websiteLink"
          value={formik.values.websiteLink}
          onChange={formik.handleChange}
          placeholder="Enter"
          className={style.formInput}
        />
      </div>

      <div className={style.stepButtons}>
        <button type="submit" className={style.signupButton} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className={style.backButton}
        >
          Back
        </button>
      </div>
    </div>
  );

  // Render Login View
  const renderLoginView = () => (
    <div className={style.signupContainer}>
      {renderLeftPanel()}
      <div className={style.signupRightPanel}>
        <div className={style.signupFormContainer}>
          <button className={style.closeButton} onClick={() => router.push("/Landing")}>
            ✕
          </button>

          <h2 className={style.signupTitle} style={{ textAlign: 'center' }}>
            {isLoginOtpSent ? "OTP Verification" : "Log In"}
          </h2>

          <div className={style.stepContent}>
            {!isLoginOtpSent ? (
              <p className={style.stepSubtitle} style={{ textAlign: "center", marginBottom: "30px" }}>
                Enter below details to login your account.
              </p>
            ) : (
              <p className={style.stepSubtitle} style={{ textAlign: "center", marginBottom: "30px", marginTop: "10px" }}>
                We have sent OTP to your email{" "}
                <strong>{loginEmail}</strong>
              </p>
            )}

            {!isLoginOtpSent && (
              <div className={style.formGroup}>
                <label className={style.formLabel}>Email ID <span className={style.required}>*</span></label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter email ID"
                  className={style.formInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendLoginOtp();
                  }}
                />
              </div>
            )}

            {isLoginOtpSent && (
              <div style={{ textAlign: 'center' }}>
                <div className={style.signupOtpInputs} style={{ justifyContent: 'center', marginBottom: '15px' }}>
                  {loginOtp.map((digit, index) => (
                    <input
                      key={`login-otp-${index}`}
                      id={`login-otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleLoginOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleLoginOtpKeyDown(index, e)}
                      className={style.signupOtpInput}
                      style={{ margin: '0 4px', width: '45px', height: '45px', textAlign: 'center', fontSize: '18px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  ))}
                </div>

                <div style={{ marginBottom: '24px', fontSize: '12px', color: '#666' }}>
                  <p style={{ margin: '0 0 5px 0' }}>00:{loginTimer < 10 ? `0${loginTimer}` : loginTimer}</p>
                  <p style={{ margin: 0 }}>
                    Didn't receive OTP?{' '}
                    <button
                      type="button"
                      onClick={handleSendLoginOtp}
                      disabled={loginTimer > 0 || isLoading}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: loginTimer > 0 ? '#aaa' : '#f07c00',
                        cursor: loginTimer > 0 ? 'default' : 'pointer',
                        fontWeight: '500',
                        padding: 0
                      }}
                    >
                      Resend Again
                    </button>
                  </p>
                </div>
              </div>
            )}

            {!isLoginOtpSent ? (
              <button
                onClick={handleSendLoginOtp}
                className={style.signupButton}
                disabled={isLoading || !loginEmail}
                style={{ marginTop: '16px' }}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <button
                onClick={handleVerifyLoginOtp}
                className={style.signupButton}
                disabled={isLoading || loginOtp.join('').length !== 6 || loginTimer === 0}
                style={{
                  marginTop: '0px',
                  backgroundColor: (loginOtp.join('').length === 6 && loginTimer > 0) ? '#f07c00' : '#888',
                  boxShadow: 'none',
                  border: 'none',
                  color: '#fff',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '24px',
                  fontWeight: '600'
                }}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            )}

            <div className={style.dividerWithText} style={{ marginTop: '30px', marginBottom: '10px' }}>
              <span>OR</span>
            </div>

            <div className={style.signupSocialButtons}>
              <button type="button" onClick={googleLoginFn} className={style.socialButton}>
                <Image src="/assets/icons/icon_google-logo.svg" alt="Google" width={20} height={20} />
                Log in with Google
              </button>
              <button type="button" onClick={facebookLoginFn} className={style.socialButton}>
                <Image src="/assets/icons/icon_facebook_logo.svg" alt="Facebook" width={20} height={20} />
                Log in with Facebook
              </button>
            </div>

            <p className={style.switchModeText} style={{ marginTop: '20px' }}>
              Don't have an account?{" "}
              <button type="button" onClick={() => setViewMode("signup")} className={style.linkButton}>
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Signup View with Steps
  const renderSignupView = () => (
    <div className={style.signupContainer}>
      {renderLeftPanel()}
      <div className={style.signupRightPanel}>
        <div className={style.signupFormContainer}>
          <button className={style.closeButton} onClick={() => router.push("/Landing")}>
            ✕
          </button>

          <h2 className={style.signupTitle}>Sign up</h2>
          {renderProgressBar()}
          <p className={style.stepIndicator}>Step {currentStep}/4</p>

          <form onSubmit={formik.handleSubmit} className={style.signupForm}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </form>
        </div>
      </div>
    </div>
  );

  return viewMode === "login" ? renderLoginView() : renderSignupView();
};

export default Login;
