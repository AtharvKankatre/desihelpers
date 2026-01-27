import { IStates } from "@/models/States";
import { APIDetails } from "../data/constants/ApiDetails";
import ApiService from "@/services/data/crud/crud";
import { ICities } from "@/models/Cities";
import { ILanguages } from "@/models/Languages";

class OtherDataServices {
  constructor() {}

  public fetchStates = async () => {
    let list: IStates[] = [];
    var result = await ApiService.crud(APIDetails.fetchStates);
    if (result[0]) list = result[1];
    return list;
  };

  public fetchCities = async (stateCode: string) => {
    let list: ICities[] = [];
    var result = await ApiService.crud(APIDetails.fetchCities, stateCode);
    if (result[0]) list = result[1];
    return list;
  };

  public fetchLanguages = async () => {
    let list: string[] = [];
    var result = await ApiService.crud(APIDetails.fetchLanguages);
    if (result[0]) {
      let l: ILanguages[] = result[1];
      list = l.map((e) => e.language);
    }
    return list;
  };

  public uploadProfilePhoto = async (file: File, fileName: string) => {
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        return "Only .jpg, .jpeg, and .png files are allowed";
      }
      if (file.size > 2 * 1024 * 1024) {
        return "File size should be less than 2 MB";
      }

      var result = await ApiService.crud(APIDetails.uploadProfilePhoto, [
        file,
        fileName,
      ]);
      return result;
    }
  };

public uploadImages = async (files: File[], fileNames: string[]) => {
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  const maxFileSize = 500 * 1024; // 500KB
  const maxFiles = 3;

  if (files.length > maxFiles) {
    return [false, `You can only upload up to ${maxFiles} photos.`];
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!validTypes.includes(file.type)) {
      return [false, "Only .jpg, .jpeg, and .png files are allowed"];
    }
    if (file.size > maxFileSize) {
      return [false, `File size should be less than 500KB for each photo.`];
    }
  }

  const uploadPromises = files.map((file, index) => 
    ApiService.crud(APIDetails.uploadImages, [file, fileNames[index]])
      .catch(error => {
        throw new Error(`Failed to upload ${fileNames[index]}: ${error.message}`);
      })
  );

  try {
    const results = await Promise.all(uploadPromises);
    const newList = results.map((e) => e[1]); // Assuming e[1] is the URL or identifier of the uploaded file
    return [true, newList];
  } catch (error: any) {
    console.error(error);
    return [false, `Failed to upload photos: ${error.message}`];
  }
};
}

export default OtherDataServices;
