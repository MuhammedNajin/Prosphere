import { AxiosInstance, HttpStatusCode } from "axios";
import axiosInstance from "./config";
import { ApplicationFormData, StatusFormData } from "@/types/formData";

export class ApplicationApi {
  private static axios: AxiosInstance = axiosInstance;

  static jobApplication = async ({ data } : { data: ApplicationFormData}) => {
    console.log("profilePhoto", data);
    return await this.axios.post(`/api/v1/job/application`, data);
  };

  static async getAllApplication({
    companyId,
    filter,
    page,
    pageSize,
    search,
  }: {
    companyId: string;
    filter: string;
    search: string;
    page: number;
    pageSize: number;
  }) {
    const queryParams = new URLSearchParams({
      filter,
      search,
      page: String(page),
      pageSize: String(pageSize),
    });

    const response =  await this.axios.get(
      `/api/v1/job/company/application/all/${companyId}?${queryParams}`
    );
    return {
      applications: response.data.applications || [],
      currentPage: page,
      totalPages: Math.ceil((response.data.total || 0) / pageSize),
      hasMore: page < Math.ceil((response.data.total || 0) / pageSize),
      total: response.data.total || 0,
    };
  }

  static async getApplication(id: string) {
    return await this.axios.get(`/api/v1/job/company/application/${id}`);
  }

  static changeApplicationStatus = async ({ id, data }: { id: string, data: StatusFormData }) => {
    console.log("id", id);
    return await this.axios.put(`/api/v1/job/company/application/${id}`, data);
  };

  static getMyApplicatons = async (
    filter: string,
    search: string,
    page = 1,
    pageSize = 1
  ) => {
    const queryParams = new URLSearchParams({
      filter,
      search,
      page: String(page),
      pageSize: String(pageSize),
    });

    const response = await this.axios.get(
      `/api/v1/job/application/my-application?${queryParams}`
    );
    if (response.status === HttpStatusCode.Ok) {
      console.log("my application api response", response);
      return {
        applications: response.data.applications || [],
        currentPage: page,
        totalPages: Math.ceil((response.data.total || 0) / pageSize),
        hasMore: page < Math.ceil((response.data.total || 0) / pageSize),
        total: response.data.total || 0,
        filtersCount: response.data.filtersCount,
      };
    }
  };

  static isApplied = async (jobId: string) => {
    try {
      const response = await this.axios.get(`/api/v1/job/application/${jobId}`);
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  };
}
