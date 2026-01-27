import { ISeekerFilters } from "@/models/SeekerFilters";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "../data/constants/ApiDetails";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { userProfileStore } from "@/stores/UserProfileStore";
import { seekerStore } from "@/stores/SeekerStore";
import { IJobCategories, ISubCategory } from "@/models/JobCategories";

class SeekerServices {
  profileStore = userProfileStore();
  sStore = seekerStore();
  // Method to fetch job seekers for landing page
  // The list is to be stored in zustand store
  // In addition the list is to be refreshed every [15 minutes]
  // i.e when the user visits the landing page, the store checks when the list was last refreshed
  // If it was more than 15 minutes ago then the list is fetched again from the server
  public fetchLandingPageSeekers = async (): Promise<IUserProfileModel[]> => {
    // Get user coordinates
    let coordinates = this.profileStore.userProfile.location?.coordinates;
    let Ustate = this.profileStore.userProfile.state;

    const filters: ISeekerFilters = {
     // latitude: coordinates?.[1],
      //longitude: coordinates?.[0],
      state : Ustate,
      radius: 50,
      limit: 0,
    };

    // Get current time and the stored last update time
    const currentTime = Date.now();
    const lastUpdatedTime = this.sStore.dateTime ?? 0;

    // Check if the data is older than 15 minutes (15 * 60 * 1000 ms = 900000 ms)
    if (this.sStore.seeker.length > 0 && (currentTime - lastUpdatedTime) < 900000) {
     // console.log("Returning cached seekers");
      return this.sStore.seeker.slice(0, 4);
    }

    // Fetch new seekers data as cache is stale or non-existent
    let list: IUserProfileModel[] = await this.fetchSeekers(filters);
    if (list.length > 0) {
      //console.log("Fetching new seekers data");
      this.sStore.reset();
      // Set new seekers and update the dateTime
      this.sStore.setSeekers(list);
      this.sStore.setData(currentTime);
    }

    return list.slice(0,4);
  };

  private fetchSeekers = async (
    filters: ISeekerFilters
  ): Promise<IUserProfileModel[]> => {
    let list: IUserProfileModel[] = [];

    var result = await ApiService.crud(
      APIDetails.getSeekers,
      this.jobUrlStringExt(filters)
    );

    if (result[0]) {
      list = result[1];
    }

    return list;
  };
  public fetchJobs = async (
    fitlers: IUserProfileModel
  ): Promise<IUserProfileModel[]> => {
    let list: IUserProfileModel[] = [];
    var result = await ApiService.crud(
      APIDetails.getSeekers,
      this.jobUrlStringExt(fitlers)
    );
    if (result[0]) {
      list = result[1];
    }

    return list;
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

  private jobUrlStringExt = (data: ISeekerFilters) => {
    return `?skip=${data.skip ?? 0}&limit=${data.limit ?? 0}&state=${
      data.state ?? ""
    }&longitude=${data.longitude ?? ""}&latitude=${
      data.latitude ?? ""
    }&zipCode=${data.zipCode ?? ""}&jobTypeId=${data.jobTypeId ?? ""}&radius=${
      data.radius ?? 10
    }`;
  };
  // Setup formik for editing a job
}

export default SeekerServices;
