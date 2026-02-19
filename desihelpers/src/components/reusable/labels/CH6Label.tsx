import { FunctionComponent } from "react";
import { CLabel } from "./CLabel";
import styles from "@/styles/Common.module.css";

type Props = {
  className?: string;
  label: string;
};

export const CH6Label: FunctionComponent<Props> = ({ ...Props }) => (
  <CLabel
    label={Props.label}
    className={`h6 ${styles.h6CSS} ${Props.className}`}
  />
);
