import { FunctionComponent } from "react";
import { CLabel } from "./CLabel";
import styles from "@/styles/Common.module.css";
import useTranslation from "next-translate/useTranslation";

type Props = {
  className?: string;
  label: string;
  children?:any;
};

export const CParagraph: FunctionComponent<Props> = ({ ...Props }) => {
  const { t } = useTranslation("common");
  return <p className={`'h6' ${Props.className}`}>{t(Props.label)} {Props.children} </p>
}
  

