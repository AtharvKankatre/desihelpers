import { CJobPosterJob } from "./CJobPosterCard";
import styles from "@/styles/Common.module.css";
import { useEffect, useState } from "react";
import { IJobs } from "@/models/Jobs";
import { CH2Label } from "../reusable/labels/CH2Label";
import style from "@/styles/Common.module.css";
import CButton from "../reusable/CButton";
import { useRouter } from "next/router";
import { Routes } from "@/services/routes/Routes";
import JobServices from "@/services/jobs/JobService";
import { IJobFilters } from "@/models/JobFilters";
import { CH1Label } from "../reusable/labels/CH1Label";
import Swal from "sweetalert2";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import { useAuth } from "@/services/authorization/AuthContext";
import Slider from "react-slick"; 
import "slick-carousel/slick/slick-theme.css";
import customStyles from "@/styles/Carousel.module.css"; 

export const CDisplayJobPostersRow = () => {
  const router = useRouter();
  var jobServices = new JobServices();
  const [jobs, setJobs] = useState<IJobs[]>([]);
  let filters: IJobFilters = {};
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { mobile, tablet } = useAppMediaQuery(); 
  const { isProfileBuild, isActive } = useAuth();

  // fetch the list of jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      filters.limit = 4;
      setJobs(await jobServices.fetchLandingPageJobs());
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  const viewAllJobs = () => {
    if (!isActive) {
      Swal.fire({
        title: "Alert",
        text: "Please login to view all jobs",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Login");
        }
      });
    } else if (!isProfileBuild) {
      Swal.fire({
        icon: "warning",
        title: "Profile Incomplete",
        text: "Please build your profile first before viewing all jobs.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Landing");
        }
      });
    } else {
      router.push(Routes.viewAllJobs);
    }
  };

  const NextArrow: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = (props) => {
  const { className, style, onClick } = props;
  return (
    <img
      className={`${className} ${styles.nextRightArrow}`}
      src="/assets/icons/icon_arrow_right.svg"
      alt="Next Arrow"
      style={style}
      onClick={onClick}
    />
  );
};

const PrevArrow: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = (props) => {
  const { className, style, onClick } = props;
  return (
    <img
      className={`${className} ${styles.nextLeftArrow}`}
      src="/assets/icons/icon_arrow_left.svg"
      alt="Prev Arrow"
      style={style}
      onClick={onClick}
    />
  );
};
const hasSingleJob = jobs.length === 1;

  const sliderSettings = {
    dots: false,  // Remove dots indicator
    infinite: !hasSingleJob,  // Disable infinite scroll if there's only one job
    speed: 500,  // Transition speed
    slidesToShow: mobile ? 1 : 4,  // Number of slides to show depending on the screen size
    slidesToScroll: 1,  // Number of slides to scroll at a time
    autoplay: !hasSingleJob,  // Enable auto-slide
    autoplaySpeed: 2000,  // Auto-slide interval (2 seconds)
    arrows: !hasSingleJob, // Show navigation arrows
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12 mx-auto mt-2">
          <CH2Label
            className={`col-md-12 text-capitalize ${style.pLabel}`}
            label="Trending jobs around you"
          />
          {isLoading ? (
            <CH1Label label="Loading...." />
          ) : jobs.length === 0 ? (
            <p className="text-secondary">
              No jobs available in your area at the moment.
              <br /> Click on &quot;View All Jobs&quot; to explore available
              opportunities beyond your area.
            </p>
          ) : mobile ? (
            // Render slick slider for mobile view only
            <Slider {...sliderSettings} >
              {jobs.map((job) => (
                <div key={job.id}>
                  <CJobPosterJob jobs={job} />
                </div>
              ))}
            </Slider>
          ) : (
            // Render grid for tablet and larger screens
            <div className="row">
              {jobs.map((job) => (
                <div
                  className={`${tablet ? "col-md-6" : "col-md-3"} mt-4`}
                  key={job.id}
                >
                  <CJobPosterJob jobs={job} />
                </div>
              ))}
            </div>
          )}
          <div className="col-md-12 mt-4 d-flex justify-content-center">
            <CButton
              buttonClassName="btn btn-primary bgPrimary"
              label="View All Jobs"
              onClick={viewAllJobs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
