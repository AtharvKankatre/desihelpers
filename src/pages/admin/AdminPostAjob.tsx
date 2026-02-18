import ApiService from "@/services/data/crud/crud";
import withAuth from "@/services/authorization/ProfileService";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { useAuth } from "@/services/authorization/AuthContext";
import { IJobCategories, ISubCategory } from "@/models/JobCategories";
import { IPostJob } from "@/models/PostJob";
import { CCommonLoader } from "@/components/static/CommonLoader";
import { IStates } from "@/models/States";
import { ICities } from "@/models/Cities";
import { useRouter } from "next/router";
import { Routes } from "@/services/routes/Routes";
import { ILocation } from "@/models/UserProfileModel";
import { IZipCodeDetails } from "@/models/ZipcodeDetails";
import OtherDataServices from "@/services/other_data/OtherDataServices";
import { CJobForm } from "@/components/jobs/CJobForm";
import { CH1Label } from "@/components/reusable/labels/CH1Label";
import styles from "@/styles/UserProfiles.module.css";
import commonStyles from "@/styles/Common.module.css";
import CButton from "@/components/reusable/CButton";
import { VJobValidation } from "@/validations/VJobForm";
import { CH2Label } from "@/components/reusable/labels/CH2Label";
import CoordinateService from "@/services/coordinates/CoordinateService";

const PostAJob = () => {
  const router = useRouter();
  const otherServices = new OtherDataServices();
  const { jobCategories } = useAuth();

  const [states, setStates] = useState<IStates[]>([]);
  const [cities, setCities] = useState<ICities[]>([]);
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string | undefined>();

  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email as string); // Set email from query parameter
    }
  }, [router.query.email]);

  // Setup the various lists for dropdown
  useEffect(() => {
    const setupMainData = async () => {
      var result = await ApiService.crud(APIDetails.fetchStates);
      if (result) {
        setStates(result[1]);
      }
      setIsLoading(false);
    };

    setupMainData();
  }, []);

  //get CoordinateService class object for randomizing coordinates
  const coordinateService = new CoordinateService();

  // Setup initial values for formik
  let initialValues: IPostJob = {} as IPostJob;

  // Setup previous values that we would use for comparison
  const previousValues = useRef<IPostJob>(initialValues);

  // Formik - This is used for form validation
  const formik = useFormik({
    initialValues: initialValues,

    onSubmit: async () => {
      setOnLoad(true);
      // Get job id of the category
      let t: IJobCategories | undefined = jobCategories.find(
        (i) => i.name == formik.values.jobType
      );
      let jobId: string = t?.id ?? "-";

      // Get id of the sub-category
      let st: ISubCategory | undefined = t?.subCategories?.find(
        (i) => i.name == formik.values.subCategory
      );
      let subJobId: string = st?.jobTypeId ?? "-";
      formik.values.jobTypeId = jobId;
      formik.values.subCategoryId = subJobId;

      //randomize coordinates
      let randomizedCoordinates = coordinateService.getRandomCoordinatesWithinRadius(
        formik.values.location?.coordinates!,0.25);
      formik.values.location!.coordinates = randomizedCoordinates;
      var result = await ApiService.crud(APIDetails.AdminJobPost, {
        ...formik.values,
        email: email,
      });
      if (result[0]) {
        alert("Job created successfully");
        router.replace(Routes.AdminDashboard);
      } else {
        alert(result[1]);
      }
      setOnLoad(false);
    },

    validate: async (val) => {
      // Get state and city basis the zipcode and update the map location as well
      if (
        val.zipCode != previousValues.current.zipCode &&
        val.zipCode?.length == 5
      ) {
        await updateZipCodeData(val.zipCode);
        // Update the previous values
        previousValues.current = val;
      }
    },

    validationSchema: VJobValidation,
  });

  const updateZipCodeData = async (zip: string) => {
    var result = await ApiService.crud(
      APIDetails.fetchZipCodeDetails,
      `?zipcode=${zip}`
    );

    if (result[0]) {
      let data: IZipCodeDetails = result[1];
      formik.values.state = data.state ?? "";
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
  const handleClose = () => router.push(Routes.AdminDashboard);

  if (isLoading) return <CCommonLoader />;

  return (
    <div className={`container-fluid ${commonStyles.displayDetailsWrapper}`}>
      <div className="col-md-12">
        <div className={`container p-4 mb-4 ${styles.viewProfileMain}`}>
          <div className="row align-items-center mb-4">
            <div className="col-md-6 text-start">
              <CH2Label label="Post A Job" />
            </div>
            <div className="col-md-6 text-end">
              <button
                onClick={handleClose}
                className="btn btn-secondary bgCancel"
                type="submit"
              >
                Back
              </button>
            </div>
          </div>
          <CJobForm
            formik={formik}
            states={states}
            cities={cities}
            onLoad={onLoad}
          />

          {/* Cancel and submit button */}
          <div className="d-flex flex-row justify-content-end mt-3">
            <CButton
              label="Cancel"
              buttonClassName="btn btn-secondary bgCancel"
              onClick={() => router.back()}
            />
            <CButton
              label="Save & Post"
              buttonClassName="btn btn-secondary bgPrimary"
              onClick={formik.handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(PostAJob);
