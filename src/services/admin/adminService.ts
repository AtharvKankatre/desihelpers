import { IUsers } from "@/models/UsersModel";
import { adminStore } from "@/stores/AdminStore";
import { APIDetails } from "@/services/data/constants/ApiDetails";
import ApiService from "@/services/data/crud/crud";

class AdminServices {
    aStore = adminStore();
    

    public fetchAdminDashboardPageUsers = async (forceRefresh = false): Promise<IUsers[]> => {
        const currentTime = Date.now();
        const lastUpdatedTime = this.aStore.dateTime ?? 0;

        if ( !forceRefresh && this.aStore.users.length > 0 && (currentTime - lastUpdatedTime) < 900000) {
          return this.aStore.users;
        }
        // else fetch new value
        let list: IUsers[] = await ApiService.crud(APIDetails.AdminUserDetails);
        if (list.length > 0) {
          this.aStore.setUserDetails(list);
          this.aStore.setData(Date.now());
        }
        return list;
      };

}

export default AdminServices;
