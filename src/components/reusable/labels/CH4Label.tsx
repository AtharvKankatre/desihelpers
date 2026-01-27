import { FunctionComponent } from "react";
import { CLabel } from "./CLabel";
import React, { ReactNode } from 'react';

type Props = {
  className?: string;
  label:React.ReactNode;
};

export const CH4Label: FunctionComponent<Props> = ({ ...Props }) => (
  <CLabel label={Props.label} className={`h4 ${Props.className}`} />
);
