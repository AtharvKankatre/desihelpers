import { ILocation } from "./UserProfileModel";

export interface IJobs {
  location?: ILocation;
  _id?: string;
  userId?: string;
  jobTypeId?: string;
  jobType?: JobType;
  subCategory?: string;
  requiredExperience?: number;
  urgent?: boolean;
  workType?: string;
  startDate?: Date | undefined;
  startTime?: string;
  numberOfDays?: number;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  payRange?: string;
  dietaryPreference?: string;
  aboutRequirement?: string;
  isDeleted?: boolean;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
  userProfile?: UserProfile;
}

export interface JobType {
  id?: string;
  name?: string;
  icons?: string;
  image?: string;
}

export interface UserProfile {
  _id?: string;
  displayName?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  showPhone?: boolean;
  showMobile?: boolean;
  profilePhoto?: string;
}
