import withAuth from "@/services/authorization/ProfileService";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import styles from "@/styles/UserProfiles.module.css";
import * as yup from "yup";
import commonStyles from "@/styles/Common.module.css";
import { CH1Label } from "@/components/reusable/labels/CH1Label";
import { useFormik } from "formik";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { IStates } from "@/models/States";
import { ICities } from "@/models/Cities";
import { useRouter } from "next/router";
import {
  ILocation,
  IUserProfileModel,
  JobDetailDto,
} from "@/models/UserProfileModel";
import { CExpandablePanel } from "@/components/reusable/CExpandablePanel";
import { CEditPersonalDetails } from "@/components/page_related/user_profile/CEditPersonalDetails";
import { CEditAboutMe } from "@/components/page_related/user_profile/CEditAboutMe";
import { useAuth } from "@/services/authorization/AuthContext";
import OtherDataServices from "@/services/other_data/OtherDataServices";
import { CCommonLoader } from "@/components/static/CommonLoader";
import { CEditUserWorkPhotos } from "@/components/page_related/user_profile/CEditUserWorkPhotos";
import { IZipCodeDetails } from "@/models/ZipcodeDetails";
import CButton from "@/components/reusable/CButton";
import { VscDiffAdded } from "react-icons/vsc";
import { CEditExpertiseSection } from "@/components/page_related/user_profile/CEditExpertiseSection";
import { IJobCategories, ISubCategory } from "@/models/JobCategories";
import { userProfileStore } from "@/stores/UserProfileStore";
import { CH2Label } from "@/components/reusable/labels/CH2Label";
import { cookieParams } from "@/constants/ECookieParams";
import Cookies from "js-cookie";
import React from "react";
import { Routes } from "@/services/routes/Routes";
import { CBecomeASeeker } from "@/components/page_related/user_profile/CBecomeASeeker";
import { Formik, FormikHelpers } from "formik";
import CoordinateService from "@/services/coordinates/CoordinateService";

