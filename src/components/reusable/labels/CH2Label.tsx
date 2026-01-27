import { FunctionComponent } from "react";
import { CLabel } from "./CLabel";

type Props = {
  className?: string;
  label:React.ReactNode;
};

export const CH2Label: FunctionComponent<Props> = ({ ...Props }) => (
  <CLabel label={Props.label} className={`h2 ${Props.className}`} />
);
