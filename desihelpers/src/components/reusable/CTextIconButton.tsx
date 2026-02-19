import { FunctionComponent } from "react";
import { CH6Label } from "./labels/CH6Label";

type Props = {
  label: string;
  icon: string;
  clasName?: string;
  onClick: () => void;
  buttonStyle: string;
  textStyle: string;
};

export const CTextIconButton: FunctionComponent<Props> = ({ ...Props }) => {
  return <img src={Props.icon} onClick={Props.onClick} />;
};
