

import createAxios, { AxiosInstance } from "./config"



class AdminApi {
    private static axios: AxiosInstance = createAxios('http://localhost:7000');

   
    static fetchUsers = async () => {
        try {
            const response = await this.axios.get('/api/v1/admin/users');
            return response.data
        } catch (error) {
           console.log(error);
            return [];
        }

    }

    static signIn = async ({ email, password }: { email: string, password: string}) => {
        try {
            const response = await this.axios.post('/api/v1/auth/admin', { email, password});
            if(response.status === 200) {
                console.log(response);
                return response.data;
            }
        } catch (error) {
            console.log(error)
            return false;
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

    // If you need to change the base URL
    static setBaseUrl(url: string) {
        this.axios = createAxios(url);
    }
}

export { AdminApi };
