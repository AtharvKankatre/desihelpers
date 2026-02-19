export interface IUsers {
    _id?: string;
    email?: string;
    isJobSeeker? :boolean;
    roles?:string[];
    isProfile?:boolean;
    socialLogin?:string;
    firstName?:string;
    lastName?:string;
    createdAt?: Date;
    updatedAt?: Date;
  }