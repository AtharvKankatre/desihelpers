import { FunctionComponent } from "react";
import { CErrorString } from "@/components/form/CError";
import { CH5Label } from "../reusable/labels/CH5Label";
import styles from "@/styles/Forms.module.css";

type Props = {
  name: string;
  id: string;
  inputType?: string;
  hint?: string;
  className?: string | undefined;
  value: string | number;
  onChange: any;
  error?: any;
  isEnabled: boolean;
  isMandatory?: boolean;
  showTitle?: boolean;
  hideError?: boolean;
};

export const CInput: FunctionComponent<Props> = ({ ...Props }) => {
  return (
    <div className={`text-start ${Props.className}`}>
      {Props.showTitle == false ? null : (
        <div className="d-flex flex-row">
          <CH5Label label={Props.name} />
          {Props.isMandatory ? (
            <span className={`h6 ${styles.mandatoryIndicator}`}>{"*"}</span>
          ) : null}
        </div>
      )}
      <input
        name={Props.id}
        type={Props.inputType ?? "text"}
        className="form-control"
        id={Props.id}
        placeholder={Props.hint ?? ""}
        value={Props.value}
        onChange={Props.onChange}
        readOnly={Props.isEnabled}
      />
      {Props.hideError == true ? null : (
        <CErrorString
          error={Props.error}
          className={styles.errorMessageWithExtraHeight}
        />
      )}
    </div>
  );
};
