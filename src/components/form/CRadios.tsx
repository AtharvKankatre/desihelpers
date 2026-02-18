import { FunctionComponent } from "react";
import { CH5Label } from "../reusable/labels/CH5Label";
import { CErrorString } from "./CError";
import styles from "@/styles/Forms.module.css";

type Props = {
  group: string;
  list: Array<string>;
  value: string;
  onChange: any;
  className?: string;
  title: string;
  readonly: boolean;
  error?: string;
};

export const CRadioButtons: FunctionComponent<Props> = ({ ...Props }) => {
  return (
    <div className={`text-start ${Props.className}`}>
      <CH5Label label={Props.title} />
      <div className="form-check form-check-inline">
        {Props.list.map((e) => (
          <div className="form-check form-check-inline" key={e}>
            <input
              className="form-check-input"
              type="radio"
              name={Props.group}
              id={e}
              value={e} // Set to the current option
              checked={Props.value === e} // Check if this option is selected
              onChange={Props.onChange} // Handle change event
              readOnly={Props.readonly}
            />
            <label className="form-check-label" htmlFor={e}>
              {e}
            </label>
          </div>
        ))}
        <CErrorString
          error={Props.error}
          className={styles.errorMessageWithExtraHeight}
        />
      </div>
    </div>
  );
};
