import axiosInstance, { AxiosInstance } from "./config";

class CompanyApi {
  private static axios: AxiosInstance = axiosInstance;

  static createCompany = async ({ data }) => {
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

  static  upLoadCompanyLogo = async ({ data, id}) => {
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

  static updateCompanyProfile = async ({ id, data }) => {
    return await this.axios.put(`/api/v1/company/${id}`, data);
  };

  static uploadVerificationDocs = async ({ data, id }) => {
    return await this.axios.post(`/api/v1/user/company/verify/${id}`, data, {
       headers: {
         "Content-Type": "multipart/form-data"
       }
    })
  }
   
  // change this route to user api
  static generateToken = async ({ id }:{ id: string, el?: unknown }) => {
    return await this.axios.post(`/api/v1/user/company/token/${id}`);
 }


 static getApplicationByJob = async (jobId: string) => {
   try {
      const response = await this.axios.get(`/api/v1/job/company/jobs/${jobId}`)
      return response.data?.data
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

}

export { CompanyApi };
