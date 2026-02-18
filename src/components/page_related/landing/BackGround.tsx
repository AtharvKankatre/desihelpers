import bg from "/public/main_banner_bg.png";
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
        backgroundImage: `url(${bg.src})`,
      }}
    >
      {children}
    </div>
  );
};
