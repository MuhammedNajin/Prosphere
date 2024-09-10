import createAxios, { AxiosInstance } from "./config"

export interface IOtp {
    userId: string,
    otp: string,
}

class ApiService {
    private static axios: AxiosInstance = createAxios('http://localhost:7000');

    static signUp = async (user: any) => {
        try {
            console.log('signup data', user)
            const response = await this.axios.post('/api/v1/auth/signup', user);
            if(response.status === 201) {
                return response.data;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static verifyOtp = async ({ otp, userId}: IOtp) => {
        try {
            console.log("userId:", userId, "otp, ", otp, this)
            const response = await this.axios.post("/api/v1/auth/verify-otp", {userId, otp});
            console.log(response);
            
            if(response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.log(error); 
            return false
        }
    }

    static signIn = async ({ email, password }: { email: string, password: string}) => {
        try {
            const response = await this.axios.post('/api/v1/auth/login', { email, password});
            if(response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.log(error);
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

    static resetOtp =  async ({email, userId}: { email: string, userId: string}) => {
        try {
            const response = await this.axios.post('/api/v1/auth/resent-otp', {
                email,
                userId,
            })
            return response.data;
        } catch (error) {
            console.log(error)
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

export { ApiService }
