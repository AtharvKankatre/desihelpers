export interface ISeekerFilters {
    skip?: number;
    limit?: number;
    jobTypeId?: number;
    state?: string;
    longitude?: number;
    latitude?: number;
    zipCode?: string;
    radius?: number;
  }