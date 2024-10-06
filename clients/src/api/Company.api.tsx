import createAxios, { AxiosInstance } from "./config";




class CompanyApi {
    private static axios: AxiosInstance = createAxios('http://localhost:3003/api/v1/company');

   static async createCompany(CompanyDetails: unknown) {
      try {
        console.log("profilePhoto", CompanyDetails)

     const response = await this.axios.post('/setup', CompanyDetails)

      if(response.status === 201) {
         return response.data;
      }

      } catch (error) {
        console.log(error);
      }
   }

   static async getCompany(id: string) {
      try {
         const response = await this.axios.get(`/${id}`)
         if(response.status === 200) {
            console.log(response)
            return response.data;
         }
      } catch (error) {
         console.log(error)
      }
   }

    // If you need to change the base URL
    static setBaseUrl(url: string) {
        this.axios = createAxios(url);
    }
}

export { CompanyApi };