const EditUserProfile: FunctionComponent = () => {
  let params: any = {
    secure: true,
    expires: 2,
    sameSite: "lax",
  };
  // This parameter is used to determine if a user is a job seeker or simply a job poster
  // If a user is only a job poster then does not show about me / experience or other details
  const { isSeeker, setIsProfileBuild } = useAuth();
  const otherServices = new OtherDataServices();
  const router = useRouter();
  const { queryData, isJobseeker} = router.query;
  const { jobCategories, email } = useAuth();
  const userStore = userProfileStore();
  const [action, setAction] = useState<string | null>(null);
  const { isActive, isProfileBuild } = useAuth();

  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [states, setStates] = useState<Array<IStates>>([]);
  const [cities, setCities] = useState<Array<ICities>>([]);
  const [onLoad1, setOnload1] = useState<boolean>(true);

  // The below variable is to maintain the state of all s3 images that need to be added
  // When user clicks on the add button in My work photos, then it is added to this list
  // When the user updates the user profile, at that point the image is added to S3
  const [addImages, setAddImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [showSeekerModal, setShowSeekerModal] = useState<boolean>(false);
  const [profile, setProfile] = useState<IUserProfileModel | null>(null);

  // The below variable is to maintain the state of all s3 images that need to be deleted
  // When user clicks on the delete button against an image, then it is added to this list
  // When the user updates the user profile, at that point the image is deleted from S3
  const [deleteImages, setDeleteImages] = useState<string[]>([]);
  let myEmail = sessionStorage.getItem("email");
  let data: string = queryData as string;
  let p: IUserProfileModel | undefined;

  //get CoordinateService class object for randomizing coordinates
  let coordinateService = new CoordinateService();

  if (data != undefined) {
    p = JSON.parse(data);
  }

  let initialValues: IUserProfileModel = p ?? {};
  if (p == null) {
    initialValues.email = email;
  }
  const previousValues = useRef<IUserProfileModel>(initialValues);

  useEffect(() => {
    const getProfile = async () => {
      var result = await ApiService.crud(APIDetails.getUserProfile);
      if (result[0] == true) {
        setProfile(result[1] as IUserProfileModel);
      }
      setOnload1(false);
    };

    getProfile();

    return () => {};
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let res: IStates[] = await otherServices.fetchStates();
      setStates(res);

      if (p?.state != null) {
        let t: IStates | undefined = Object.values(res).find(
          (e) => e.name == p.state
        );

        let c: ICities[] = await otherServices.fetchCities(t?.code ?? "");
        setCities(c);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    validate: async (values) => {
      // Fetch state and city on zipcode selection
      if (
        values.zipCode != previousValues.current.zipCode &&
        values.zipCode?.length == 5
      ) {
        await updateZipCodeData(values.zipCode);
        // Update the previous values
        previousValues.current = values;
      }
    },
    async onSubmit() {
      setOnLoad(true);

      // Update category and sub category ids
      if (formik.values.jobDetails != null) {
        formik.values.jobDetails.map((e) => {
          let t: IJobCategories[] = jobCategories.filter(
            (i) => i.name == e.jobType
          );
          e.jobTypeId = t[0].id;

          let s: ISubCategory[] = t[0].subCategories ?? [];
          let sc: ISubCategory[] = s.filter((i) => i.name == e.subCategory);

          e.subCategoryId = sc[0]._id;
        });
      }
      // Execute the api call
      // The profile has not been build
      if (p == null) {
        // randomize the coordinates
        let randomizedCoordinates =
          coordinateService.getRandomCoordinatesWithinRadius(
            formik.values.location?.coordinates!,
            0.25
          );
        formik.values.location!.coordinates = randomizedCoordinates;

        var result = await ApiService.crud(
          APIDetails.AdminUpdateUserProfile,
          formik.values
        );

        if (result[0]) {
         // setIsProfileBuild(true);
          //Cookies.set(cookieParams.isProfileBuild, "true", params);
          //userStore.setUserProfile(formik.values);
          router.back();
        } else {
          alert(result[1]);
        }
      } else {
        // First check if the images that have been saved on S3 bucket need to be deleted or not
        // Check first if there are some images on S3 bucket or not
        if (
          formik.values.uploadPhotoOfWork != null &&
          formik.values.uploadPhotoOfWork.length > 0
        ) {
          // If images are present on S3 bucket then check if the to be deleted list has been updated or
          if (deleteImages.length > 0) {
            // This means that all images in this list need to be deleted
            const deleteRequests = deleteImages.map(async (fileName) => {
              const file = new File([], fileName);
              return await ApiService.crud(APIDetails.deleteWorkPhotos, [
                file,
                fileName,
              ]);
            });
            await Promise.all(deleteRequests);
          }
        }
        // Setup logic to add images to S3 bucket
        if (addImages.length > 0) {
          var uploadResult = await otherServices.uploadImages(files, addImages);
          if (uploadResult[0] == false) {
            alert(uploadResult[1]);
            return;
          } else {
            let l: string[] = uploadResult[1] as string[];
            let images: string[] = formik.values.uploadPhotoOfWork ?? [];
            let imgResult: string[] = [...images, ...l];
            formik.values.uploadPhotoOfWork = imgResult;
          }
        }

        // randomize the coordinates if existing coordinates are changed
        if (
          formik.values.location?.coordinates![0] !==
            previousValues.current.location?.coordinates![0] &&
          formik.values.location?.coordinates![1] !==
            previousValues.current.location?.coordinates![1]
        ) {
          let randomizedCoordinates =
            coordinateService.getRandomCoordinatesWithinRadius(
              formik.values.location?.coordinates!,
              0.5
            );
          formik.values.location!.coordinates = randomizedCoordinates;
        }
        // The profile has already been build and only needs to be updated
        var result = await ApiService.crud(
          APIDetails.AdminUpdateUserProfile,
          "",
          formik.values
        );
        if (result[0]) {
          userStore.setUserProfile(formik.values);
          router.back();
          alert("Your changes have been saved successfully!");
       
        } else {
          alert("Error while saving changes");
        }
      }
      setOnLoad(false);
    },
    validationSchema: yup.object({
      firstName: yup.string().trim().required("First name is required"),
      lastName: yup.string().trim().required("Last name is required"),
      displayName: yup.string().trim().required("Display name is required"),
      addressLine1: yup.string().trim().required("Address is required"),
      addressLine2: yup.string().trim(),
      state: yup.string().trim().required("State is mandatory"),
      city: yup.string().trim().required("city is mandatory"),
      zipCode: yup.string().trim().required("Please input a zipcode"),
      email: yup.string().trim().required("Please input a valid email id"),
      phone: yup.string().trim().required("Please input your mobile number"),
      mobile: yup.string().trim(),
      displayMobileOnProfile: yup.boolean(),
      displayWMobileOnProfile: yup.boolean(),
      languagesSpoken: yup
        .array<any>()
        .min(1, "Select at least one language")
        .required("Required"),
      uploadPhoto: yup.string().trim(),
      facebookLink: yup.string().trim(),
      instagram: yup.string().trim(),
      websiteLink: yup.string().trim(),
      aboutMe: yup.string().trim(),
      commutePreference: yup.string().trim(),
      dietaryRestrictions: yup.string().trim(),
      okWithPets: yup.boolean(),
      // jobDetails: yup.object<JobDetail>(),
    }),
  });

  const defaultJobDetail: JobDetailDto = {
    available: false,
    description: "",
    icons: "",
    id: "",
    isDeleted: false,
    jobType: "",
    jobTypeID: "",
    postOnProfile: true,
    subCategory: "",
    yearsOfExperience: 0,
  };

  const updateZipCodeData = async (zip: string) => {
    var result = await ApiService.crud(
      APIDetails.fetchZipCodeDetails,
      `?zipcode=${zip}`
    );

    if (result[0]) {
      let data: IZipCodeDetails = result[1];
      let t: IStates | undefined = Object.values(states).find(
        (e) => e.code == data.state
      );
      setCities(await otherServices.fetchCities(data.state ?? "-"));
      formik.setFieldValue("state", t?.name, true);
      formik.setFieldValue("city", data.city, true);

      let loc: ILocation = {
        type: "Point",
        coordinates: [data.longitude!, data.latitude!],
      };

      formik.setFieldValue("location", loc, true);
    }
    return;
  };

  // Handle Post Job click
  const handlePostClick = async () => {
    const isValid = await formik.validateForm();
    if (Object.keys(isValid).length === 0) {
      // No validation errors
      await formik.submitForm(); // Submit the form

      // Check if submission was successful
      if (!formik.isSubmitting) {
        router.push(Routes.postJob); // Redirect to post job after submission
      }
    }
  };

  // Handle Seeker click to show modal
  const handleSeekerClick = async () => {
    const isValid = await formik.validateForm();
    if (Object.keys(isValid).length === 0) {
      // No validation errors
      await formik.submitForm(); // Submit the form

      // Check if submission was successful
      if (!formik.isSubmitting) {
        setShowSeekerModal(true);
      }
    }
  };

  return (
    <div className={`container-fluid ${commonStyles.displayDetailsWrapper}`}>
      <div className="col-md-12">
        <div className={`container p-4 mb-4 ${styles.viewProfileMain}`}>
          <div className="row align-items-center mb-4">
            <div className="col-md-6 text-start">
              <CH2Label
                label={p == null ? "Build Your Profile" : "Edit Your Profile"}
              />
            </div>
            <div className="col-md-6 text-end">
              {p == null ? null : (
                <button
                  onClick={router.back}
                  className="btn btn-secondary bgCancel"
                  type="submit"
                >
                  Back
                </button>
              )}
            </div>
          </div>

          <>
            <CEditPersonalDetails
              formik={formik}
              onLoad={onLoad}
              cities={cities}
              email={formik.values.email!}
            />

{isJobseeker == "true" ? <CEditAboutMe formik={formik} onLoad={onLoad} /> : null}

{isJobseeker == "true"? (
  <CExpandablePanel
    title="Job Details"
    id={"editJobDetails"}
    isExpanded="show" // Keep the panel open by default
  >
    {(formik.values.jobDetails &&
    formik.values.jobDetails.length > 0
      ? formik.values.jobDetails
      : [defaultJobDetail]
    ) // Ensure at least one section shows initially
      .map((e, index) => (
        <CEditExpertiseSection
          key={index}
          formik={formik}
          e={e}
          index={index}
          onLoad={onLoad}
        />
      ))}
    <div
      className="btn btn-warning ms-2"
      onClick={() => {
        // Ensure jobDetails is an array and add a new expertise item
        formik.setFieldValue(
          "jobDetails",
          [...(formik.values.jobDetails || []), defaultJobDetail], // Handle undefined case safely
          true
        );
      }}
    >
      <VscDiffAdded size={24} className="me-2" />
      <span>Add Expertise</span>
    </div>
  </CExpandablePanel>
) : null}

            {isJobseeker == "true" && (
             <CEditUserWorkPhotos
                formik={formik}
                workPhotos={formik.values.uploadPhotoOfWork ?? []}
                setDeleteImages={setDeleteImages}
                deleteImages={deleteImages}
                setAddImages={setAddImages}
                addImages={addImages}
                setFiles={setFiles}
                files={files}
              />
              
            )}
           
            {/* {isProfileBuild ? (
              <CButton
                label="Save"
                buttonClassName="btn btn-secondary bgPrimary"
                onClick={formik.handleSubmit}
              />
            ) : (
              <div className="d-flex flex-row justify-content-end">
                <CButton
                  label="Save & Post Job"
                  buttonClassName="btn btn-secondary bgPrimary"
                  onClick={handlePostClick}
                />
                <CButton
                  label="Save & Become a Service Provider"
                  buttonClassName="btn btn-secondary bgPrimary"
                  onClick={handleSeekerClick}
                />
              </div>
            )} */}
            <CButton
              label="Save"
              buttonClassName="btn btn-secondary bgPrimary"
              onClick={formik.handleSubmit}
            />
            {/* <CBecomeASeeker
              showModal={showSeekerModal}
              setShowModal={setShowSeekerModal}
            /> */}
          </>
        </div>
      </div>
    </div>
  );
};

export default withAuth(EditUserProfile);
