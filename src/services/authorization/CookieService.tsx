import { IToken } from "@/models/TokenModel";
import Cookies from "js-cookie";
import base64url from "base64url";
import { IPayload } from "@/models/Payload";
import { cookieParams } from "@/constants/ECookieParams";
import Roles from "@/constants/ERoles";

class CookieService {
  public SetCookies = (data: IToken) => {
    let params: any = {
      secure: true,
      expires: 2,
      sameSite: "lax",
    };

    const parts = data.access_token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid access token format");
    }

    const payload = base64url.decode(parts[1]);
    const parsedPayload: IPayload = JSON.parse(payload) as IPayload;

    Cookies.set(cookieParams.accessToken, data.access_token, params);
    Cookies.set(cookieParams.refreshToken, data.refresh_token, params);
    if(parsedPayload.roles?.includes(Roles.Admin)){
      Cookies.set(cookieParams.role, parsedPayload.roles?.includes(Roles.Admin) ? Roles.Admin : "", params);
    }
    if(parsedPayload.roles?.includes(Roles.SubAdmin)){
      Cookies.set(cookieParams.role, parsedPayload.roles?.includes(Roles.SubAdmin) ? Roles.SubAdmin : "", params);
    }
  
   
    Cookies.set(cookieParams.isActive, "true", params);
    Cookies.set(
      cookieParams.isSeeker,
      parsedPayload.roles?.includes("Job Seeker") ? "true" : "false",
      params
    );
    Cookies.set(
      cookieParams.isProfileBuild,
      parsedPayload.isProfile == true ? "true" : "false",
      params
    );
    if (parsedPayload.isProfile != true) {
      Cookies.set(cookieParams.email, parsedPayload.email ?? "", params);
    }

    // Setup events to track changes
    window.dispatchEvent(new Event("isActiveChanged"));
    window.dispatchEvent(new Event("isSeekerChanged"));
    window.dispatchEvent(new Event("isProfileBuildChanged"));
    window.dispatchEvent(new Event("emailChanged"));
    return;
  };

  public clearCookies() {
    Object.keys(cookieParams).map((e) => Cookies.remove(e));
    sessionStorage.clear();
    window.dispatchEvent(new Event("isActiveChanged"));
    window.dispatchEvent(new Event("isSeekerChanged"));
    window.dispatchEvent(new Event("isProfileBuildChanged"));
    window.dispatchEvent(new Event("emailChanged"));

    return;
  }

  public accessToken = () => Cookies.get(cookieParams.accessToken);
  public refreshToken = () => Cookies.get(cookieParams.refreshToken);
  public isActive = () =>
    Cookies.get(cookieParams.isActive) == "true" ? true : false;
}

export default new CookieService();
