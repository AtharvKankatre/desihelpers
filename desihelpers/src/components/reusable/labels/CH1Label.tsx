import { FunctionComponent } from "react";
import { CLabel } from "./CLabel";

type Props = {
  className?: string;
  label: string;
};

export const CH1Label: FunctionComponent<Props> = ({ ...Props }) => (
  <CLabel label={Props.label} className={`h1 ${Props.className}`} />
);
