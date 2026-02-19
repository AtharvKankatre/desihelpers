import { FunctionComponent } from "react";
import styles from "@/styles/Common.module.css";

type Props = {
  children: any;
};

export const CDisplayDetailsWrapper: FunctionComponent<Props> = ({
  children,
}) => {
  return (
    <div className="container-fluid">
      <div className={`row ${styles.displayDetailsWrapper}`}>{children}</div>
    </div>
  );
};
