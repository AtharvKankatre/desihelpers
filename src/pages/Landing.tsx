


import styles from "@/styles/Common.module.css";
import Ctestimonials from "@/components/page_related/landing/Testimonials";
import { useEffect, useState } from "react";
import router from "next/router";
import base64url from "base64url";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import ApiService from "@/services/data/crud/crud";

import { userProfileStore } from "@/stores/UserProfileStore";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { useAuth } from "@/services/authorization/AuthContext";
import JobSeekerModal from "@/components/page_related/landing/PromptModalForSeeker";
import { jobStore } from "@/stores/JobStore";
import { seekerStore } from "@/stores/SeekerStore";
import { CCommonLoader } from "@/components/static/CommonLoader";
import { Routes } from "@/services/routes/Routes";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
import { useRef } from "react";

import { HeroSection } from "@/components/page_related/landing/HeroSection";
import { WhyUsSection } from "@/components/page_related/landing/WhyUsSection";
import { PopularServicesSection } from "@/components/page_related/landing/PopularServicesSection";
import { TestimonialsSection } from "@/components/page_related/landing/TestimonialsSection";
import { JoinMissionSection } from "@/components/page_related/landing/JoinMissionSection";
import { BlogSection } from "@/components/page_related/landing/BlogSection";
import { AdPlaceholders } from "@/components/page_related/landing/AdPlaceholders";
import { FAQSection } from "@/components/page_related/landing/FAQSection";
import { CTASection } from "@/components/page_related/landing/CTASection";

const Landing: React.FC = () => {
  const userStore = userProfileStore();
  const userProfile = userProfileStore((state) => state.userProfile);
  const { isActive, isProfileBuild } = useAuth();
  const [open, setOpen] = useState(false);
  const [wantToBeSeeker, setWantToBeSeeker] = useState(false);
  let sStore = seekerStore();
  let jStore = jobStore();

  const [globalLoader, setGlobalLoader] = useState(false); // for globalLoader
  const [onLoad, setOnLoad] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const query = new URLSearchParams(window.location.search);
      const token = query.get("access_token");
      const promptJobSeeker = query.get("promptJobSeeker");
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = base64url.decode(parts[1]);
          const parsedPayload = JSON.parse(payload);
          const email = parsedPayload.email;
          const password = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD;
          const res = await ApiService.crud(
            APIDetails.login,
            JSON.stringify({ email, password })
          );
          if (res[0]) {
            setOnLoad(true);
            setTimeout(() => {
              const profileStatus = Cookies.get(cookieParams.isProfileBuild); // Retrieve the cookie value
              if (profileStatus == "false") {
                Swal.fire({
                  title: "Welcome to DesiHelpers.com",
                  text: "Let us find the help you need!",
                  icon: "success",
                  imageUrl: "/DesiHelpersLogo.svg",
                  imageAlt: "Custom image",
                  imageWidth: 300,
                  imageHeight: "auto",
                  confirmButtonText: "Click here to build your profile",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    router.replace(Routes.editUserProfile);
                  }
                });
              }
              else {
                router.replace(Routes.landing);
              }
              setOnLoad(false);// Set loading to false
            }, 1000);
          } else {
            alert(res[1]);
          }
        } else {
        }
        // if (promptJobSeeker == "true") {
        //   setWantToBeSeeker(true);
        //   setOpen(true);
        // } else 
        // {

        //}
      } else {
      }
    };
    fetchData();
  }, [router]);

  // Get the user's profile and add it to Zustand store
  // This is important as details from the user profile like co-ordinates would be used in multiple areas
  useEffect(() => {
    async function getUserProfile() {
      if (userProfile.userId == undefined && isProfileBuild) {
        setGlobalLoader(true);
        var result = await ApiService.crud(APIDetails.getUserProfile);
        if (result[0]) {
          sStore.reset();
          jStore.reset();
          let profile: IUserProfileModel = result[1];
          userStore.setUserProfile(profile);
        }
        setGlobalLoader(false);
      }
    }
    getUserProfile();
  }, []);

  if (globalLoader) {
    return <CCommonLoader />;
  }

  return (
    <div className={styles.displayDetailsWrapper} style={{ paddingTop: 0 }}>
      {/* New Hero Section */}
      <HeroSection />

      {/* Why Us Section */}
      <WhyUsSection />

      {/* Popular Services Section */}
      <PopularServicesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Join Mission Section */}
      <JoinMissionSection />

      {/* Blog Section */}
      <BlogSection />

      {/* Ad Placeholders */}
      <AdPlaceholders />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />






      {/* Use the new JobSeekerModal component */}
      <JobSeekerModal
        open={open}
        wantToBeSeeker={wantToBeSeeker}
        setWantToBeSeeker={setWantToBeSeeker}
        handleClose={() => setOpen(false)}
      />
    </div>
  );
};

export default Landing;

