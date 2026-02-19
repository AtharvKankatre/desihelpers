import { CCheckBox } from "@/components/form/CCheckBox";
import { CInput } from "@/components/form/CInput";
import LanguageSelect from "@/components/form/CMultiSelect";
import { CSelect } from "@/components/form/CSelect";
import { CGetUserLocation } from "@/components/maps/CGetUserLocation";
import { CExpandablePanel } from "@/components/reusable/CExpandablePanel";
import { ICities } from "@/models/Cities";
import { IStates } from "@/models/States";
import { ILocation } from "@/models/UserProfileModel";
import { FunctionComponent } from "react";

type Props = {
  formik: any;
  onLoad: boolean;
  cities: ICities[];
  email: string;
};

export const CEditPersonalDetails: FunctionComponent<Props> = ({
  formik,
  onLoad,
  cities,
  email,
}) => {
  formik.values.email = email;
  return (
    <CExpandablePanel
      title="Personal Details"
      id="editPersonalDetails"
      isExpanded="show"
    >
      <div className="row">
        <CInput
          className="col-md-4"
          id="firstName"
          name="First Name"
          isEnabled={onLoad}
          onChange={formik.handleChange}
          value={formik.values.firstName}
          isMandatory={true}
          error={formik.errors.firstName}
        />
        <CInput
          className="col-md-4"
          id="lastName"
          name="Last Name"
          isEnabled={onLoad}
          onChange={formik.handleChange}
          value={formik.values.lastName}
          isMandatory={true}
          error={formik.errors.lastName}
        />
        <CInput
          className="col-md-4"
          id="displayName"
          name="Display Name"
          isEnabled={onLoad}
          onChange={formik.handleChange}
          value={formik.values.displayName}
          isMandatory={true}
          error={formik.errors.displayName}
        />
        <CInput
          className="col-md-6"
          id="addressLine1"
          name="Address Line 1"
          isEnabled={onLoad}
          onChange={formik.handleChange}
          value={formik.values.addressLine1}
          isMandatory={true}
          error={formik.errors.addressLine1}
        />
        <CInput
          className="col-md-6"
          id="addressLine2"
          name="Address Line 2"
          isEnabled={onLoad}
          onChange={formik.handleChange}
          value={formik.values.addressLine2}
          error={formik.errors.addressLine2}
        />

        <div className="row mb-3">
          <div className="col-md-3">
            <CInput
              className="col"
              id="zipCode"
              name="Zip Code"
              isEnabled={onLoad}
              onChange={(e: { target: { value: any } }) => {
                const value = e.target.value;

                // Allow only positive numeric values
                if (/^\d*$/.test(value) && Number(value) >= 0) {
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
              value={formik.values.city}
              onChange={formik}
              items={cities.map((city) => (
                <option key={city.name} id={city.name}>
                  {city.name}
                </option>
              ))}
            />
          </div>

          <div className="col-md-9">
            <CGetUserLocation
              zipcode={formik.values.zipCode}
              onLocationSelect={(e) => {
                let loc: ILocation = {
                  type: "Point",
                  coordinates: [e.lng!, e.lat!],
                };
                formik.setFieldValue("location", loc, true);
              }}
              initialCoordinates={
                formik.values.location == null
                  ? [-96.808891, 32.779167]
                  : formik.values.location.coordinates ?? [
                      -96.808891, 32.779167,
                    ]
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            {" "}
            <CInput
              id="email"
              name="Email"
              isEnabled={true}
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </div>

          <div className="col-md-9">
            <LanguageSelect
              name="Spoken Languages"
              value={formik.values.languagesSpoken ?? []}
              onChange={(selectedLanguages) =>
                formik.setFieldValue("languagesSpoken", selectedLanguages)
              }
              onBlur={() => formik.setFieldTouched("languages", true)}
              error={formik.errors.languagesSpoken}
              id="languagesSpoken"
            />
          </div>
        </div>

        <CInput
          className="col-md-3"
          id="phone"
          name="Mobile"
          isEnabled={onLoad}
          onChange={formik.handleChange}
          value={formik.values.phone}
          isMandatory={true}
          error={formik.errors.phone}
        />

        <CCheckBox
          formik={formik}
          name="showPhone"
          title={`Show "Phone No." on profile`}
          value={formik.values.showPhone}
          readonly={onLoad}
          className="col-md-3"
        />

        <CInput
          className="col-md-3"
          id="mobile"
          name="WhatsApp"
          isEnabled={onLoad}
          onChange={formik.handleChange}
          value={formik.values.mobile}
          error={formik.errors.mobile}
        />
        <CCheckBox
          formik={formik}
          name="showMobile"
          title={`Show "WhatsApp No." on profile`}
          value={formik.values.showMobile}
          readonly={onLoad}
          className="col-md-3"
        />

        <CInput
          className="col-md-4"
          id="facebookLink"
          name="Facebook Link"
          isEnabled={onLoad}
          onChange={formik.handleChange}
          value={formik.values.facebookLink}
          error={formik.errors.facebookLink}
        />

        <CInput
          className="col-md-4"
          id="instagram"
          name="Instagram Link"
          isEnabled={onLoad}
          onChange={formik.handleChange}
          value={formik.values.instagram}
          error={formik.errors.instagram}
        />

        <CInput
          className="col-md-4"
          id="websiteLink"
          name="Website Link"
          isEnabled={onLoad}
          onChange={formik.handleChange}
          value={formik.values.websiteLink}
          error={formik.errors.websiteLink}
        />
      </div>
    </CExpandablePanel>
  );
};
