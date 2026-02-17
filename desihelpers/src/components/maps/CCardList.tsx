import { ViewTypesForMap } from "@/constants/ViewTypesForMap";
import IMapSearchFilters from "@/models/MapFilters";
import { FunctionComponent } from "react";
import { CH4Label } from "../reusable/labels/CH4Label";
import { useAppMediaQuery } from "@/services/media_query/CalculateBreakpoints";
import mapStyles from "@/styles/Map.module.css";
import { IJobs } from "@/models/Jobs";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { CH5Label } from "../reusable/labels/CH5Label";
import { CJobSeekerMapCard } from "./CJobSeekerMapCard";
import { CJobPosterMapCard } from "./CJobPosterMapCard";

type Props = {
  filters: IMapSearchFilters;
  isLoading: boolean;
  fJobs: IJobs[];
  fSeeker: IUserProfileModel[];
};

export const CCardList: FunctionComponent<Props> = ({ ...Props }) => {
  const { mobile, tablet } = useAppMediaQuery();

  return (
    <div
      className={
        mobile ? mapStyles.cardListContainerMobile : mapStyles.cardListContainer
      }
    >
      <CH4Label
        label={
          Props.filters.role == ViewTypesForMap.viewJobs
            ? "Posted Jobs"
            : "Available Service Providers"
        }
      />
      <div
        className={
          tablet ? mapStyles.mapTableRowTablet : mapStyles.mapTableRowDesktop
        }
      >
        {Props.isLoading ? (
          <CH5Label
            label={
              Props.filters.role == ViewTypesForMap.viewJobs
                ? "Fetching jobs"
                : "Fetching helpers"
            }
          />
        ) : Props.fJobs.length == 0 && Props.fSeeker.length == 0 ? (
          <CH5Label
            label={
              Props.filters.role == ViewTypesForMap.viewJobs
                ? "No jobs are currently available in the filtered location."
                : "No helpers are currently available in the filtered location."
            }
          />
        ) : Props.filters.role == ViewTypesForMap.viewJobs ? (
          Props.fJobs.map((e) => <CJobPosterMapCard key={e.id ?? "-"} e={e} />)
        ) : (
          Props.fSeeker.map((e) => (
            <CJobSeekerMapCard key={e.id ?? "-"} seeker={e} />
          ))
        )}
      </div>
    </div>
  );
};
