

import { AxiosError } from "axios";
import createAxios, { AxiosInstance } from "./config";




class JobApi {
    private static axios: AxiosInstance = createAxios('http://localhost:5000/api/v1/job');

   static async postJob(jobData, id) {
       try {
           console.log("job posting ", jobData)
           const minSalary = jobData['minSalary']
           const maxSalary = jobData['maxSalary']
           console.log("salary", minSalary, maxSalary);
           delete jobData.maxSalary;
           delete jobData.minSalary;
        const response = await this.axios.post('/', {...jobData, companyId: id, salary: { to: maxSalary, from: minSalary, status: true }}, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log("response", response)
        
       } catch (error) {
        console.log(error);
        
       }
   }


  static async getJobs (id: string) {
      try {
          const response = await this.axios.get(`/${id}`);
          if(response.status === 200) {
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

export { JobApi };
