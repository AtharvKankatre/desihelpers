import { FunctionComponent } from "react";
import styles from "@/styles/Forms.module.css";

type Props = {
  error?: string;
  className?: string;
};

export const CErrorString: FunctionComponent<Props> = ({ ...Props }) => {
  return (
    <div className={Props.className ?? styles.errorMessage}>
      <div className="text-danger">{Props.error}</div>
    </div>
  );
};
