import { NotificationType } from "@/types/notification";
import axiosInstance, { AxiosInstance } from "./config";

class NotificationApi {
  private static axios: AxiosInstance = axiosInstance;

  static getNotification = async (userId: string, type: NotificationType) => {
    console.log("getNotification", userId);
    try {
       const response = await this.axios.get(`/api/v1/notifications/${userId}?type=${type}`);
       return response.data?.data
    } catch (error) {
        console.log(" errr", error);
        throw error;
    }
  };

  static readNotification = async (id: string) => {
     console.log("id sssssss", id);
      await this.axios.put(`/api/v1/notifications/${id}`)
     try {
      
     } catch (error) {
        console.log("error", error);
        throw error;
     }
  }

  static deleteNotification = async (id: string) => {
     console.log("id sssssss", id);
      await this.axios.delete(`/api/v1/notifications/${id}`)
     try {
      
     } catch (error) {
        console.log("error", error);
        throw error;
     }
  }



}

export { NotificationApi };
