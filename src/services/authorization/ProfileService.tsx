import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ComponentType } from "react";
import { Routes } from "../routes/Routes";
import { CircularProgress } from "@mui/material";
import { cookieParams } from "@/constants/ECookieParams";
import Cookies from "js-cookie";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);
      const activeStatus = Cookies.get(cookieParams.isActive);
      let status: boolean = activeStatus == "true" ? true : false;
      if (status == false) {
        router.push(Routes.login);
      }
      setLoading(false);
    }, [router]);

    if (loading) {
      return (
        <div className="container-fluid">
          <div className="row justify-content-center">
            <CircularProgress />
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
