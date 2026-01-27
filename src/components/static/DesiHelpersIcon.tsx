import { FunctionComponent } from "react";
import styles from "@/styles/Common.module.css";

const DesiHelpersIcon: FunctionComponent = ({}) => {
  return (
    <div className="d-flex flex-row align-items-baseline">
      <img
        src="/DesiHelpers_without-tag-line.svg"
        alt="desihelpers"
        style={{ maxHeight: "40px" }}
      />
    </div>
  );
};

export default DesiHelpersIcon;
