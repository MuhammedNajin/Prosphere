import { FilterType } from "@/types/notification";
import axiosInstance from "./config";
import { AxiosInstance } from "axios";

class NotificationApi {
  private static axios: AxiosInstance = axiosInstance;

  static getNotification = async (userId: string, type: FilterType) => {
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

  static bulkDeleteNotification = async (ids: string[]) => {
     console.log("id sssssss", ids);
      await this.axios.delete(`/api/v1/notifications`, { data: { ids }})
     try {
      
     } catch (error) {
        console.log("error", error);
        throw error;
     }
  }

  static readAllNotification = async (userId: string[]) => {
     console.log("id sssssss", userId);
      await this.axios.put(`/api/v1/notifications/read-all`, { userId })
     try {
      
     } catch (error) {
        console.log("error", error);
        throw error;
     }
  }



}

export { NotificationApi };
