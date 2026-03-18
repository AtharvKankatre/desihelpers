import { FunctionComponent } from "react";

type Props = {
  children: any;
  className: string;
};

export const MainBG: FunctionComponent<Props> = ({ children, className }) => {
  return (
    <div
      className={`container-fluid ${className}`}
      style={{
        backgroundColor: '#f5f5f5', // Fallback neutral background
      }}
    >
      {children}
    </div>
  );
};
