import axiosInstance, { AxiosInstance } from "./config";

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

   static getMyApplicatons = async (id: string) => {
       return await this.axios.get(`/api/v1/job/application/my-application/${id}`);
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


