import { CInputArea } from "@/components/form/CInputArea";
import { CRadioButtons } from "@/components/form/CRadios";
import { CExpandablePanel } from "@/components/reusable/CExpandablePanel";
import { dietaryRestrictionsOptions } from "@/constants/EDietaryOptions";
import { FunctionComponent } from "react";

type Props = {
  formik: any;
  onLoad: boolean;
};

export const CEditAboutMe: FunctionComponent<Props> = ({ formik, onLoad }) => {
  return (
    <CExpandablePanel
      title="Other Details"
      id={"editAboutMe"}
      isExpanded="show"
    >
      <div className="row">
        <CInputArea
          id="aboutMe"
          name="About Me"
          onChange={formik.handleChange}
          readonly={onLoad}
          value={formik.values.aboutMe}
        />

        <CRadioButtons
          className="col-md-4"
          group={"commutePreference"}
          list={["Have a ride", "Will need a ride"]}
          value={formik.values.commutePreference}
          onChange={formik.handleChange}
          title={"Commute Preference"}
          readonly={onLoad}
        />
        <CRadioButtons
          className="col-md-4"
          group="diet"
          list={dietaryRestrictionsOptions}
          readonly={onLoad}
          title="Dietary Preference"
          onChange={(event: { target: { value: any } }) =>
            formik.setFieldValue("dietaryRestrictions", event.target.value)
          }
          value={formik.values.dietaryRestrictions}
        />
        <CRadioButtons
          className="col-md-4"
          group="okWithPets"
          list={["Yes", "No"]}
          readonly={onLoad}
          title="OK With Pets"
          onChange={(e: { target: { value: string } }) => {
            const booleanValue = e.target.value == "Yes" ? true : false;
            formik.setFieldValue("okWithPets", booleanValue);
          }}
          value={
            formik.values.okWithPets == true
              ? "Yes"
              : formik.values.okWithPets == false
              ? "No"
              : ""
          }
        />
      </div>
    </CExpandablePanel>
  );
};
