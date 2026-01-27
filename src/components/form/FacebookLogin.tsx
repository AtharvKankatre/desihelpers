import { FunctionComponent } from "react";
import { CIconTextButton } from "./CIconTextButton";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiBaseUrl = process.env.NEXT_PUBLIC_Base_API_URL;

type Props = {
  onLoad: boolean;
};

export const CFacebookLogin: FunctionComponent<Props> = ({ onLoad }) => {
  const facebookLoginFn = () => {
    window.location.href = `${apiUrl}auth/facebook?redirect_uri=${apiBaseUrl}api/auth/facebook/callback`;
  };
  return (
    <Link
      href={`${apiUrl}auth/facebook?redirect_uri=${apiBaseUrl}api/auth/facebook/callback`}
    >
      <CIconTextButton
        img="/assets/icons/icon_facebook_logo.svg" // Path to your SVG file
        alt="Facebook"
        label="Facebook"
        onClick={facebookLoginFn}
        className="col-md-12"
        color="#1877F2"
        fgColor="white"
        readonly={onLoad}
      />
    </Link>
  );
};
