import { IToken } from "@/models/TokenModel";
import { APIDetails } from "../constants/ApiDetails";
import CookieService from "@/services/authorization/CookieService";
import { IUserProfileModel } from "@/models/UserProfileModel";
import { IJobs } from "@/models/Jobs";
import { IStates } from "@/models/States";
import { ICities } from "@/models/Cities";
import { ILanguages } from "@/models/Languages";
import { IJobCategories } from "@/models/JobCategories";
import { IZipCodeDetails } from "@/models/ZipcodeDetails";

class ProcessDataService {
  public processData(data: any, api: string) {
    var res;
    try {
      switch (api) {
        case APIDetails.login[0]:
          res = this.processLogin(data as IToken);
          break;

        case APIDetails.fetchZipCodeDetails[0]:
          res = data as IZipCodeDetails;
          break;
        case APIDetails.getUserProfile[0]:
          res = data as IUserProfileModel;
          break;

        case APIDetails.getJobs[0]:
          res = data as IJobs[];
          break;

        case APIDetails.fetchStates[0]:
          res = data as IStates[];
          break;

        case APIDetails.fetchCities[0]:
          res = data as ICities[];
          break;

        case APIDetails.fetchLanguages[0]:
          res = data as ILanguages;
          break;

        case APIDetails.fetchJobTypes[0]:
          res = data as IJobCategories[];
          break;

        case APIDetails.sendPasswordResetEmail[0]:
          res = data;
          break;

        case APIDetails.forgotPassword[0]:
          res = data;
          break;

        case APIDetails.resendOTP[0]:
          res = data;
          break;

        case APIDetails.postJob[0]:
          res = data;
          break;

        case APIDetails.getMyJobs[0]:
          res = data as IJobs[];
          break;

        case APIDetails.deleteJob[0]:
          res = data;

        case APIDetails.signup[0]:
          res = data;
          break;

        case APIDetails.registrationOTP[0]:
          res = data;
          break;
        case APIDetails.verifyOTP[0]:
          res = data;
          break;
        case APIDetails.postUserProfile[0]:
          res = data;
          break;
        case APIDetails.updateUserProfile[0]:
          res = data;
          break;

        case APIDetails.changePassword[0]:
          res = data;
          break;

        case APIDetails.countMembers[0]:
          res = data;
          break;

        case APIDetails.updateJob[0]:
          res = data;

        case APIDetails.uploadProfilePhoto[0]:
          res = data;
          break;
        case APIDetails.uploadImages[0]:
          res = data;
          break;

        case APIDetails.getSeekers[0]:
          res = data as IUserProfileModel[];
          break;

        case APIDetails.updateSeekerStatus[0]:
          res = data;
          break;

        case APIDetails.deleteWorkPhotos[0]:
          res = data;
          break;
        case APIDetails.contactUs[0]:
          res = data;
          break;
        case APIDetails.AdminContactDetails[0]:
          res = data;
          break;
        case APIDetails.AdminUserDetails[0]:
          res = data;
          break;
        case APIDetails.AdminDeleteUser[0]:
          res = data;

          break;
        case APIDetails.AdminViewUser[0]:
          res = data;
          break;
        case APIDetails.AdminUpdateUserProfile[0]:
          res = data;
          break;
        case APIDetails.AdminSignUp[0]:
          res = data;
          break;
        case APIDetails.AdminBuildProfile[0]:
          res = data;
          break;
        case APIDetails.AdminJobPost[0]:
          res = data;
          break;
        case APIDetails.AdminMyJobPost[0]:
          res = data;
          break;
        case APIDetails.AdminUpdateSeekerStatus[0]:
          res = data;
          break;
        case APIDetails.ShareProfileSeeker[0]:
          res = data;
          break;
        case APIDetails.sendLoginOTP[0]:
          res = data;
          break;
        case APIDetails.verifyLoginOTP[0]:
          res = data;
          break;
        case APIDetails.addRemovefavoriteJob[0]:
          res = data;
          break;
        case APIDetails.getJobFavorites[0]:
          res = data;
          break;
        case APIDetails.addRemoveFavoriteProfile[0]:
          res = data;
          break;
        case APIDetails.getProfileFavorites[0]:
          res = data;
          break;
        case APIDetails.getJobFavoriteCount[0]:
          res = data;
          break;
        case APIDetails.getProfileFavoriteCount[0]:
          res = data;
          break;
        case APIDetails.postFeedback[0]:
          res = data;
          break;
        case APIDetails.getFeedback[0]:
          res = data;
          break;
        case APIDetails.getJobsByUser[0]:
          res = data;
          break;
        case APIDetails.updateFeedback[0]:
          res = data;
          break;
        case APIDetails.deleteFeedback[0]:
          res = data;
          break;
        // Chat endpoints — pass raw data through
        case APIDetails.getOrCreateConversation[0]:
          res = data;
          break;
        case APIDetails.getConversations[0]:
          res = data;
          break;
        case APIDetails.getMessages[0]:
          res = data;
          break;
        case APIDetails.markMessagesRead[0]:
          res = data;
          break;
        case APIDetails.getUnreadMessageCount[0]:
          res = data;
          break;
        // Notification endpoints
        case APIDetails.getNotifications[0]:
          res = data;
          break;
        case APIDetails.markNotificationRead[0]:
          res = data;
          break;
        case APIDetails.markAllNotificationsRead[0]:
          res = data;
          break;
        case APIDetails.getUnreadNotificationCount[0]:
          res = data;
          break;
        case APIDetails.createNotification[0]:
          res = data;
          break;
        default:
          return [false, "Something went wrong"];
      }

      // Return the final values
      return [true, res];
    } catch (error) {
      // If an error is encountered
      return [false, "Something went wrong"];
    }
  }

  private processLogin(data: IToken) {
    CookieService.SetCookies(data);
    return data;
  }
}

export default new ProcessDataService();
