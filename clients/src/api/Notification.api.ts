import axiosInstance, { AxiosInstance } from "./config";

class NotificationApi {
  private static axios: AxiosInstance = axiosInstance;

  static getNotification = async (userId: string) => {
    console.log("getNotification", userId);
    try {
       const response = await this.axios.get(`/api/v1/notification/${userId}`);
       return response.data?.data
    } catch (error) {
        console.log(" errr", error);
        throw error;
    }
  };

}

export { NotificationApi };
