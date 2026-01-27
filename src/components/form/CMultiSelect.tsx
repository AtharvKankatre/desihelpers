import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { ILanguages } from "@/models/Languages";
import { CH5Label } from "../reusable/labels/CH5Label";
import styles from "@/styles/Forms.module.css";
import { CErrorString } from "./CError";
import OtherDataServices from "@/services/other_data/OtherDataServices";

interface LanguageSelectProps {
  value: string[];
  onChange: (selected: string[]) => void;
  onBlur: () => void;
  name: string;
  isMandatory?: boolean;
  className?: string;
  error?: any;
  hideError?: boolean;
  id: string;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onChange,
  onBlur,
  name,
  isMandatory,
  className,
  error,
  hideError,
  id,
}) => {
  const [languages, setLanguages] = useState<string[]>([]);
  const otherServices = new OtherDataServices();
  useEffect(() => {
    const fetch = async () => {
      setLanguages(await otherServices.fetchLanguages());
    };

    fetch();
  }, []);

  const handleChange = (
    selectedOptions: MultiValue<{ value: string; label: string }>
  ) => {
    const selectedLanguages = selectedOptions
      ? selectedOptions.map((option) => ({
          language: option.label,
          code: option.value,
        }))
      : [];
    onChange(selectedLanguages.map((e) => e.language));
  };

  const selectOptions = languages.map((option) => ({
    value: option,
    label: option,
  }));

  const selectedValues = value.map((lang) => ({
    value: lang,
    label: lang,
  }));

  return (
    <div>
      <div className="d-flex flex-row">
        <CH5Label label={name} />
        {isMandatory ? (
          <span className={`h6 ${styles.mandatoryIndicator}`}>{"*"}</span>
        ) : null}
      </div>
      <Select
        isMulti
        value={selectedValues}
        options={selectOptions}
        onChange={handleChange}
        onBlur={onBlur}
        name={id}
      />
      {hideError == true ? null : (
        <CErrorString
          error={error}
          className={styles.errorMessageWithExtraHeight}
        />
      )}
    </div>
  );
};

export default LanguageSelect;
