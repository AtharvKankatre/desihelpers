import { FunctionComponent } from "react";
import { CLabel } from "./CLabel";
import styles from "@/styles/Common.module.css";

type Props = {
  className?: string;
  label: string;
};

export const CH5Label: FunctionComponent<Props> = ({ ...Props }) => (
  <CLabel
    label={Props.label}
    className={`h5 ${styles.h5CSS} ${Props.className}`}
  />
);
