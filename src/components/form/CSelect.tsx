import { FunctionComponent } from "react";
import styles from "@/styles/Forms.module.css";
import { CErrorString } from "@/components/form/CError";
import { CH5Label } from "../reusable/labels/CH5Label";

type Props = {
  title: string;
  items: any;
  className?: string;
  hint?: string;
  value: string | number;
  error?: any;
  onChange: any;
  name: string;
  readonly?: boolean;
  isMandatory?: boolean;
  showTitle?: boolean;
  hideError?: boolean;
};

export const CSelect: FunctionComponent<Props> = ({ ...Props }) => {
  const onSelect = (e: any) => {
    if (e.target.value == "--Select--") {
      Props.onChange.setFieldValue(Props.name, "", true);
    } else {
      Props.onChange.setFieldValue(Props.name, e.target.value, true);
    }
  };

  return (
    <div className={`${styles.selectWrapper} ${Props.className}`}>
      {Props.showTitle == false ? null : (
        <div className="d-flex flex-row">
          <CH5Label label={Props.title} />
          {Props.isMandatory ? (
            <span className={`h6 ${styles.mandatoryIndicator}`}>{"*"}</span>
          ) : null}
        </div>
      )}
      <select
        name={Props.name}
        value={Props.value}
        className="form-select"
        onChange={onSelect}
        disabled={Props.readonly}
      >
        <option>{Props.hint ?? "--Select--"}</option>
        {Props.items}
      </select>
      {Props.hideError == true ? null : (
        <CErrorString
          error={Props.error}
          className={styles.errorMessageWithExtraHeight}
        />
      )}
    </div>
  );
};
