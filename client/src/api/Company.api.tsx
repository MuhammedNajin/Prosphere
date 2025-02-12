import { AxiosInstance } from "axios";
import axiosInstance from "./config";
import { Avatar, Companydata, DocumentVerificationFormData } from "@/types/formData";

class CompanyApi {
  private static axios: AxiosInstance = axiosInstance;

  static createCompany = async ({ data }: { data: Companydata }) => {
    console.log("company", data);
    return await this.axios.post("/api/v1/user/company/setup", data);
  };

  static  getCompanies =  async ()  => {
    try {
      const response = await this.axios.get(`/api/v1/user/company/my-company`);
      if (response.status === 200) {
        console.log(response);
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async getCompany(id: string) {
    try {
      const response = await this.axios.get(`/api/v1/company/${id}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }

  static async getCompanyProfile(id: string) {
     try {
       const response = await this.axios.get(`/api/v1/user/company/profile/${id}`);
       return response.data;
     } catch (error) {
       console.log(error);
       
     }
  }

  static  upLoadCompanyLogo = async ({ data, id}: { data: Avatar; id: string }) => {
      return await this.axios.post(
        `/api/v1/company/logo/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  }

  static async getUploadedFIle(key: string) {
      return await this.axios.get(`/api/v1/company/logo/${key}`);
  }

  static updateCompanyProfile = async ({ id, data }: { id: string, data: Partial<Companydata> }) => {
    return await this.axios.put(`/api/v1/company/${id}`, data);
  };

  static uploadVerificationDocs = async ({ data, id }: { id: string; data: DocumentVerificationFormData }) => {
    return await this.axios.post(`/api/v1/user/company/verify/${id}`, data, {
       headers: {
         "Content-Type": "multipart/form-data"
       }
    })
  }
   
  static generateToken = async ({ id }:{ id: string, el?: unknown }) => {
    return await this.axios.post(`/api/v1/user/company/token/${id}`);
 }

 static getApplicationByJob = async (jobId: string, page: number = 1, limit: number = 10) => {
  try {
     const response = await this.axios.get(`/api/v1/job/company/jobs/${jobId}`, {
       params: {
         page,
         limit
       }
     });
     return {
       data: response.data?.data,
       total: response.data?.total,
       currentPage: response.data?.currentPage,
       totalPages: response.data?.totalPages,
     };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

 static getJobStats = async (companyId: string, dateRange: { startDate: Date, endDate: Date }, timeFrame = 'year') => {
  try {
    const response = await this.axios.get(`/api/v1/job/company/stats?companyId=${companyId}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&timeFrame=${timeFrame}`)
    return response.data?.data
 } catch (error) {
   console.log(error);
   throw error;
 }
 }

 static getJobVeiwStats = async (companyId: string, dateRange: { startDate: Date, endDate: Date }, timeFrame = 'year') => {
  try {
    const response = await this.axios.get(`/api/v1/job/company/view?companyId=${companyId}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&timeFrame=${timeFrame}`)
    return response.data?.data
 } catch (error) {
   console.log(error);
   throw error;
 }
 }

 static searchUsers = async (searchQuery: string) => {
   try {
      const response = await this.axios.get(`/api/v1/company/employee?search=${searchQuery}`);
      return response.data?.data;
   } catch (error) {
     console.log(error);
     throw error;
   }
 }

 static getEmployees = async () => {
   try {
      const response = await this.axios.get(`/api/v1/company/employees`);
      return response.data?.data;
   } catch (error) {
     console.log(error);
     throw error;
   }
 }

 
 static getEmployeesPublicProfile = async (id?: string) => {
   try {
      const response = await this.axios.get(`/api/v1/user/company/employees?companyId=${id}`);
      return response.data?.data;
   } catch (error) {
     console.log(error);
     throw error;
   }
 }

 static addMember = async (id: string) => {
    try {
      console.log("id, addMemberMutation", id)
      return await this.axios.put(`/api/v1/company/employee/${id}`);
    } catch (error) {
      console.log(error);
      throw error
    }
 }

 static getFiles = async (keys: string[]) => {
    try {
        const response = await this.axios.post(`/api/v1/company/files`, { keys });
        return response.data?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}

export { CompanyApi };
