

import { AxiosError } from "axios";
import createAxios, { AxiosInstance } from "./config"



class AdminApi {
    private static axios: AxiosInstance = createAxios('http://localhost:7000');

   
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
            const response = await this.axios.post('/api/v1/auth/admin', { email, password});
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
            
            const response = await this.axios.post('/api/v1/auth/google-auth', {},
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
            const response = await this.axios.post(`/api/v1/auth/reset-password/${token}`, {
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

    // If you need to change the base URL
    static setBaseUrl(url: string) {
        this.axios = createAxios(url);
    }
}

export { AdminApi };
