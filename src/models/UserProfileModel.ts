// To parse this data:
//
//   import { Convert, IUserProfileModel } from "./file";
//
//   const iUserProfileModel = Convert.toIUserProfileModel(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface IUserProfileModel {
  [x: string]: any;
  _id?: string;
  id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  showPhone?: boolean;
  showMobile?: boolean;
  languagesSpoken?: string[];
  profilePhoto?: string;
  facebookLink?: string;
  instagram?: string;
  websiteLink?: string;
  okWithPets?: boolean;
  uploadPhotoOfWork?: string[];
  isProfileBuilt?: boolean;
  jobDetails?: JobDetailDto[];
  createdAt?: Date;
  updatedAt?: Date;
  v?: number;
  aboutMe?: string;
  commutePreference?: string;
  dietaryRestrictions?: string;
  location?: ILocation;
}

export interface JobDetailDto {
  [x: string]: any;
  jobTypeId?: string;
  jobType?: string;
  subCategory?: string;
  subCategoryId?: string;
  yearsOfExperience?: number;
  available?: boolean;
  description?: string;
  postOnProfile?: boolean;
  isDeleted?: boolean;
  id?: string;
  icons?: string;
}

export interface JobType {
  id?: string;
  name?: string;
  icons?: string;
  image?: string;
}

export interface ILocation {
  type?: string;
  coordinates?: [number, number];
}
