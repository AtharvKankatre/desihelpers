import { FunctionComponent, useState } from "react";
import { CErrorString } from "@/components/form/CError";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import styles from "@/styles/Forms.module.css";
import { CH5Label } from "../reusable/labels/CH5Label";

type Props = {
  name: string;
  id: string;
  hint?: string;
  className?: string | undefined;
  value: string | number;
  onChange: any;
  error: any;
  isEnabled: boolean;
  isMandatory?: boolean;
  hideError?: boolean;
};

export const CPasswordInput: FunctionComponent<Props> = ({ ...Props }) => {
  const [type, setType] = useState<string>("password");

  const ontoggle = () => {
    if (type == "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  return (
    <div className={`mb-3 text-start ${Props.className}`}>
      <div className="d-flex flex-row">
      <CH5Label label={Props.name} />
      {Props.isMandatory ? (
            <span className={`h6 ${styles.mandatoryIndicator}`}>{"*"}</span>
          ) : null}
          </div>
      <div className="d-flex flex-row">
        <input
          name={Props.id}
          type={type}
          className={`form-control ${styles.passwordCSS}`}
          id={Props.id}
          placeholder={Props.hint}
          value={Props.value}
          onChange={Props.onChange}
          readOnly={Props.isEnabled}
        />
        <span
          className={`input-group-text float-end ${styles.passwordIconCSS}`}
          onClick={() => ontoggle()}
        >
          {type == "password" ?  <BiSolidHide /> : <BiSolidShow />}
        </span>
      </div>
      <CErrorString error={Props.error} />
    </div>
  );
};
