import createAxios, { AxiosInstance } from "./config";




class ProfileApi {
    private static axios: AxiosInstance = createAxios('http://localhost:3002/api/v1/profile');

   static async uploadProfilePhoto(data: unknown, key: string, email: string) {
      try {
        console.log("profilePhoto", data)

     const response = await this.axios.post(`/photo?key=${key}&email=${email}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
          },
      })

      if(response.status === 201) {
         return true
      }

      } catch (error) {
        console.log(error);
        
      }
   }

   static async about(description: string, email: string) {
      try {
        console.log("description", description);
        
         const response = await this.axios.put('/about', {
          description,
          email
         })

         if(response.status === 200) {
           return response.data
         }

      } catch (error) {
        console.log(error);
        
      }
   }

   static async updateProfile(data, email: string, array?: boolean) {
      try {
         const response = await this.axios.put(`/${email}?array=${array}`, data)
         if(response.status === 201) {
            return response.data;
         }
      } catch (error) {
        console.log(error);
        
      }
   }

   static async getProfile(email: string) {
      try {
        const response = await this.axios.get(`/${email}`);
        return response.data
      } catch (error) {
        console.log(error);
      }
   }

    // If you need to change the base URL
    static setBaseUrl(url: string) {
        this.axios = createAxios(url);
    }
}

export { ProfileApi };
