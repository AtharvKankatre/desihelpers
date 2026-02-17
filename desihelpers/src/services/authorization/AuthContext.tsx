// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import ApiService from "@/services/data/crud/crud";
import { APIDetails } from "../data/constants/ApiDetails";
import { sessionParams } from "@/constants/ESessionParams";
import { IJobCategories } from "@/models/JobCategories";
import Cookies from "js-cookie";
import { cookieParams } from "@/constants/ECookieParams";

interface AuthContextType {
  isActive: boolean;
  setIsActive: (status: boolean) => void;
  isSeeker: boolean;
  setIsSeeker: (status: boolean) => void;
  jobCategories: IJobCategories[];
  isProfileBuild: boolean;
  setIsProfileBuild: (status: boolean) => void;
  email:string;
  role:string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [jobCategories, setJobCategories] = useState<IJobCategories[]>([]);
  const [isSeeker, setIsSeeker] = useState<boolean>(false);
  const [isProfileBuild, setIsProfileBuild] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const activeStatus = Cookies.get(cookieParams.isActive);
    const seekerStatus = Cookies.get(cookieParams.isSeeker);
    const profileStatus = Cookies.get(cookieParams.isProfileBuild);

    setIsActive(activeStatus == "true" ? true : false);
    setIsSeeker(seekerStatus == "true" ? true : false);
    setIsProfileBuild(profileStatus == "true" ? true : false);

    if (profileStatus != "true") {
      const emailAdd = Cookies.get(cookieParams.email);
      setEmail(emailAdd ?? "");
    }

    const handleAuthChange = () => {
      const activeStatus = Cookies.get(cookieParams.isActive);
      const seekerStatus = Cookies.get(cookieParams.isSeeker);
      const profileStatus = Cookies.get(cookieParams.isProfileBuild);

      setIsActive(activeStatus == "true" ? true : false);
      setIsSeeker(seekerStatus == "true" ? true : false);
      setIsProfileBuild(profileStatus == "true" ? true : false);

      if (profileStatus != "true") {
        const emailAdd = Cookies.get(cookieParams.email);
        setEmail(emailAdd ?? "");
      }
    };

    window.addEventListener("isActiveChanged", handleAuthChange);
    window.addEventListener("isSeekerChanged", handleAuthChange);
    window.addEventListener("isProfileBuildChanged", handleAuthChange);
    window.dispatchEvent(new Event("emailChanged"));

    // Check if job types have been downloaded for a session or not.
    // If not then download them and store them over here
    if (jobCategories.length == 0) {
      fetchJobTypesFn();
    }

    return () => {
      window.removeEventListener("isActiveChanged", handleAuthChange);
      window.removeEventListener("isSeekerChanged", handleAuthChange);
      window.removeEventListener("isProfileBuildChanged", handleAuthChange);
      window.dispatchEvent(new Event("emailChanged"));
    };
  }, []);

  const fetchJobTypesFn = async () => {
    var result = await ApiService.crud(APIDetails.fetchJobTypes);
    if (result[0]) {
      setJobCategories(result[1]);
    }
    return;
  };

  return (
    <AuthContext.Provider
      value={{
        isActive,
        setIsActive,
        isSeeker,
        setIsSeeker,
        jobCategories,
        isProfileBuild,
        setIsProfileBuild,
        email,
        role
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
