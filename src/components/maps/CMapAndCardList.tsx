import { FunctionComponent, useState } from "react";
import { IJobs } from "@/models/Jobs";
import mapStyles from "@/styles/Map.module.css";
import DisplayMap from "./DisplayMaps";
import { IUserProfileModel } from "@/models/UserProfileModel";
import IMapSearchFilters from "@/models/MapFilters";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import CButton from "../reusable/CButton";
import { CCardList } from "./CCardList";
import { CDisplaySeekerDetailsModal } from "../seekers/CDisplaySeekerDetailsModal";
import { CViewJobDetailsModal } from "../jobs/CViewJobDetailsModal";
import ViewJobDetailsModal from "../jobs/ViewJobDetailsModal";

type Props = {
  fJobs: IJobs[];
  fSeeker: IUserProfileModel[];
  filters: IMapSearchFilters;
  isLoading: boolean;
};

export const CMapAndCardList: FunctionComponent<Props> = ({
  fJobs,
  fSeeker,
  filters,
  isLoading,
}) => {
  const { mobile, tablet, desktop } = useAppMediaQuery();
  const [showMapMobile, setShowMapMobile] = useState<boolean>(false);

  const [selectedProfile, setSelectedProfile] =
    useState<IUserProfileModel | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [selectedJob, setSelectedJob] = useState<IJobs | null>(null);
  const [showJob, setShowJob] = useState<boolean>(false);

  const openJobPing = (job: IJobs) => {
    setSelectedJob(job);
    setShowJob(true);
  };

  const closeJobPing = () => {
    setSelectedJob(null);
    setShowJob(false);
  };

  const handleProfileClick = (profile: IUserProfileModel) => {
    setSelectedProfile(profile);
    setShowModal(true);
  };

  if (mobile) {
    return (
      <>
        <div
          className={
            showMapMobile
              ? mapStyles.mapContainerMobileHide
              : mapStyles.mapContainerMobile
          }
        >
          <DisplayMap
            filters={filters}
            jobs={fJobs}
            seekers={fSeeker}
            onProfileClick={handleProfileClick}
            onJobClick={openJobPing}
          />
          {/* Conditionally render the modal based on state */}
          {selectedProfile && (
            <CDisplaySeekerDetailsModal
              profile={selectedProfile}
              setModal={showModal}
              toggleModal={() => {
                setShowModal(false);
                setSelectedProfile(null);
              }}
            />
          )}
          {selectedJob && (
            <ViewJobDetailsModal
              job={selectedJob}
              handleClose={closeJobPing}
              showModal={showJob}
            />
          )}
        </div>
        <div
          className={
            showMapMobile
              ? mapStyles.mapCardListContainerMobile
              : mapStyles.mapCardListContainerMobileHide
          }
        >
          <CCardList
            filters={filters}
            fJobs={fJobs}
            fSeeker={fSeeker}
            isLoading={isLoading}
          />
        </div>

        <CButton
          className={`d-flex flex-row justify-content-center w-100 ${mapStyles.mapFloatingButtonForMobile}`}
          buttonClassName={`btn ${
            showMapMobile ? "btn-warning" : "btn-primary"
          }  btn-sm`}
          label={`${showMapMobile ? "Show Map " : "Show Cards"}`}
          onClick={() => setShowMapMobile(!showMapMobile)}
        />
      </>
    );
  }

  return (
    <>
      <div className={mobile ? mapStyles.secondRowMobile : mapStyles.secondRow}>
        <div className={`d-flex flex-row h-100 m-2`}>
          <div className={mapStyles.mapContainer}>
            <DisplayMap
              filters={filters}
              jobs={fJobs}
              seekers={fSeeker}
              onProfileClick={handleProfileClick}
              onJobClick={openJobPing}
            />
            {/* Conditionally render the modal based on state */}
            {selectedProfile && (
              <CDisplaySeekerDetailsModal
                profile={selectedProfile}
                setModal={showModal}
                toggleModal={() => {
                  setShowModal(false);
                  setSelectedProfile(null);
                }}
              />
            )}
            {selectedJob && (
              <ViewJobDetailsModal
                job={selectedJob}
                handleClose={closeJobPing}
                showModal={showJob}
              />
            )}
          </div>
          <CCardList
            filters={filters}
            fJobs={fJobs}
            fSeeker={fSeeker}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};
