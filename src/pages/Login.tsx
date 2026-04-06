import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Image from "next/image";
import { useRouter } from "next/router";
import style from "@/styles/Common.module.css";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import CookieService from "@/services/authorization/CookieService";
import Radar from "radar-sdk-js";
import { toast } from "react-toastify";
import base64url from "base64url";

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
  listProfileAs: string;
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
  const [loginEmailError, setLoginEmailError] = useState("");
  const [isLoginOtpSent, setIsLoginOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState(["", "", "", "", "", ""]);
  const [loginTimer, setLoginTimer] = useState(59);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const loginTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup profile preview URL
  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [profilePreview]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiBaseUrl = process.env.NEXT_PUBLIC_Base_API_URL;

  // Address autocomplete state (Radar SDK)
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const addressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addressWrapperRef = useRef<HTMLDivElement>(null);
  const radarInitRef = useRef(false);

  // Fetch states on component mount, init Radar, and check query params
  useEffect(() => {
    fetchStates();
    // Initialize Radar SDK for address autocomplete
    if (!radarInitRef.current) {
      Radar.initialize(process.env.NEXT_PUBLIC_RADAR_API_KEY || "");
      radarInitRef.current = true;
    }
    if (router.query.mode === "signup") {
      setViewMode("signup");
      setCurrentStep(1);
    }
  }, [router.query.mode]);

  // Close address suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addressWrapperRef.current && !addressWrapperRef.current.contains(e.target as Node)) {
        setShowAddressSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Helper: validate login email
  const validateLoginEmail = (value: string): string => {
    if (!value.trim()) return "Please enter your email address";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value.trim())) return "Please enter a valid email address (e.g., name@example.com)";
    return "";
  };

  // Validation schemas for each step
  const step1Schema = yup.object({
    email: yup.string()
      .trim()
      .required("Email address is required to create your account")
      .email("Please enter a valid email address (e.g., name@example.com)")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address (e.g., name@example.com)"
      ),
    isOtpVerified: yup.boolean().oneOf([true], "Please verify your email with the OTP sent to your inbox"),
  });

  const step2Schema = yup.object({
    firstName: yup.string()
      .trim()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name cannot exceed 50 characters")
      .matches(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes"),
    lastName: yup.string()
      .trim()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters")
      .matches(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes"),
    displayName: yup.string()
      .max(50, "Display name cannot exceed 50 characters"),
    isEighteenPlus: yup.boolean().oneOf([true], "You must confirm that you are 18 years or older to continue"),
    mobileNumber: yup.string()
      .required("Mobile number is required")
      .matches(/^[0-9+\-()\s]+$/, "Mobile number can only contain digits, +, -, (, ) and spaces")
      .min(10, "Mobile number must be at least 10 digits")
      .max(15, "Mobile number cannot exceed 15 digits"),
  });

  const step3Schema = yup.object({
    addressLine1: yup.string()
      .trim()
      .required("Address line 1 is required")
      .min(5, "Please enter a complete street address")
      .max(200, "Address is too long"),
    city: yup.string()
      .trim()
      .required("City is required")
      .min(2, "City name must be at least 2 characters"),
    state: yup.string()
      .required("Please select your state"),
    zipCode: yup.string()
      .matches(/^[0-9]{5}(-[0-9]{4})?$|^$/, "Please enter a valid US zip code (e.g., 98052 or 98052-1234)"),
  });

  const urlValidation = yup.string().url("Please enter a valid URL (e.g., https://example.com)");
  const step4Schema = yup.object({
    profilePicture: yup.mixed().nullable().notRequired()
      .test("fileSize", "File size must be less than 5MB", (value) => {
        if (!value) return true; // Optional file
        return (value as File).size <= 5 * 1024 * 1024;
      })
      .test("fileFormat", "Unsupported Format. Only JPEG, PNG, and WebP are allowed", (value) => {
        if (!value) return true;
        const supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
        return supportedFormats.includes((value as File).type);
      }),
    facebookLink: urlValidation,
    instagramLink: urlValidation,
    linkedinLink: urlValidation,
    twitterLink: urlValidation,
    websiteLink: urlValidation,
  });

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
      listProfileAs: "Both",
    },
    validationSchema: getValidationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
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
    const emailVal = formik.values.email.trim();
    if (!emailVal) {
      formik.setFieldError("email", "Email address is required to create your account");
      formik.setFieldTouched("email", true, false);
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailVal)) {
      formik.setFieldError("email", "Please enter a valid email address (e.g., name@example.com)");
      formik.setFieldTouched("email", true, false);
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
      toast.success("OTP sent! Check your email");
    } else {
      toast.error(response[1] || "Failed to send OTP");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const otpString = formik.values.otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP");
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
      toast.success("Email verified successfully!");
    } else {
      toast.error(response[1] || "Invalid OTP");
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
        isJobSeeker: formik.values.listProfileAs !== "Job Seeker",
        listProfileAs: formik.values.listProfileAs,
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
        toast.info("Account Created! Please login with OTP to complete your profile.", { autoClose: 5000 });
        formik.resetForm();
        setCurrentStep(1);
        setViewMode("login");
        setIsLoading(false);
        return;
      }

      // Save tokens so the profile API call is authenticated
      CookieService.SetCookies(loginRes[1]);

      // Extract userId from access_token
      const token = loginRes[1].access_token;
      const payloadStr = base64url.decode(token.split('.')[1]);
      const jwtPayload = JSON.parse(payloadStr);
      const userId = jwtPayload.id || jwtPayload._id || jwtPayload.sub;

      // Step 3: Create user profile with corrected field names
      const profilePayload: any = {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        displayName: formik.values.displayName || `${formik.values.firstName} ${formik.values.lastName}`,
        gender: formik.values.gender,
        email: formik.values.email,
        phone: formik.values.mobileNumber,
        mobile: formik.values.whatsappSameAsMobile ? formik.values.mobileNumber : formik.values.whatsappNumber,
        addressLine1: formik.values.addressLine1,
        addressLine2: formik.values.addressLine2,
        city: formik.values.city,
        state: formik.values.state,
        zipCode: formik.values.zipCode,
        profilePhoto: "", // Will be set after upload
        listProfileAs: formik.values.listProfileAs,
      };

      // Only add social links if they are filled
      if (formik.values.facebookLink) profilePayload.facebookLink = formik.values.facebookLink;
      if (formik.values.instagramLink) profilePayload.instagram = formik.values.instagramLink;
      if (formik.values.linkedinLink) profilePayload.linkedinLink = formik.values.linkedinLink;
      if (formik.values.twitterLink) profilePayload.twitterLink = formik.values.twitterLink;
      if (formik.values.websiteLink) profilePayload.websiteLink = formik.values.websiteLink;

      const profileRes = await ApiService.crud(APIDetails.postUserProfile, profilePayload);

      if (profileRes[0]) {
        // Step 3a: Upload profile picture AFTER profile is created
        // Uses the same endpoint as the profile page — this both uploads to S3
        // AND updates the profilePhoto field on the DB document atomically
        let signedPhotoUrl = "";
        if (formik.values.profilePicture && userId) {
          try {
            const formData = new FormData();
            formData.append('file', formik.values.profilePicture);

            const uploadResponse = await fetch(`${apiUrl}user-profile/upload/${userId}/profilePhotos`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${loginRes[1].access_token}`
              },
              body: formData
            });

            if (uploadResponse.ok) {
              const uploadResult = await uploadResponse.json();
              // Backend returns { message: 'true', urls: UserProfile } where UserProfile has profilePhoto
              const photoUrl = uploadResult.urls?.profilePhoto
                || (Array.isArray(uploadResult.urls) ? uploadResult.urls[0] : null)
                || uploadResult.profilePhoto;

              if (photoUrl) {
                // Sign the URL for immediate display (same approach as profile page)
                const { getWorkPhotoUrls } = await import("@/utils/s3Helper");
                const signedUrls = await getWorkPhotoUrls("", [photoUrl]);
                signedPhotoUrl = signedUrls.length > 0 ? signedUrls[0] : photoUrl;
                profilePayload.profilePhoto = photoUrl;
              }
            } else {
              console.error("Profile photo upload failed with status:", uploadResponse.status);
            }
          } catch (uploadError) {
            console.error("Profile photo upload failed:", uploadError);
            // Continue anyway — account and profile are created, photo can be added later
          }
        }

        // Update local store with the profile data including the photo
        const { userProfileStore } = await import("@/stores/UserProfileStore");
        userProfileStore.getState().setUserProfile({
          ...profilePayload,
          profilePhoto: profilePayload.profilePhoto || ""
        });

        // Step 4: Re-login to get fresh tokens with isProfile=true
        const refreshLoginRes = await ApiService.crud(APIDetails.login, {
          email: formik.values.email,
          password: "TempPass123!",
        });
        if (refreshLoginRes[0] && refreshLoginRes[1]?.access_token) {
          CookieService.SetCookies(refreshLoginRes[1]);
        }

        toast.success("Welcome to DesiHelpers! Your account and profile have been created successfully.");
        router.push("/profile");
      } else {
        // Account created + logged in, but profile save failed
        toast.info("Account Created! You are logged in. Please complete your profile from the profile page.");
        router.push("/profile");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
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
    const err = validateLoginEmail(loginEmail);
    if (err) {
      setLoginEmailError(err);
      return;
    }
    setLoginEmailError("");

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
      toast.success("OTP sent! Check your email");
    } else {
      toast.error(res[1] || "Failed to send OTP");
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

    // Auto-verify when 6th digit is entered
    if (value && index === 5) {
      handleVerifyLoginOtp(newOtp.join(""));
    }
  };

  const handleLoginOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !loginOtp[index] && index > 0) {
      document.getElementById(`login-otp-${index - 1}`)?.focus();
    } else if (e.key === 'Enter') {
      handleVerifyLoginOtp();
    }
  };

  // Handle Verify Login OTP
  const handleVerifyLoginOtp = async (providedOtp?: string) => {
    if (isLoading) return;

    const otpString = providedOtp || loginOtp.join("");
    if (otpString.length !== 6) {
      // Only show error toast if the user explicitly clicked the button (no providedOtp)
      if (!providedOtp) toast.error("Please enter complete OTP");
      return;
    }

    if (loginTimer === 0 && !providedOtp) {
      toast.error("OTP expired. Please resend.");
      return;
    }

    const sanitizedEmail = loginEmail.trim().toLowerCase();
    setIsLoading(true);

    try {
      const loginRes = await ApiService.crud(
        APIDetails.verifyLoginOTP,
        { email: sanitizedEmail, otp: otpString }
      );

      setIsLoading(false);
      if (loginRes[0]) {
        if (loginRes[1] && loginRes[1].access_token) {
          CookieService.SetCookies(loginRes[1]);
        } else {
          toast.error("Invalid server response. Please try again.");
          return;
        }

        toast.success("Login successful!");
        setTimeout(() => router.push("/profile"), 500);
      } else {
        toast.error(loginRes[1] || "Please try again");
      }
    } catch (err) {
      setIsLoading(false);
      toast.error("An unexpected error occurred. Please try again.");
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
            onBlur={formik.handleBlur}
            placeholder="Enter email ID"
            className={`${style.formInput} ${formik.touched.email && formik.errors.email ? style.formInputError : ''}`}
            disabled={formik.values.isOtpVerified}
          />
          {!formik.values.isOtpVerified && (
            <button
              type="button"
              onClick={sendSignupOtp}
              className={style.verifyButton}
              disabled={isLoading || !formik.values.email}
            >
              {formik.values.isOtpSent ? "Resend OTP" : "Send OTP"}
            </button>
          )}
          {formik.values.isOtpVerified && (
            <span className={style.verifiedBadge}>✓ Verified</span>
          )}
        </div>
        {formik.touched.email && formik.errors.email && <span className={style.errorText}>{formik.errors.email}</span>}
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
            onBlur={formik.handleBlur}
            placeholder="Enter first name"
            className={`${style.formInput} ${formik.touched.firstName && formik.errors.firstName ? style.formInputError : ''}`}
          />
          {formik.touched.firstName && formik.errors.firstName && <span className={style.errorText}>{formik.errors.firstName}</span>}
        </div>
        <div className={style.formGroup}>
          <label className={style.formLabel}>Last name <span className={style.required}>*</span></label>
          <input
            type="text"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter last name"
            className={`${style.formInput} ${formik.touched.lastName && formik.errors.lastName ? style.formInputError : ''}`}
          />
          {formik.touched.lastName && formik.errors.lastName && <span className={style.errorText}>{formik.errors.lastName}</span>}
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
            onBlur={formik.handleBlur}
            placeholder="Enter display name"
            className={`${style.formInput} ${formik.touched.displayName && formik.errors.displayName ? style.formInputError : ''}`}
          />
          {formik.touched.displayName && formik.errors.displayName && <span className={style.errorText}>{formik.errors.displayName}</span>}
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
      {formik.touched.isEighteenPlus && formik.errors.isEighteenPlus && <span className={style.errorText}>{formik.errors.isEighteenPlus}</span>}

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
            onBlur={formik.handleBlur}
            placeholder="Enter mobile number"
            className={`${style.formInput} ${formik.touched.mobileNumber && formik.errors.mobileNumber ? style.formInputError : ''}`}
          />
          {formik.touched.mobileNumber && formik.errors.mobileNumber && <span className={style.errorText}>{formik.errors.mobileNumber}</span>}
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
  const renderStep3 = () => {
    // Debounced Radar autocomplete for address
    const handleAddressInput = (query: string) => {
      formik.setFieldValue('addressLine1', query);
      if (addressTimerRef.current) clearTimeout(addressTimerRef.current);
      if (!query || query.length < 3) {
        setAddressSuggestions([]);
        setShowAddressSuggestions(false);
        return;
      }
      addressTimerRef.current = setTimeout(() => {
        Radar.autocomplete({
          query,
          limit: 6,
          layers: ['address'],
        }).then((result: any) => {
          setAddressSuggestions(result.addresses || []);
          setShowAddressSuggestions(true);
        }).catch(() => {
          setAddressSuggestions([]);
        });
      }, 300);
    };

    // Handle selecting an address suggestion — auto-fill city, state, zip
    const handleAddressSelect = (address: any) => {
      // Extract ONLY street address (number + street), not full formatted address
      const streetNumber = address.number || '';
      const street = address.street || '';
      let streetAddress = '';
      if (streetNumber && street) {
        streetAddress = `${streetNumber} ${street}`;
      } else if (street) {
        streetAddress = street;
      } else {
        // Fallback: strip city, state, zip, country from the formatted address
        let raw = address.addressLabel || address.formattedAddress || '';
        const addrCity = address.city || address.borough || '';
        const addrState = address.state || address.stateCode || '';
        const addrZip = address.postalCode || '';
        const addrCountry = address.country || address.countryCode || '';
        [addrCity, addrState, addrZip, addrCountry, 'US', 'USA'].forEach(part => {
          if (part) {
            raw = raw.replace(new RegExp(`[,\\s]*\\b${part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[,\\s]*`, 'gi'), ' ');
          }
        });
        streetAddress = raw.replace(/,\s*$/, '').replace(/^\s*,/, '').trim();
      }
      formik.setFieldValue('addressLine1', streetAddress);

      // Auto-fill city
      const city = address.city || address.borough || '';
      if (city) formik.setFieldValue('city', city);

      // Auto-fill state — match against our states list
      const stateCode = address.stateCode || address.state || '';
      if (stateCode) {
        // Try to find matching state in our list
        const matchedState = states.find((s: any) =>
          s.id === stateCode ||
          s.name?.toLowerCase() === stateCode.toLowerCase() ||
          s.id?.toLowerCase() === stateCode.toLowerCase()
        );
        if (matchedState) {
          formik.setFieldValue('state', matchedState.id);
        } else {
          formik.setFieldValue('state', stateCode);
        }
      }

      // Auto-fill zip code
      const zip = address.postalCode || '';
      if (zip) formik.setFieldValue('zipCode', zip);

      setShowAddressSuggestions(false);
      setAddressSuggestions([]);
    };

    return (
      <div className={style.stepContent}>
        <h3 className={style.stepTitle}>Address details</h3>
        <p className={style.stepSubtitle}>Enter below details for verification and contact.</p>

        <div className={style.formGroup} ref={addressWrapperRef} style={{ position: 'relative' }}>
          <label className={style.formLabel}>Address Line 1 <span className={style.required}>*</span></label>
          <input
            type="text"
            name="addressLine1"
            value={formik.values.addressLine1}
            onChange={(e) => handleAddressInput(e.target.value)}
            onBlur={formik.handleBlur}
            onFocus={() => { if (addressSuggestions.length > 0) setShowAddressSuggestions(true); }}
            placeholder="Start typing your street address..."
            className={`${style.formInput} ${formik.touched.addressLine1 && formik.errors.addressLine1 ? style.formInputError : ''}`}
            autoComplete="off"
          />
          {/* Address autocomplete dropdown */}
          {showAddressSuggestions && addressSuggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
              background: '#fff', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              border: '1px solid #e0e0e0', maxHeight: '220px', overflowY: 'auto',
            }}>
              {addressSuggestions.map((addr: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => handleAddressSelect(addr)}
                  style={{
                    padding: '10px 14px', cursor: 'pointer', fontSize: '14px',
                    borderBottom: idx < addressSuggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f07c00" stroke="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 500 }}>{addr.formattedAddress || addr.addressLabel || ''}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {addr.city || addr.borough || ''}{addr.stateCode ? `, ${addr.stateCode}` : ''} {addr.postalCode || ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {formik.touched.addressLine1 && formik.errors.addressLine1 && <span className={style.errorText}>{formik.errors.addressLine1}</span>}
        </div>

        <div className={style.formGroup}>
          <label className={style.formLabel}>Address Line 2</label>
          <input
            type="text"
            name="addressLine2"
            value={formik.values.addressLine2}
            onChange={formik.handleChange}
            placeholder="Apartment, suite, unit, etc. (optional)"
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
              onBlur={formik.handleBlur}
              className={`${style.formSelect} ${formik.touched.state && formik.errors.state ? style.formInputError : ''}`}
            >
              <option value="">Select State</option>
              {states.map((state: any) => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
            {formik.touched.state && formik.errors.state && <span className={style.errorText}>{formik.errors.state}</span>}
          </div>
          <div className={style.formGroup}>
            <label className={style.formLabel}>City <span className={style.required}>*</span></label>
            <input
              type="text"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your city"
              className={`${style.formInput} ${formik.touched.city && formik.errors.city ? style.formInputError : ''}`}
            />
            {formik.touched.city && formik.errors.city && <span className={style.errorText}>{formik.errors.city}</span>}
          </div>
        </div>

        <div className={style.formGroup}>
          <label className={style.formLabel}>Zip Code</label>
          <input
            type="text"
            name="zipCode"
            value={formik.values.zipCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g., 98052"
            className={`${style.formInput} ${formik.touched.zipCode && formik.errors.zipCode ? style.formInputError : ''}`}
          />
          {formik.touched.zipCode && formik.errors.zipCode && <span className={style.errorText}>{formik.errors.zipCode}</span>}
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
  };

  // Render Step 4 - Social Details
  const renderStep4 = () => (
    <div className={style.stepContent}>
      <h3 className={style.stepTitle}>Social details & Visibility</h3>
      <p className={style.stepSubtitle}>Enter below details to connect your social profiles and define your account.</p>

      {/* Profile Picture Upload */}
      <div className={style.formGroup}>
        <label className={style.formLabel}>Profile Picture</label>
        <p className={style.uploadHint}>Add your photo to build trust and attract more opportunities – max 5MB (JPEG, PNG). Profiles with pictures get hired faster!</p>
        <div className={style.uploadArea} style={{ borderColor: formik.touched.profilePicture && formik.errors.profilePicture ? '#d32f2f' : '#ccc', minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {profilePreview ? (
            <div style={{ position: 'relative', width: '130px', height: '130px' }}>
              <img
                src={profilePreview}
                alt="Profile Preview"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid #00b67a' }}
              />
              <div style={{ position: 'absolute', bottom: '0px', right: '0px', backgroundColor: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '1px solid #eee' }}>
                <img src="/assets/icons/form_icons/icon_edit_photo.svg" alt="Edit" style={{ width: '22px', height: '22px' }} />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div className={style.uploadIcon} style={{ fontSize: '40px', marginBottom: '10px' }}>📷</div>
              <p style={{ margin: 0 }}>
                Drag and drop your photo here, or <span className={style.browseLink}>browse</span>
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                const file = e.target.files[0];
                formik.setFieldValue("profilePicture", file);
                setProfilePreview(URL.createObjectURL(file));
              }
            }}
            className={style.fileInput}
          />
        </div>
        {formik.touched.profilePicture && formik.errors.profilePicture && (
          <span className={style.errorText}>{formik.errors.profilePicture as string}</span>
        )}
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
            onBlur={formik.handleBlur}
            placeholder="https://facebook.com/yourprofile"
            className={`${style.formInput} ${formik.touched.facebookLink && formik.errors.facebookLink ? style.formInputError : ''}`}
          />
          {formik.touched.facebookLink && formik.errors.facebookLink && <span className={style.errorText}>{formik.errors.facebookLink}</span>}
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
            onBlur={formik.handleBlur}
            placeholder="https://instagram.com/yourprofile"
            className={`${style.formInput} ${formik.touched.instagramLink && formik.errors.instagramLink ? style.formInputError : ''}`}
          />
          {formik.touched.instagramLink && formik.errors.instagramLink && <span className={style.errorText}>{formik.errors.instagramLink}</span>}
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
            onBlur={formik.handleBlur}
            placeholder="https://linkedin.com/in/yourprofile"
            className={`${style.formInput} ${formik.touched.linkedinLink && formik.errors.linkedinLink ? style.formInputError : ''}`}
          />
          {formik.touched.linkedinLink && formik.errors.linkedinLink && <span className={style.errorText}>{formik.errors.linkedinLink}</span>}
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
            onBlur={formik.handleBlur}
            placeholder="https://twitter.com/yourprofile"
            className={`${style.formInput} ${formik.touched.twitterLink && formik.errors.twitterLink ? style.formInputError : ''}`}
          />
          {formik.touched.twitterLink && formik.errors.twitterLink && <span className={style.errorText}>{formik.errors.twitterLink}</span>}
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
          onBlur={formik.handleBlur}
          placeholder="https://yourwebsite.com"
          className={`${style.formInput} ${formik.touched.websiteLink && formik.errors.websiteLink ? style.formInputError : ''}`}
        />
        {formik.touched.websiteLink && formik.errors.websiteLink && <span className={style.errorText}>{formik.errors.websiteLink}</span>}
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
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if (loginEmailError) setLoginEmailError(validateLoginEmail(e.target.value));
                  }}
                  onBlur={() => setLoginEmailError(validateLoginEmail(loginEmail))}
                  placeholder="Enter email ID"
                  className={`${style.formInput} ${loginEmailError ? style.formInputError : ''}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendLoginOtp();
                  }}
                />
                {loginEmailError && <span className={style.errorText}>{loginEmailError}</span>}
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
                onClick={() => handleVerifyLoginOtp()}
                className={style.signupButton}
                disabled={isLoading}
                style={{
                  marginTop: '0px',
                  backgroundColor: (loginOtp.join('').length === 6 && loginTimer > 0) ? '#f07c00' : '#888',
                  boxShadow: 'none',
                  border: 'none',
                  color: '#fff',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '24px',
                  fontWeight: '600',
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
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

