import { FunctionComponent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { Card, Image } from "react-bootstrap";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import jobStyles from "@/styles/Jobs.module.css";
import { CH5Label } from "../reusable/labels/CH5Label";
import { CH7Label } from "../reusable/labels/CH7Label";
import { CDisplaySeekerDetailsModal } from "../seekers/CDisplaySeekerDetailsModal";
import { CH8Label } from "../reusable/labels/CH8Label";
import { getWorkPhotoUrls } from "@/utils/s3Helper";

type Props = {
  seeker: IUserProfileModel;
  setModal?: boolean;
  toggleModal?: () => void;
};

export const CJobSeekerMapCard: FunctionComponent<Props> = ({
  seeker,
  setModal,
}) => {
  const { mobile } = useAppMediaQuery();
  const dummyImage = "/assets/icons/form_icons/icon_dummy_user.svg"; 
  const [PhotoUrls, setPhotoUrls] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchPhotoUrls = async () => {
      const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
      if (!bucketName) {
        return;
      }
      const photo = seeker.profilePhoto;
      const photosArray = photo ? [photo] : [];
      const urls = getWorkPhotoUrls(bucketName, photosArray);
      setPhotoUrls(urls.length > 0 ? urls[0] : undefined);  // Expecting only one URL
    };
  
    fetchPhotoUrls();
  }, [seeker.profilePhoto]);
  return (
    <Card
      className={`bgPrimary ${
        mobile
          ? jobStyles.jobSeekerCardForMapMobile
          : jobStyles.jobSeekerCardForMap
      }`}
    >
      <div className={jobStyles.jobSeekerPhotoAndDisplayName}>
        <Image src={PhotoUrls || dummyImage} height={68} width={68} roundedCircle />

        <div className="d-flex flex-column ms-2">
          <CH5Label
            className="text-warning fw-bold"
            label={seeker.displayName ?? "Not given"}
          />
          {seeker.showPhone && (
            <CH7Label
              className="text-warning"
              label={seeker.mobile ?? "Not given"}
            />
          )}
          <CH7Label
            label={`Location : ${seeker.city ?? "-"} , ${seeker.state ?? "-"}`}
          />
        </div>
      </div>

      <div className={jobStyles.jobSeekerExpertiseIcons}>
        {/* <div className="d-flex flex-row justify-content-between w-100">
          
        </div> */}
        <div className="container">
          <div className="row col-md-12 col-sm-12">
            <CH7Label
              label="Available for : "
              className="col-md-12 text-dark fw-bold ps-1 mb-1"
            />

            {seeker.jobDetails == null ? (
              <div />
            ) : (
              seeker.jobDetails?.slice(0, 2).map((e) => (
                <div key={e.id} className="col ps-0">
                  <div className="d-flex flex-row align-items-center justify-content-start">
                    <img key={e.id} src={e.icons} alt={e.jobType ?? "-"} />
                    <CH8Label
                      label={e.subCategory ?? "-"}
                      className="text-dark"
                    />
                  </div>
                </div>
              ))
            )}

            {seeker.jobDetails?.length! > 2 && (
              <CH8Label
                label="more"
                className="col textPrimary align-self-center"
              />
            )}
          </div>
        </div>
      </div>
      <CDisplaySeekerDetailsModal profile={seeker} />
    </Card>
  );
};
