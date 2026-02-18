import { ILocation } from "./UserProfileModel";
export interface IPostJob {
  jobTypeId?: string;
  jobType: string;
  subCategoryId?: string;
  subCategory: string;
  requiredExperience?: number;
  urgent?: boolean;
  workType?: string;
  startDate: Date | undefined;
  numberOfDays?: number;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode: string;
  payRange?: string;
  dietaryPreference?: string;
  aboutRequirement: string;
  location?: ILocation;
}
