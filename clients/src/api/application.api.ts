import { AxiosInstance, HttpStatusCode } from "axios";
import axiosInstance from "./config";

export class ApplicationApi {
    private static axios: AxiosInstance = axiosInstance;

   static  jobApplication = async ({ data }) => {
        console.log("profilePhoto", data)
       return await this.axios.post(`/api/v1/job/application`, data)
   }

   static async getAllApplication(companyId: string) {
      console.log("companyId", companyId)
      return await this.axios.get(`/api/v1/job/company/application/all/${companyId}`)
   }

   static async getApplication(id: string) {
      return await this.axios.get(`/api/v1/job/company/application/${id}`);
   }

   static  changeApplicationStatus = async ({ id, data }) => {
      console.log("id", id)
      return await this.axios.put(`/api/v1/job/company/application/${id}`, data)
   }

   static getMyApplicatons = async (filter: string, search: string, page = 1, pageSize = 1) => {

      const queryParams = new URLSearchParams({
         filter,
         search,
         page: String(page),
         pageSize: String(pageSize)
      });

      const response =  await this.axios.get(`/api/v1/job/application/my-application?${queryParams}`);
      if(response.status === HttpStatusCode.Ok) {
         return {
            jobs: response.data.application || [],
            currentPage: page,
            totalPages: Math.ceil((response.data.total || 0) / pageSize),
            hasMore: page < Math.ceil((response.data.total || 0) / pageSize),
            total: response.data.total || 0,
          };
      }
   }

   static isApplied = async (jobId: string) => {
      try {
         const response = await this.axios.get(`/api/v1/job/application/${jobId}`);
         return response.data?.data;
      } catch (error) {
         throw error
      }
   }
   

}


