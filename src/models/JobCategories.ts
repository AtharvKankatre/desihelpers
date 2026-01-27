export interface IJobCategories {
  _id?: string;
  id?: string;
  name?: string;
  icons?: string;
  subCategories?: ISubCategory[];
}

export interface ISubCategory {
  _id?: string;
  name?: string;
  jobTypeId?: string;
}
