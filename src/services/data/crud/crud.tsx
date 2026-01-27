import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { APIDetails, ApiType } from "@/services/data/constants/ApiDetails";
import ProcessDataService from "@/services/data/process_data/ProcessData";
import CookieService from "@/services/authorization/CookieService";
import { IToken } from "@/models/TokenModel";
import { Routes } from "@/services/routes/Routes";
import AWS from "aws-sdk";
import Cookies from "js-cookie";

// Define the base URL for your API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const S3_BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
const REGION = process.env.NEXT_PUBLIC_AWS_REGION;

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private s3: AWS.S3;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEYID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESSKEY,
    });

    this.s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Setup the interceptor for axios
    this.axiosInstance.interceptors.request.use(async (config) => {

      if (config.headers["needsBearer"]) {
        let accessToken: string = CookieService.accessToken() ?? "";
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // Check if the error is 401 i.e. unauthorized
        if (error.response?.status == 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          // Call the function to get the new tokens using the refresh tokens
          try {
            await this.validateRefreshToken();
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${CookieService.accessToken()}`;

            return this.axiosInstance(originalRequest);
          } catch (error: any) {
            let msg: string = error.response?.data.message ?? "";
            if (msg === "jwt expired") {
              window.location.href = Routes.login;
              CookieService.clearCookies();
            }
          }
        }

        throw error;
      }
    );

    // End of axios interceptor
  }

  // This is the main function that is called outside the class
  public async crud(api: any[], data?: any, putData?: any): Promise<any> {
    let url: string = this.shouldDataBeAdded(api, data);
    let type: ApiType = api[1];
    let needsBearer: boolean = api[2];
    let config: object = {
      headers: {
        needsBearer: needsBearer,
      },
    };
    var res;

    let isSuccess: boolean = false;
    try {
      switch (type) {
        case ApiType.get:
          res = await this.get(url, config);
          break;
        case ApiType.post:
          res = await this.post(url, data, config);
          break;
        case ApiType.put:
          res = await this.put(url, putData, config);
          break;
        case ApiType.delete:
          res = await this.delete(url, config);
          break;

        case ApiType.s3upload:
          res = await this.uploadFile(data);
          break;
        case ApiType.s3delete:
          res = await this.deleteFile(data);
          break;

        case ApiType.multipart:
        default:
          res = "No api defined";
          break;
      }
      isSuccess = true;
    } catch (error) {
      res = error;
    }

    // Handle data storage if required i.e. process data
    if (isSuccess) {
      try {
        // It should always return a list
        if (type == ApiType.s3upload) {
          return ProcessDataService.processData(res, api[0]);
        } else {
          let result: AxiosResponse = res as AxiosResponse;
          return ProcessDataService.processData(result.data, api[0]);
        }
      } catch (error) {
        return [isSuccess, res];
      }
    }
    try {
      let err: AxiosError = res as AxiosError;
      let d: any = err.response?.data;
      return [isSuccess, d["message"]];
    } catch (error) {
      return [isSuccess, "Something went wrong"];
    }
  }

  // Method for GET requests
  private async get<T>(
    url: string,
    params?: object
  ): Promise<AxiosResponse<T>> {
    return await this.axiosInstance.get<T>(url, params);
  }

  // Method for POST requests
  private async post<T>(
    url: string,
    data?: object,
    config?: object
  ): Promise<AxiosResponse<T> | AxiosError<T>> {
    try {
      return await this.axiosInstance.post<T>(url, data, config);
    } catch (error) {
      throw error;
    }
  }

  // Method for PUT requests
  private async put<T>(
    url: string,
    data?: object,
    config?: object
  ): Promise<AxiosResponse<T>> {
    return await this.axiosInstance.put<T>(url, data, config);
  }

  // Method for DELETE requests
  private async delete<T>(
    url: string,
    params?: object
  ): Promise<AxiosResponse<T>> {
    return await this.axiosInstance.delete<T>(url, params);
  }

  // Method to get a new access token when the original one expires
  private async validateRefreshToken(): Promise<any> {
    try {
      let api: any = APIDetails.validateRefreshToken;
      let url: string = api[0];
      // Retrieve the refresh token from the cookies
      const refreshToken = Cookies.get("refreshToken");

      const res = await axios.post(
        url,
        { refreshToken },
        {
          baseURL: BASE_URL,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let data: IToken = res.data;
      CookieService.SetCookies(data);

      return true;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }

  private shouldDataBeAdded(api: any[], data: any) {
    switch (api) {
      case APIDetails.fetchCities:
      case APIDetails.deleteJob:
      case APIDetails.updateJob:
      case APIDetails.fetchZipCodeDetails:
      case APIDetails.getJobs:
      case APIDetails.getSeekers:
      case APIDetails.AdminDeleteUser:
      case APIDetails.AdminViewUser:
      case APIDetails.AdminMyJobPost:
      case APIDetails.AdminUpdateSeekerStatus:
      case APIDetails.getJobById:
      case APIDetails.ShareProfileSeeker:
        return `${api[0]}${data}`;

      default:
        return api[0];
    }
  }

  private uploadFile = async (data: any) => {
    let file: File = data[0];
    let fileName: string = data[1];

    const params: AWS.S3.PutObjectRequest = {
      Bucket: S3_BUCKET ?? "",
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };

    AWS.S3.ManagedUpload;

    var res;

    try {
      res = await new Promise((resolve, reject) => {
        this.s3.upload(params, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data.Location);
        });
      });
    } catch (error) {
      res = error;
    }

    return res;
  };

  private deleteFile = async (data: [File, string]) => {
    let file: File = data[0];
    let fileName: string = data[1];

    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: S3_BUCKET ?? "",
      Key: fileName,
    };

    try {
      const res = await this.s3.deleteObject(params).promise();
      return res;
    } catch (error: any) {
      console.error(`Failed to delete ${fileName} from ${S3_BUCKET}`, error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  };
}

export default new ApiService();

//
