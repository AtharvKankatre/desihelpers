import { CDisplayJobPostersRow } from "@/components/jobs/CDisplayJobPosterListRow";
import { CAboutUs } from "@/components/page_related/landing/AboutUs";
import { IlustrationsImage } from "@/components/page_related/landing/IlustrationsImage";
import { CMissionStatement } from "@/components/page_related/landing/MissionStatement";
import { PostJobCarousel } from "@/components/page_related/landing/PostJobCarousel";
import { WelcomeBanner } from "@/components/page_related/landing/WelcomeBanner";
import { CDottedDivider } from "@/components/reusable/CDottedDivider";
import styles from "@/styles/Common.module.css";
import Ctestimonials from "@/components/page_related/landing/Testimonials";
import { useEffect, useState } from "react";
import router from "next/router";
import base64url from "base64url";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import ApiService from "@/services/data/crud/crud";
import CStats from "@/components/page_related/landing/Stats";
import bg from "/public/main_banner_bg.png";
import { CDisplayJobSeekerRow } from "@/components/seekers/CDisplayJobSeekerListRow";
import { userProfileStore } from "@/stores/UserProfileStore";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { useAuth } from "@/services/authorization/AuthContext";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import JobSeekerModal from "@/components/page_related/landing/PromptModalForSeeker";
import { jobStore } from "@/stores/JobStore";
import { seekerStore } from "@/stores/SeekerStore";
import { CCommonLoader } from "@/components/static/CommonLoader";
import { Routes } from "@/services/routes/Routes";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";
import landingStyles from "@/styles/Landing.module.css"; 
import GoogleAdsBanner from "@/components/ads/GoogleAdsBanner";

const Landing: React.FC = () => {
  const userStore = userProfileStore();
  const userProfile = userProfileStore((state) => state.userProfile);
  const { isActive, isProfileBuild } = useAuth();
  const { tablet } = useAppMediaQuery();
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
            if(profileStatus == "false")
              {
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
              else
              {
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
    <div
      className={`container-fluid ${styles.displayDetailsWrapper} w-100 ${styles.bgImageLanding}`}
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="row justify-content-center mx-auto">
        <div className="col-md-12">
          <div className="row align-items-center mt-5">
            <div
              className={`row ${
                tablet ? "col-md-12" : "col-md-8"
              } col-sm-12 mx-auto justify-content-center align-items-center`}
            >
              <div className="col-sm-6">
                <WelcomeBanner />
              </div>
              <div className={`col-sm-6 ${landingStyles.welcomeBannerImg}`}>
                <IlustrationsImage />
              </div>
            </div>

            <div className="col-md-12">
              <CDottedDivider />
            </div>

            {/* Post a job carnival */}
            <div className="col-md-12 mt-2 mb-4">
              <PostJobCarousel />
            </div>

            <div className="col-md-12">
              <CDottedDivider />
            </div>

            {/* Third row to show the available job seekers */}
            <div className="col-md-12 text-center mt-2 mb-3">
              <CDisplayJobSeekerRow />
            </div>

            <div className="col-md-12">
              <CDottedDivider />
            </div>

            <div className="col-md-12 text-center mt-3 mb-5">
              <CDisplayJobPostersRow />
            </div>

            <div className="col-md-12 mt-3 mb-5">
              <GoogleAdsBanner                       
                    data-ad-slot="1794024513"
                    data-matched-content-rows-num="2,1"
                    data-matched-content-columns-num="1,2"
                    data-matched-content-ui-type="image_stacked,image_stacked"
                    data-ad-format="autorelaxed"
                    data-ad-test="on"
            />
            </div>

            <div className="col-md-12">
              <CDottedDivider />
            </div>
            <div className="col-sm-12 mt-5 mb-5">
              <CMissionStatement />
            </div>
            <div className="col-md-12">
              <CDottedDivider />
            </div>
            <div className="mt-5 mb-5">
              <CAboutUs />
            </div>
            <div className="col-md-12">
              <CDottedDivider />
            </div>
            <div>
              <CStats />
            </div>
            <div className="col-md-12">
              <CDottedDivider />
            </div>
            <div className="mt-4">
              <Ctestimonials />
            </div>
          </div>
        </div>
      </div>
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
