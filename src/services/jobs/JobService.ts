import { IJobFilters } from "@/models/JobFilters";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "../data/constants/ApiDetails";
import { IJobs } from "@/models/Jobs";
import { IJobCategories, ISubCategory } from "@/models/JobCategories";
import { ViewTypesForMap } from "@/constants/ViewTypesForMap";
import { userProfileStore } from "@/stores/UserProfileStore";
import { jobStore } from "@/stores/JobStore";
import { seekerStore } from "@/stores/SeekerStore";

class JobServices {
  // Store for user profile
  profileStore = userProfileStore();
  jStore = jobStore();

  // Method to fetch job posters for landing page
  // The list is to be stored in zustand store
  // In addition the list is to be refreshed every [15 minutes]
  // i.e when the user visits the landing page, the store checks when the list was last refreshed
  // If it was more than 15 minutes ago then the list is fetched again from the server
  public fetchLandingPageJobs = async (): Promise<IJobs[]> => {
    // Get user coordinates
    let coordinates = this.profileStore.userProfile.location?.coordinates;
    let Ustate = this.profileStore.userProfile.state;

    const filters: IJobFilters = {
     // latitude: coordinates?.[1],
     // longitude: coordinates?.[0],
      state : Ustate,
      radius: 50,
      limit: 4,
    };

    // If value is already present in the store
    if (this.jStore.dateTime != null && this.jStore.jobs.length > 0) {
      // And it is less than 15 minutes old then display the same value
      let currentDate = Date.now();
      if (this.jStore.dateTime < currentDate) {
        return this.jStore.jobs;
      }
    }

    // else fetch new value

    let list: IJobs[] = await this.fetchJobs(filters);
    if (list.length > 0) {
      this.jStore.setJobs(list);
    }
    return list;
  };

  public fetchData = async (
    filters: IJobFilters,
    role: string
  ): Promise<any> => {
    // For job posters
    if (role == ViewTypesForMap.viewJobs) {
      return await this.fetchJobs(filters);
    }

    // For job seekers
    else if (role == ViewTypesForMap.viewJobSeekers) {
      return await this.fetchSeekers(filters);
    }
    return;
  };

  public fetchSeekers = async (filters: IJobFilters): Promise<any> => {
    let list: IJobs[] = [];
    var result = await ApiService.crud(
      APIDetails.getSeekers,
      this.jobUrlStringExt(filters)
    );
    if (result[0]) {
      list = result[1];
    }

    return list;
  };

  public fetchJobs = async (filters: IJobFilters): Promise<IJobs[]> => {
    let list: IJobs[] = [];
    var result = await ApiService.crud(
      APIDetails.getJobs,
      this.jobUrlStringExt(filters)
    );
    if (result[0]) {
      list = result[1];
    }

    return list;
  };

  public fetchMyJobs = async (): Promise<IJobs[]> => {
    let list: IJobs[] = [];

    var result = await ApiService.crud(APIDetails.getMyJobs);
    if (result[0]) {
      list = result[1];
    }

    return list;
  };

  public deleteAJob = async (jobId: string): Promise<any> => {
    var result = await ApiService.crud(APIDetails.deleteJob, jobId);
    return result;
  };

  // Returns sub categories for a select categories
  public returnSubCategories = (
    j: IJobCategories[],
    c: string
  ): ISubCategory[] => {
    let t: IJobCategories | undefined = j.find((i) => i.name == c);
    // If no value is found then return a blank list
    if (t == null) return [] as ISubCategory[];

    // If not return the actual list
    return t?.subCategories as ISubCategory[];
  };

  private jobUrlStringExt = (data: IJobFilters) => {
    return `?skip=${data.skip ?? ""}&limit=${data.limit ?? 0}&state=${
      data.state ?? ""
    }&longitude=${data.longitude ?? ""}&latitude=${
      data.latitude ?? ""
    }&zipCode=${data.zipCode ?? ""}&jobTypeId=${data.jobTypeId ?? ""}&radius=${
      data.radius ?? 10
    }`;
  };

  // Setup formik for editing a job
}

export default JobServices;
