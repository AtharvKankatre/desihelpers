import { JobDetailDto } from "@/models/UserProfileModel";
import { FunctionComponent, useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import jobStyles from "@/styles/Jobs.module.css";
import { useAuth } from "@/services/authorization/AuthContext";
import { CSelect } from "@/components/form/CSelect";
import { CInput } from "@/components/form/CInput";
import { CCheckBox } from "@/components/form/CCheckBox";
import { CInputArea } from "@/components/form/CInputArea";
import { IJobCategories, ISubCategory } from "@/models/JobCategories";
import { Form } from "react-bootstrap";
import { CTextIconButton } from "@/components/reusable/CTextIconButton";

type Props = {
  formik: any;
  e: JobDetailDto;
  index: number;
  onLoad: boolean;
};

export const CEditExpertiseSection: FunctionComponent<Props> = ({
  formik,
  e,
  index,
  onLoad,
}) => {
  const { jobCategories } = useAuth();

  function returnSubCategories(): ISubCategory[] {
    let t: IJobCategories[] = jobCategories.filter((j) => j.name == e.jobType);
    if (t.length == 1) return t[0].subCategories ?? ([] as ISubCategory[]);
    return [] as ISubCategory[];
  }

  if (e.isDeleted) {
    return <div />;
  }
  return (
    <div className={`row ${jobStyles.editProfileJobDetailsCard}`}>
      <CSelect
        className="col-lg-2 col-md-4"
        items={jobCategories.map((e) => (
          <option key={e.id ?? "-"}>{e.name ?? "-"}</option>
        ))}
        name={`jobDetails.${index}.jobType`}
        onChange={formik}
        title="Category"
        value={e.jobType ?? "NA"}
      />

      <CSelect
        className=" col-lg-2  col-md-4"
        items={returnSubCategories().map((item, ind) => (
          <option
            key={`${item.jobTypeId}${ind}`}
            className="col-md-6 col-sm-12"
          >
            {item.name ?? "-"}
          </option>
        ))}
        name={`jobDetails.${index}.subCategory`}
        onChange={formik}
        title="Sub Category"
        value={e.subCategory ?? ""}
      />

      <CInput
        className=" col-lg-2  col-md-2"
        id={`jobDetails.${index}.yearsOfExperience`}
        isEnabled={onLoad}
        name="Exp.(in yrs)"
        onChange={(e: { target: { value: any } }) => {
          const value = e.target.value;
          // Allow only positive numbers and zero
          if (!isNaN(value) && Number(value) >= 0) {
            formik.handleChange(e); // Call Formik's handleChange if the value is valid
          }
        }}
        value={e.yearsOfExperience ?? 0}
      />

      <CCheckBox
        formik={formik}
        name={`jobDetails.${index}.available`}
        value={e.available}
        title="Available"
        className="col-lg-2  col-md-4"
      />

      <CCheckBox
        formik={formik}
        name={`jobDetails.${index}.postOnProfile`}
        value={e.postOnProfile}
        title="Post on profile"
        className="col-lg-2  col-md-4"
      />

      <CInputArea
        name="Description"
        id={`jobDetails.${index}.description`}
        hint="Enter your description here"
        value={formik.values.jobDetails[index]?.description ?? ""}
        onChange={formik.handleChange}
        readonly={onLoad}
        wordLimit={500}
        isMandatory
      />

      <div className="d-flex flex-row justify-content-end w-100">
        <CTextIconButton
          label="Delete"
          icon="/assets/icons/icon_delete.svg"
          buttonStyle="btn"
          textStyle="text-danger"
          // className="col-md-12 text-end text-danger"
          onClick={() => {
            const newExpertiseArray = formik.values.jobDetails.map!(
              (item: JobDetailDto, i: number) =>
                i === index ? { ...item, isDeleted: true } : item
            );
            formik.setFieldValue("jobDetails", newExpertiseArray);
          }}
        />
      </div>
    </div>
  );
};
