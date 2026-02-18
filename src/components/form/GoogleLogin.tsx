import { FunctionComponent } from "react";
import { CIconTextButton } from "./CIconTextButton";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiBaseUrl = process.env.NEXT_PUBLIC_Base_API_URL;

type Props = {
  onLoad: boolean;
};

export const CGoogleLogin: FunctionComponent<Props> = ({ onLoad }) => {
  const googleLoginFn = () => {
    window.location.href = `${apiUrl}auth/google?redirect_uri=${apiBaseUrl}api/auth/google/callback`;
  };
  return (
    <Link
      href={`${apiUrl}auth/google?redirect_uri=${apiBaseUrl}api/auth/google/callback`}
    >
      <CIconTextButton
        img="/assets/icons/icon_google-logo.svg" // Path to your SVG file
        alt="Google"
        label="Google"
        onClick={googleLoginFn}
        className="col-md-12"
        color="white"
        fgColor="black"
        readonly={onLoad}
      />
    </Link>
  );
};
