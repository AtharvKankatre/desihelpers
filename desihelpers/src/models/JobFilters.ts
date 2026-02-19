export interface IJobFilters {
  skip?: number;
  limit?: number;
  jobTypeId?: number;
  state?: string;
  longitude?: number;
  latitude?: number;
  zipCode?: number;
  radius?: number;
}
