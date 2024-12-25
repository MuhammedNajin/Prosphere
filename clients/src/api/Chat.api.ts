import axiosInstance, { AxiosInstance } from "./config";
import { MessageAttrs, ROLE } from "@/types/chat";

export class ChatApi {
  private static axios: AxiosInstance = axiosInstance;

  static sendMessage = async (data: MessageAttrs, context: string) => {
    console.log("chat", data);
    return await this.axios.post(`/api/v1/chat/messages?context=${context}`, data);
  };

  static deleteForEveryOne = async (id: string) => {
    console.log("delete everyone", id);
    return await this.axios.delete(`/api/v1/chat/messages/${id}`);
  };

  static delete = async (id: string, userId: string) => {
    console.log("delete everyone", id, userId);
    return await this.axios.put(`/api/v1/chat/messages/${id}`, { userId });
  };

  
  static getConversation = async (userId: string, context: ROLE, companyId: string) => {
    try {
      console.log("calling getConversation", context, userId, companyId);
      const response = await this.axios.get(`/api/v1/chat/conversation/${userId}?context=${context}&companyId=${companyId}`);
      return response?.data?.data;
    } catch (error) {
      throw error;
    }
  };

  static getChat = async (conversationId: string, userId: string) => {
    try {
      const response = await this.axios.get(`/api/v1/chat/${conversationId}?userId=${userId}`);
      return response?.data?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
