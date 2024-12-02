

import { AxiosError } from "axios";
import axiosInstance, { AxiosInstance } from "./config"



class AdminApi {
    private static axios: AxiosInstance = axiosInstance

   
    static fetchUsers = async () => {
        try {
            const response = await this.axios.get('/api/v1/admin/users');
            return response.data
        } catch (error) {
           console.log(error);
            return error;
        }

    }

    static signIn = async ({ email, password }: { email: string, password: string}, { rejectWithValue } ) => {
        try {
            const response = await this.axios.post('/api/v1/auth/admin-login', { email, password});
            if(response.status === 200) {
                console.log(response);
                return response.data;
            }
        } catch (error) {
            console.log(error)
            if(error instanceof AxiosError) {
                const { errors } = error?.response.data;
                console.log(errors);
                
                return rejectWithValue(errors[0].message)
            }
        }
    }

    static googleAuth = async (token: any) => {
        try {
            console.log(token);
            
            const response = await this.axios.post('/api/v1/admin/google-auth', {},
                {
                   headers: {
                     "Authorization": `Bearer ${token}`
                   }
                }
            );
            if(response.status === 201) {
               return response.data;
            }
        } catch (error) {
           console.log(error);
        }
    }


    static resetPassword = async ({password, token}: { password: string, token: string }) => {
        try {
            const response = await this.axios.post(`/api/v1/admin/reset-password/${token}`, {
                password
            })
            return response.data;
        } catch (error) {
            console.log(error)
        }
    }

    static blockUser = async (email: string) => {
        try {
            const response = await this.axios.patch(`/api/v1/admin/block/${email}`,);
            return response.data
        } catch (error) {
            console.log(error)
        }
    }

    static logout = async () => {
        try {
            const response = await this.axios.post("/api/v1/admin/logout");
            return response.data
        } catch (error) {
            
        }
    }

    static verificationRequest = async (status: string = 'uploaded') => {
        try {
            const response = await this.axios.get(`/api/v1/admin/company/verification?status=${status}`);
            console.log("data", response.data);
            
            return response.data
        } catch (error) {
            throw error;
        }
    }

    static  getCompany = async(id: string) => {
        try {
          const response = await this.axios.get(`/api/v1/admin/company/${id}`);
          if (response.status === 200) {
            return response.data;
          }
        } catch (error) {
          return error; 
        }
      }

    static changeCompanyVerificationStatus = async ({ status, id }) => {
        return await this.axios.patch(`/api/v1/admin/company/status/${id}?status=${status}`);
    }

    static getVerificationDocs = async (key: string) => {
        try {
            const response = await this.axios.get(`/api/v1/admin/company/doc/${key}`)
            return response.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }

  
    
}

export { AdminApi };
