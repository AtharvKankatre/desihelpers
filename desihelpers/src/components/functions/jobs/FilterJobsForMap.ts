import { ViewTypesForMap } from "@/constants/ViewTypesForMap";
import { IJobFilters } from "@/models/JobFilters";
import { IJobs } from "@/models/Jobs";
import IMapSearchFilters from "@/models/MapFilters";
import { IUserProfileModel } from "@/models/UserProfileModel";
import JobServices from "@/services/jobs/JobService";

export default class MapServices {
  jobServices = new JobServices();

  public processMapFilters = async (
    existingFilter: IMapSearchFilters,
    newFilter: IMapSearchFilters,
    jobList: IJobs[],
    seekerList: IUserProfileModel[]
  ): Promise<
    [IJobs[], IJobs[]] | [IUserProfileModel[], IUserProfileModel[]] | boolean
  > => {
    let role: string = newFilter.role;

    // Check if a new data needs to be fetched
    let isAPI: boolean = this.checkIfAPIIsNeeded(
      existingFilter,
      newFilter,
      jobList,
      seekerList
    );

    // Get the necessary data - job list or seeker list
    // Create the filter that is to be sent to the server
    let mainList: any = [];
    // When an API called would be required
    if (isAPI) {
      let filter: IJobFilters = {
        limit: 0,
        latitude: newFilter.coordinates[0],
        longitude: newFilter.coordinates[1],
        radius: newFilter.radius,
      };
      var result = await this.fetchData(filter, role);
      if (role == ViewTypesForMap.viewJobs) {
        mainList = result as IJobs[];
      } else {
        mainList = result as IUserProfileModel[];
      }
    }
    // For when data is already present and no API call is needed
    else {
      if (role == ViewTypesForMap.viewJobs) {
        mainList = jobList as IJobs[];
      } else {
        mainList = seekerList as IUserProfileModel[];
      }
    }
    // Filter jobs & return the list
    if (role == ViewTypesForMap.viewJobs) {
      return this.filterJobs(mainList as IJobs[], newFilter);
    }

    // Filter seekers & return the list
    if (role == ViewTypesForMap.viewJobSeekers) {
      return this.filterSeekers(mainList as IUserProfileModel[], newFilter);
    }

    return false;
  };

  private checkIfAPIIsNeeded = (
    existingFilter: IMapSearchFilters,
    newFilter: IMapSearchFilters,
    jobList: IJobs[],
    seekerList: IUserProfileModel[]
  ) => {
    if (
      newFilter.role == ViewTypesForMap.viewJobSeekers &&
      seekerList.length == 0
    )
      return true;

    if (newFilter.role == ViewTypesForMap.viewJobs && jobList.length == 0)
      return true;

    if (existingFilter.role != newFilter.role) return true;

    if (existingFilter.radius != newFilter.radius) return true;

    if (existingFilter.coordinates != newFilter.coordinates) return true;
    return false;
  };

  private fetchData = async (filter: IJobFilters, role: string) =>
    await this.jobServices.fetchData(filter, role);

  private filterJobs = (
    allJobs: IJobs[],
    filters: IMapSearchFilters
  ): [IJobs[], IJobs[]] => {
    let fList: IJobs[] = [];

    fList.push(...allJobs);

    // Filter by category
    if (
      filters.category != "Select a category" &&
      filters.category.length != 0
    ) {
      fList = fList.filter((e) => e.jobType?.name == filters.category);
    }

    // Filter by sub-category
    if (
      filters.subCategory != "Select a sub-category" &&
      filters.subCategory.length != 0
    ) {
      fList = fList.filter((e) => e.subCategory == filters.subCategory);
    }

    return [allJobs, fList];
  };

  private filterSeekers = (
    allSeekers: IUserProfileModel[],
    filters: IMapSearchFilters
  ): [IUserProfileModel[], IUserProfileModel[]] => {
    let fList: IUserProfileModel[] = [];
    fList.push(...allSeekers);
    // Filter by category
    if (
      filters.category != "Select a category" &&
      filters.category.length != 0
    ) {
      fList = fList.filter((e) =>
        e.jobDetails?.some((i) => i.jobType == filters.category)
      );
    }

    // Filter by sub-category
    if (
      filters.subCategory != "Select a sub-category" &&
      filters.subCategory.length != 0
    ) {
      fList = fList.filter((e) => e.jobDetails?.some((i) => i.subCategory == filters.subCategory));
    }

    return [allSeekers, fList];
  };

  // Draw maps
}
