import axiosInstance, { AxiosInstance } from "./config";

class ProfileApi {
    private static axios: AxiosInstance = axiosInstance

   static uploadProfilePhoto  = async ({ data, key, existingKey}) => {
      return await this.axios.post(`/api/v1/profile/photo?key=${key}&${existingKey ? `${existingKey}=${existingKey}` : '' }`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
          },
      })

     
   }

   static uploadResume = async ({ data  }) => { 
      console.log("profilePhoto", data)
      return await this.axios.post(`/api/v1/profile/resume`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
          },
      })
   }

   static async about(description: string, email: string) {
      try {
        console.log("description", description);
        
         const response = await this.axios.put('/api/v1/profile/about', {
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

   static updateProfile = async ({ data,  email, array } : { email: string, array?: boolean}) => {
      return await this.axios.put(`/api/v1/profile/${email}?array=${array}`, data)
   }

   static async getProfile(id: string) {
      try {
        const response = await this.axios.get(`/api/v1/profile/${id}`);
        return response.data
      } catch (error) {
        console.log(error);
      }
   }

   static async getUploadedFile(key: string) {
      try {
         const response = await this.axios.get(`/api/v1/profile/file/${key}`);
         if(response.status == 200) {
            return response.data;
         }
      } catch (error) {
         console.log(error);
         return error
      }
   }

}

export { ProfileApi };
