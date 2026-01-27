import { FunctionComponent } from "react";
import { CLabel } from "./CLabel";
import styles from "@/styles/Common.module.css";

type Props = {
  className?: string;
  label: string;
};

export const CH8Label: FunctionComponent<Props> = ({ ...Props }) => (
  <CLabel
    label={Props.label}
    className={`${styles.h8CSS} ${Props.className}`}
  />
);
