import CButton from "@/components/reusable/CButton";
import ApiService from "@/services/data/crud/crud";
import { useFormik } from "formik";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import { useAuth } from "@/services/authorization/AuthContext";
import { IJobCategories, ISubCategory } from "@/models/JobCategories";
import { IPostJob } from "@/models/PostJob";
import { CCommonLoader } from "@/components/static/CommonLoader";
import { IStates } from "@/models/States";
import { ICities } from "@/models/Cities";
import { IJobs } from "@/models/Jobs";
import styles from "@/styles/UserProfiles.module.css";
import { ILocation } from "@/models/UserProfileModel";
import { CH1Label } from "../reusable/labels/CH1Label";
import { IZipCodeDetails } from "@/models/ZipcodeDetails";
import OtherDataServices from "@/services/other_data/OtherDataServices";
import { CJobForm } from "./CJobForm";
import { VJobValidation } from "@/validations/VJobForm";
import { CH4Label } from "../reusable/labels/CH4Label";
import { CH2Label } from "../reusable/labels/CH2Label";
import CoordinateService from "@/services/coordinates/CoordinateService";

type Props = {
  job: IJobs;
  closeEditing: () => void;
  normalCloseFn: () => void;
};

export const CEditAJob: FunctionComponent<Props> = ({
  job,
  closeEditing,
  normalCloseFn,
}) => {
  const { jobCategories } = useAuth();
  const otherServices = new OtherDataServices();

  const [states, setStates] = useState<IStates[]>([]);
  const [cities, setCities] = useState<ICities[]>([]);
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let initialValues: IPostJob = {
    jobTypeId: job.jobTypeId,
    jobType: job.jobType?.name ?? "",
    subCategory: job.subCategory ?? "",
    subCategoryId: "",
    requiredExperience: job.requiredExperience ?? 0,
    urgent: job.urgent ?? false,
    workType: job.workType ?? "",
    startDate: job.startDate,
    numberOfDays: job.numberOfDays ?? 0,
    addressLine1: job.addressLine1 ?? "",
    addressLine2: job.addressLine2 ?? "",
    state: job.state ?? "",
    city: job.city ?? "",
    zipCode: job.zipCode ?? "",
    payRange: job.payRange ?? "",
    dietaryPreference: job.dietaryPreference ?? "",
    aboutRequirement: job.aboutRequirement ?? "",
    location: job.location!,
  };
  const previousValues = useRef<IPostJob>(initialValues);

   //get CoordinateService class object for randomizing coordinates
  let coordinateService = new CoordinateService();

  useEffect(() => {
    const fetchData = async () => {
      let res: IStates[] = await otherServices.fetchStates();
      setStates(res);

      if (job?.state != null) {
        let t: IStates | undefined = Object.values(res).find(
          (e) => e.name == job.state
        );

        let c: ICities[] = await otherServices.fetchCities(t?.code ?? "");
        setCities(c);
      }
    };

    fetchData();
  }, []);

  // Formik - This is used for form validation
  const formik = useFormik<IPostJob>({
    initialValues: initialValues,
    validateOnMount: true,
    async onSubmit() {
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

      // randomize the coordinates if existing coordinates are changed
      if((formik.values.location?.coordinates![0] !== previousValues.current.location?.coordinates![0]) &&
      (formik.values.location?.coordinates![1] !== previousValues.current.location?.coordinates![1]))
      {
        let randomizedCoordinates = coordinateService.getRandomCoordinatesWithinRadius(
          formik.values.location?.coordinates! ,0.25
        )
        formik.values.location!.coordinates = randomizedCoordinates;
      }

      var result = await ApiService.crud(
        APIDetails.updateJob,
        job?.id ?? "-",
        formik.values
      );

      if (result[0]) {
        alert("Job updated successfully");
        closeEditing();
      } else {
        alert(result[1]);
      }

      setOnLoad(false);
    },
    async validate(val) {
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

    validationSchema: VJobValidation(),
  });

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

      let c: ICities[] = await otherServices.fetchCities(t?.code ?? "");
      setCities(c);
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

  if (isLoading) return <CCommonLoader />;

  return (
    <div className={`container-fluid`}>
      <div className="col-md-12">
        <div className={`container p-4 mb-4 ${styles.viewProfileMain}`}>
          <div className="row align-items-center mb-4">
            <div className="col-md-6 text-start">
              <CH4Label label="Edit Job" />
            </div>
            <div className="col-md-6 text-end">
              <button
                onClick={normalCloseFn}
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
          <div className="d-flex flex-row justify-content-end">
            <CButton
              label="Cancel"
              buttonClassName="btn btn-secondary bgCancel"
              onClick={normalCloseFn}
            />
            <CButton
              label="Update Post"
              buttonClassName="btn btn-secondary bgPrimary"
              onClick={formik.handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
