import { FunctionComponent } from "react";
import { CLabel } from "./CLabel";
import styles from "@/styles/Home.module.css";

type Props = {
  label: string;
};

export const CBannerLabel: FunctionComponent<Props> = ({ label }) => {
  return <CLabel className={styles.bannerText} label={label} />;
};
