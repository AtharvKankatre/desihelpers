import React from "react";
import Slider from "react-slick";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CH2Label } from "@/components/reusable/labels/CH2Label";
import styles from "@/styles/Common.module.css";
import { useAuth } from "@/services/authorization/AuthContext";
import { getOptimizedIcon } from "@/utils/iconMapping";
import Image from "next/image";

const images = [
  {
    src: "/assets/img_nanny1.png",
    label: "Home n Baby Care",
    path: "/jobs/PostAJob",
  },
  {
    src: "/assets/img_caterer1_1.png",
    label: "Catering",
    path: "/jobs/PostAJob",
  },
  {
    src: "/assets/img_baker2.png",
    label: "Baking",
    path: "/jobs/PostAJob",
  },
  {
    src: "/assets/img_event_helper1.png",
    label: "Event Help",
    path: "/jobs/PostAJob",
  },
  {
    src: "/assets/img_tutoring1.png",
    label: "Tutoring",
    path: "/jobs/PostAJob",
  },
  {
    src: "/assets/img_hourly_job.png",
    label: "Hourly Jobs",
    path: "/jobs/PostAJob",
  },
];

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

export const PostJobCarousel: React.FC = () => {
  const router = useRouter();
  const { isActive, isProfileBuild } = useAuth();
  const handleImageClick = (path: string, label: string) => {

    // const isProfileBuild = sessionStorage.getItem("isProfileBuild") === "true";
    // const isActive = sessionStorage.getItem("isActive") === "true";

    if (!isActive) {
      toast.info("Please login before posting a job");
      router.push("/Login");
    } else if (!isProfileBuild) {
      toast.warning("Please build your profile first before posting a job.");
      router.push("/Landing");
    } else {
      router.push({
        pathname: path,
        query: { label },
      });
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
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
    <div className="container text-center">
      <CH2Label
        className={`col-md-12 text-capitalize ${styles.pLabel}`}
        label="Post your job for"
      />
      <Slider {...settings}>
        {images.map((image, index) => (
          <div
            key={index}
            className="position-relative"
            onClick={() => handleImageClick(image.path, image.label)}
          >
            <img
              src={image.src}
              alt={image.label}
              className="w-100 rounded"
              style={{ height: "200px", objectFit: "cover" }}
            />
            <div
              className="position-absolute w-100 text-center text-white bg-dark bg-opacity-50 py-2 rounded-bottom d-flex align-items-center justify-content-center gap-2"
              style={{ bottom: 0 }}
            >
              <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                <Image
                  src={getOptimizedIcon(image.label)}
                  alt={image.label}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span>{image.label}</span>
            </div>
          </div>
        ))}
      </Slider>
      <style jsx global>{`
        .slick-slide {
          padding: 0 10px;
        }
        .slick-list {
          margin: 0 -10px;
        }
      `}</style>
    </div>
  );
};
