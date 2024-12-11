import axiosInstance, { AxiosInstance } from "./config";
import { MessageAttrs } from "@/types/chat";

export class PaymentApi {
  private static axios: AxiosInstance = axiosInstance;

  static create = async ({ data } : { data: unknown }) => {
    console.log("payment", data);
    return await this.axios.post("/api/v1/payment/", data);
  };

  static createPlan = async ({ newPlan }: { newPlan: unknown }) => {
     console.log("from create plan api", newPlan);
     return await this.axios.post("/api/v1/payment/plans", newPlan);
  }


  static getPlan = async () => {
     console.log("from create plan api", );
     const response = await this.axios.get("/api/v1/payment/plans");
     return response.data?.data;
  }



}
