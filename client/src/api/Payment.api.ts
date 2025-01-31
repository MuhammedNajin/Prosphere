import { PlanData } from "@/types/subscription";
import axiosInstance from "./config";
import { AxiosInstance } from "axios";

export class PaymentApi {
  private static axios: AxiosInstance = axiosInstance;

  static create = async ({ data }: { data: unknown }) => {
    console.log("payment", data);
    return await this.axios.post("/api/v1/payment/", data);
  };

  static createPlan = async (newPlan: Omit<PlanData, "id">) => {
    console.log("from create plan api", newPlan);
    return await this.axios.post("/api/v1/payment/plans", newPlan);
  };

  static updatePlan = async (planId: number, newPlan: Partial<PlanData>) => {
    console.log("from update plan api", newPlan);
    return await this.axios.put(`/api/v1/payment/plans/${planId}`, newPlan);
  };

  static deletePlan = async (planId: number) => {
    console.log("from update plan api", planId);
    return await this.axios.delete(`/api/v1/payment/plans/${planId}`);
  };

  static getPlan = async () => {
    console.log("from create plan api");
    const response = await this.axios.get("/api/v1/payment/plans");
    return response.data?.data;
  };

  static checkSession = async (sessionId: string) => {
    return this.axios.get(
      `/api/v1/payment/chekout-session?session_id=${sessionId}`
    );
  };

  static getCurrentPlan = async (companyId: string) => {
    const response = await this.axios.get(
      `/api/v1/payment/current-subscription/${companyId}`
    );
    return response.data?.data;
  };

  static upgradeSubscription = async ({
    data,
  }: {
    data: {
      name: string;
      id: string;
      companyId: string;
      price: number;
      planId: number;
    };
  }) => {
    return this.axios.post(
      `/api/v1/payment/subscription/upgrade/${data.companyId}`,
      data 
    );
  };
}
