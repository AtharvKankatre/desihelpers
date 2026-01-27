import * as yup from "yup";

export const VJobValidation = () =>
  yup.object({
    jobType: yup.string().trim().required("Category is mandatory"),
    subCategory: yup.string().trim().required("Sub-Category is mandatory"),

    startDate: yup.string().trim().required("Start date and time is mandatory"),

    addressLine1: yup.string().trim().required("Address is mandatory"),
    state: yup.string().trim().required("Please select a state"),
    city: yup.string().trim().required("Please select a city"),
    zipCode: yup.string().trim().required("Please mention your area zip code"),

    aboutRequirement: yup
      .string()
      .trim()
      .required("Please provide some additional details"),
  });
