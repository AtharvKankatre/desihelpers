import { useEffect, useState } from "react";
import styles from "@/styles/Seeker.module.css";
import { FunctionComponent } from "react";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { useRouter } from "next/router";
import style from "@/styles/Common.module.css";
import Swal from "sweetalert2";
import { useAuth } from "@/services/authorization/AuthContext";
import { CDisplaySeekerDetailsModal } from "./CDisplaySeekerDetailsModal";
import CButton from "../reusable/CButton";
import { getWorkPhotoUrls } from "@/utils/s3Helper";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CCopyLinkButton from "../reusable/CShareLink";

type Props = {
  jobs: IUserProfileModel;
  className?: string;
  icons: string;
};

export const CJobSeekerJob: FunctionComponent<Props> = ({
  jobs,
  className,
  icons,
}) => {
  const router = useRouter();

  const { isProfileBuild, isActive } = useAuth();
  const [PhotoUrls, setPhotoUrls] = useState<string | undefined>(undefined);
  const dummyImage = "/assets/icons/form_icons/icon_dummy_user.svg"; // Replace with your dummy image path
  const [selectedSeeker, setSelectedSeeker] =
    useState<IUserProfileModel | null>(null);
    
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const viewJobDetailsFn = () => {
    if (!isActive) {
      Swal.fire({
        title: "Alert",
        text: "Please login to view seeker details",
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
        text: "Please build your profile first before viewing seeker details.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Landing");
        }
      });
    }
  };

  useEffect(() => {
    const fetchPhotoUrls = async () => {
      const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
      if (!bucketName) {
        return;
      }
      const photo = jobs.profilePhoto;
      const photosArray = photo ? [photo] : [];
      const urls = getWorkPhotoUrls(bucketName, photosArray);
      setPhotoUrls(urls.length > 0 ? urls[0] : undefined); // Expecting only one URL
    };

    fetchPhotoUrls();
  }, [jobs.profilePhoto]);


  return (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col">
            <div className={`card ${styles.cardBorder}`}>
              <div className="card-body text-center p-0">
                <div className={styles.cardTop}>
                  <div className="margin-auto">
                    <img
                      src={PhotoUrls || dummyImage}
                      className={`rounded-circle img-fluid mt-3 mb-4 ${styles.seekerPhoto}`}
                    />
                  </div>
                  <h6 className="mb-2 text-white">{jobs.displayName}</h6>
                  <div
                    className={`pb-3 text-warning ${style.h7CSS} ${style.cardHeight} `}
                  >
                    {`${jobs.city}, ${jobs.state}`}
                  </div>
                </div>
                <div className="mb-3 pb-2">
                  <div>
                    <div>
                      {/* Render icons here */}
                      {icons &&
                        icons
                          .split(",")
                          .map((icon, index) => (
                            <img
                              key={index}
                              src={icon}
                              alt={`Icon ${index}`}
                              className={styles.iconSize}
                            />
                          ))}
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-row w-100 justify-content-between mt-2">
                   <CCopyLinkButton id={jobs._id || ""} /> 
                  {!isProfileBuild || !isActive ? (
                    <CButton
                      label="View Details"
                      className="d-flex flex-row w-100 justify-content-end p-2"
                      buttonClassName="btn btn-warning bgWarning"
                      onClick={viewJobDetailsFn}
                    />
                  ) : (
                    <CDisplaySeekerDetailsModal
                      profile={jobs}
                      source="landing"
                    />
                  )}
                 
                <ToastContainer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
