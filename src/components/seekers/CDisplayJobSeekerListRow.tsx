import { CJobSeekerJob } from "./CJobSeekerCard";
import styles from "@/styles/Common.module.css";
import { useEffect, useState } from "react";
import { IJobs } from "@/models/Jobs";
import { CH2Label } from "../reusable/labels/CH2Label";
import style from "@/styles/Common.module.css";
import CButton from "../reusable/CButton";
import { useRouter } from "next/router";
import { Routes } from "@/services/routes/Routes";
import { ISeekerFilters } from "@/models/SeekerFilters";
import { CH1Label } from "../reusable/labels/CH1Label";
import Swal from "sweetalert2";
import SeekerServices from "@/services/seekers/SeekerService";
import { IUserProfileModel, JobDetailDto } from "@/models/UserProfileModel";
import ViewAllSeekers from "@/pages/seekers/ViewAllSeekers";
import { useAuth } from "@/services/authorization/AuthContext";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import { Carousel } from "react-bootstrap";
import customStyles from "@/styles/Carousel.module.css";
import Slider from "react-slick";

export const CDisplayJobSeekerRow = () => {
  const router = useRouter();
  var services = new SeekerServices();
  const [seekers, setSeekers] = useState<IUserProfileModel[]>([]);
  const [seekersDetails, setSeekersDetails] = useState<JobDetailDto[]>([]);
  let filters: ISeekerFilters = {};
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isProfileBuild, isActive } = useAuth();
  const { mobile } = useAppMediaQuery();

  // fetch the list of jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      filters.limit = 4;
      const fetchedSeekers = await services.fetchLandingPageSeekers();
      setSeekers(fetchedSeekers);
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  const ViewAllSeekers = () => {
    if (!isActive) {
      Swal.fire({
        title: "Alert",
        text: "Please login to view all seekers",
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
        text: "Please build your profile first before viewing all service providers.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Landing");
        }
      });
    } else {
      router.push(Routes.viewAllSeekers);
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
  // Slider settings for mobile view
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: mobile ? 1 : 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
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
            label="Available Service Providers"
          />
          {isLoading ? (
            <CH1Label label="Loading...." />
          ) : seekers.length === 0 ? (
            <p className="text-secondary">
              No service providers available in your area at the moment.
              <br /> Click on &quot;View All Service Providers&quot; to explore available
              opportunities beyond your area.
            </p>
          ) : mobile ? (
            // Render Slick Slider for mobile view only if there are multiple seekers
            seekers.length > 1 ? (
              <Slider {...sliderSettings} className={customStyles.slickSlider}>
                {seekers.map((job) => (
                  <div key={job?.jobDetails![0].id}>
                    <CJobSeekerJob
                      jobs={job}
                      icons={
                        job?.jobDetails
                          ?.map((detail) => detail.icons)
                          .join(", ") || ""
                      }
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              // Render single card if there's only one seeker
              <CJobSeekerJob
                jobs={seekers[0]}
                icons={
                  seekers[0]?.jobDetails
                    ?.map((detail) => detail.icons)
                    .join(", ") || ""
                }
              />
            )
          ) : (
            // Render grid for larger screens
            <div className="row">
              {seekers.map((job) => (
                <div
                  className="col-md-4 col-lg-3 mt-4"
                  key={job?.jobDetails![0].id}
                >
                  <CJobSeekerJob
                    jobs={job}
                    icons={
                      job?.jobDetails
                        ?.map((detail) => detail.icons)
                        .join(", ") || ""
                    }
                  />
                </div>
              ))}
            </div>
          )}

          <div className="col-md-12 mt-4 d-flex justify-content-center">
            <CButton
              buttonClassName="btn btn-primary bgPrimary"
              label="View All Service Providers"
              onClick={ViewAllSeekers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
