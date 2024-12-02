import axiosInstance, { AxiosInstance } from "./config";
import { MessageAttrs } from "@/types/chat";

export class ChatApi {
  private static axios: AxiosInstance = axiosInstance;

  static sendMessage = async (data: MessageAttrs) => {
    console.log("chat", data);
    return await this.axios.post("/api/v1/chat/message", data);
  };

  static getConversation = async (id: string) => {
    try {
           const response = await this.axios.get(`/api/v1/chat/conversation/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  static getChat = async (conversationId: string) => {
     try {
        const response = await this.axios.get(`/api/v1/chat/${conversationId}`);
        return response?.data?.data;
     } catch (error) {
        console.log(error)
        throw error;
     }
  }
}
