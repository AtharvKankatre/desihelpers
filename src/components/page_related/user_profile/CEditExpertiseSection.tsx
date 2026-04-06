import { JobDetailDto } from "@/models/UserProfileModel";
import { FunctionComponent, useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import jobStyles from "@/styles/Jobs.module.css";
import { CInput } from "@/components/form/CInput";
import { CCheckBox } from "@/components/form/CCheckBox";
import { CInputArea } from "@/components/form/CInputArea";
import { CTextIconButton } from "@/components/reusable/CTextIconButton";
import { STATIC_JOB_CATEGORIES } from "@/constants/EJobCategories";
import styles from "@/styles/Forms.module.css";
import { CH5Label } from "@/components/reusable/labels/CH5Label";

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
  // Derive the current subcategories based on the selected category
  const selectedCat = STATIC_JOB_CATEGORIES.find(
    (cat) => cat.name === e.jobType
  );
  const subCategoryOptions = selectedCat?.subCategories ?? [];

  // When category changes, clear the sub-category
  const handleCategoryChange = (catName: string) => {
    formik.setFieldValue(`jobDetails.${index}.jobType`, catName, true);
    formik.setFieldValue(`jobDetails.${index}.subCategory`, "", true);
  };

  if (e.isDeleted) {
    return <div />;
  }

  return (
    <div className={`row ${jobStyles.editProfileJobDetailsCard}`}>
      {/* Category Dropdown */}
      <div className={`col-lg-2 col-md-4 ${styles.selectWrapper}`}>
        <CH5Label label="Category" />
        <select
          className="form-select"
          value={e.jobType ?? ""}
          onChange={(ev) => handleCategoryChange(ev.target.value)}
        >
          <option value="">-- Select --</option>
          {STATIC_JOB_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sub-Category Dropdown — dynamically updates when category changes */}
      <div className={`col-lg-2 col-md-4 ${styles.selectWrapper}`}>
        <CH5Label label="Sub Category" />
        <select
          className="form-select"
          value={e.subCategory ?? ""}
          onChange={(ev) =>
            formik.setFieldValue(
              `jobDetails.${index}.subCategory`,
              ev.target.value,
              true
            )
          }
          disabled={subCategoryOptions.length === 0}
        >
          <option value="">-- Select --</option>
          {subCategoryOptions.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      <CInput
        className=" col-lg-2  col-md-2"
        id={`jobDetails.${index}.yearsOfExperience`}
        isEnabled={onLoad}
        name="Exp.(in yrs)"
        onChange={(e: { target: { value: any } }) => {
          const value = e.target.value;
          if (!isNaN(value) && Number(value) >= 0) {
            formik.handleChange(e);
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
