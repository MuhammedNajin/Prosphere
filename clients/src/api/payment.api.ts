import { PlanData } from "@/types/subscription";
import axiosInstance, { AxiosInstance } from "./config";

export class PaymentApi {
  private static axios: AxiosInstance = axiosInstance;

  static create = async ({ data } : { data: unknown }) => {
    console.log("payment", data);
    return await this.axios.post("/api/v1/payment/", data);
  };

  static createPlan = async (newPlan: PlanData) => {
     console.log("from create plan api", newPlan);
     return await this.axios.post("/api/v1/payment/plans", newPlan);
  }

  static updatePlan = async (planId: number, newPlan: PlanData) => {
     console.log("from update plan api", newPlan);
     return await this.axios.put(`/api/v1/payment/plans/${planId}`, newPlan);
  }

  static deletePlan = async (planId: number, ) => {
     console.log("from update plan api", planId);
     return await this.axios.delete(`/api/v1/payment/plans/${planId}`);
  }
  
  static getPlan = async () => {
     console.log("from create plan api", );
     const response = await this.axios.get("/api/v1/payment/plans");
     return response.data?.data;
  }

}
