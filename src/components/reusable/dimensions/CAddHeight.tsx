import { FunctionComponent } from "react";

type Props = {
  height?: string;
};

export const CAddHeight: FunctionComponent<Props> = ({ height }) => {
  return <div style={{ height: height ?? 0 }} />;
};
