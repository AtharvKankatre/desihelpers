import { FunctionComponent } from "react";

type Props = {
  width?: string;
};

export const CAddWidth: FunctionComponent<Props> = ({ width }) => {
  return <div style={{ width: width ?? 0 }} />;
};
