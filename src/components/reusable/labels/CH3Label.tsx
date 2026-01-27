import { FunctionComponent } from "react";
import { CLabel } from "./CLabel";

type Props = {
  className?: string;
  label: string;
};

export const CH3Label: FunctionComponent<Props> = ({ ...Props }) => (
  <CLabel label={Props.label} className={`h3 ${Props.className}`} />
);
