import { ISubCategory } from "./JobCategories";

type IMapSearchFilters = {
  role: string;
  category: string;
  subCategory: string;
  radius: number;
  diet: string;
  pets: string;
  coordinates: [number, number];
  subCategories?: ISubCategory[];
};

export default IMapSearchFilters;
