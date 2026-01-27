import { IPostJob } from "@/models/PostJob";
import { FormikProps } from "formik";
import { FunctionComponent } from "react";
import { CSelect } from "../form/CSelect";
import { useAuth } from "@/services/authorization/AuthContext";
import { IJobCategories, ISubCategory } from "@/models/JobCategories";
import { CInput } from "../form/CInput";
import { workType } from "@/constants/WorkType";
import { IStates } from "@/models/States";
import { ICities } from "@/models/Cities";
import { CGetUserLocation } from "../maps/CGetUserLocation";
import { ILocation } from "@/models/UserProfileModel";
import { CDateTimePicker } from "../form/CDateTimePicker";
import { CRadioButtons } from "../form/CRadios";
import { dietaryRestrictionsOptions } from "@/constants/EDietaryOptions";
import { CInputArea } from "../form/CInputArea";
import CButton from "../reusable/CButton";
import { payRange } from "@/constants/PayRange";
import { CCheckBox } from "../form/CCheckBox";

type Props = {
  formik: FormikProps<IPostJob>;
  onLoad: boolean;
  states: IStates[];
  cities: ICities[];
};

export const CJobForm: FunctionComponent<Props> = ({
  formik,
  onLoad,
  states,
  cities,
}) => {
  const { jobCategories } = useAuth();

  function returnSubCategories(): ISubCategory[] {
    let t: IJobCategories[] = jobCategories.filter(
      (j) => j.name == formik.values.jobType
    );
    if (t.length == 1) return t[0].subCategories ?? ([] as ISubCategory[]);
    return [] as ISubCategory[];
  }

  return (
    <div className="row">
      <CSelect
        className="col-lg-3 col-md-6"
        title="Category"
        name="jobType"
        hint="Select a category"
        onChange={formik}
        value={formik.values.jobType}
        readonly={onLoad}
        items={jobCategories.map((item) => (
          <option className="col-md-6 col-sm-12" key={item.id ?? "-"}>
            {item.name ?? "-"}
          </option>
        ))}
        error={formik.errors.jobType}
        isMandatory={true}
      />

      <CSelect
        className="col-lg-3 col-md-6"
        title="Sub-Category"
        name="subCategory"
        hint="Select a sub-category"
        onChange={formik}
        readonly={onLoad}
        value={formik.values.subCategory}
        items={returnSubCategories().map((item, index) => (
          <option key={`subCategories ${index}`} className="col-md-6 col-sm-12">
            {item.name ?? "-"}
          </option>
        ))}
        error={formik.errors.subCategory}
        isMandatory={true}
      />

      <CInput
        id="requiredExperience"
        name="Required Experience (Yrs)"
        showTitle={true}
        value={formik.values.requiredExperience ?? 0}
        onChange={formik.handleChange}
        key="experience"
        hint="Enter your experience"
        error={formik.errors.requiredExperience}
        className="col-lg-3 col-md-6 text-start"
        isEnabled={onLoad}
      />

      <CSelect
        className="col-lg-3 col-md-6"
        title="Full or Part Time"
        hint="Select an option"
        name="workType"
        value={formik.values.workType ?? ""}
        readonly={onLoad}
        onChange={formik}
        items={workType.map((item) => (
          <option className="col-md-6 col-sm-12" key={item}>
            {item}
          </option>
        ))}
        error={formik.errors.workType}
      />

      <CInput
        id="addressLine1"
        name="Address Line 1"
        value={formik.values.addressLine1}
        onChange={formik.handleChange}
        key="addressLine1"
        hint="Enter your address"
        error={formik.errors.addressLine1}
        className="col-md-6 text-start"
        isEnabled={onLoad}
        isMandatory={true}
      />

      <CInput
        id="addressLine2"
        name="Address Line 2"
        value={formik.values.addressLine2 ?? ""}
        onChange={formik.handleChange}
        key="addressLine2"
        hint="Enter your address"
        error={formik.errors.addressLine2}
        className="col-md-6 text-start"
        isEnabled={onLoad}
      />

      <div className="row mb-3 pe-0">
        <div className="col-lg-3 col-md-4 pe-0">
          <CInput
            className="col"
            id="zipCode"
            key="zipCode"
            name="Zip Code"
            isEnabled={onLoad}
            onChange={(e: { target: { value: any } }) => {
              const value = e.target.value;

              // Allow only positive numeric values (no negatives, no alphabets)
              if (/^\d*$/.test(value)) {
                formik.handleChange(e); // Call Formik's handleChange if the value is valid
              }
            }}
            value={formik.values.zipCode}
            isMandatory={true}
            error={formik.errors.zipCode}
          />

          <CInput
            id="state"
            name="State"
            inputType="text"
            hint="Input zipcode to auto-populate state"
            value={formik.values.state ?? ""}
            onChange={formik.handleChange}
            isMandatory={true}
            showTitle={true}
            error={formik.errors.state}
            isEnabled={true}
          />

          <CSelect
            className="col"
            title="City"
            hint="Select City"
            name="city"
            value={formik.values.city ?? ""}
            onChange={formik}
            isMandatory={true}
            error={formik.errors.city}
            items={cities.map((city) => (
              <option key={city.name} id={city.name}>
                {city.name}
              </option>
            ))}
          />
        </div>

        <div className="col-lg-9 col-md-8 text-start">
          <CGetUserLocation
            zipcode={formik.values.zipCode}
            onLocationSelect={(e) => {
              if (e != undefined) {
                let loc: ILocation = {
                  type: "Point",
                  coordinates: [e.lng!, e.lat!],
                };
                formik.setFieldValue("location", loc, true);
              }
            }}
            initialCoordinates={
              formik.values.location == null
                ? [-96.808891, 32.779167]
                : formik.values.location.coordinates ?? [-96.808891, 32.779167]
            }
          />
        </div>
      </div>

      <CDateTimePicker
        title="Start Date and Time"
        formik={formik}
        formikValue="startDate"
        error={formik.errors.startDate}
        className="col-md-4 text-start"
        readonly={onLoad}
        isMandatory={true}
        value={formik.values.startDate}
      />

      <CInput
        id="numberOfDays"
        name="No. of days per week"
        value={formik.values.numberOfDays ?? 0}
        onChange={formik.handleChange}
        key="numberOfDays"
        hint="No. of days per week"
        error={formik.errors.numberOfDays}
        isEnabled={onLoad}
        className="col-md-4 text-start"
      />

      {/* Row having pay range and dietary preference */}
      <CSelect
        className="col-md-4"
        title="Select Pay Range"
        hint="Select Pay Range"
        name="payRange"
        value={formik.values.payRange ?? ""}
        readonly={onLoad}
        onChange={formik}
        items={payRange.map((item) => (
          <option className="col-md-6 col-sm-12" key={item}>
            {item}
          </option>
        ))}
        error={formik.errors.payRange}
      />

      <CRadioButtons
        className="col-lg-4 col-md-8 mt-2"
        group="dietaryPreference"
        list={dietaryRestrictionsOptions}
        readonly={onLoad}
        title="Dietary Preference"
        onChange={formik.handleChange}
        value={formik.values.dietaryPreference ?? ""}
        error={formik.errors.dietaryPreference}
      />

      <CCheckBox
        className="col-lg-4 col-md-4"
        formik={formik}
        readonly={onLoad}
        title="Urgent Need"
        name="urgent"
        value={formik.values.urgent}
      />

      <CInputArea
        name="Additional Details"
        id="aboutRequirement"
        hint="Enter additional details"
        readonly={onLoad}
        onChange={formik.handleChange}
        error={formik.errors.aboutRequirement}
        value={formik.values.aboutRequirement}
        className="col-md-12"
        isMandatory={true}
      />
    </div>
  );
};
