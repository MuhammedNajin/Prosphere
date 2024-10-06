import { AxiosError } from "axios";
import createAxios, { AxiosInstance } from "./config"

export interface IOtp {
    userId: string,
    otp: string,
}

class ApiService {
    private static axios: AxiosInstance = createAxios('http://localhost:7000');

    static signUp = async (user: any,) => {
        try {
            console.log('signup data', user)
            const response = await this.axios.post('/api/v1/auth/signup', user);
            if(response.status === 201) {
                return response.data;
            }
        } catch (error) {
            console.log(error);
            if(error instanceof AxiosError) {
                const { errors } = error?.response.data;
                console.log(errors);
                
                return Promise.reject(errors[0].message)
            }
        }
    }

    static verifyOtp = async ({ otp, userId}: IOtp, { rejectWithValue }) => {
        try {
            console.log("userId:", userId, "otp, ", otp, this)
            const response = await this.axios.post("/api/v1/auth/verify-otp", {userId, otp});
            console.log(response);
            
            if(response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.log(error); 
            if(error instanceof AxiosError) {
                const { errors } = error?.response.data;
                console.log(errors);
                
                return rejectWithValue(errors[0].message)
            }
        }
    }

static signIn = async ({ email, password }: { email: string, password: string},  { rejectWithValue }) => {
        try {
            const response = await this.axios.post('/api/v1/auth/login', { email, password});
            if(response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.log(error);
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
            console.log("google res", response);
            
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

    static fogetPassword = async (email: string) => {
        try {
            const response = await this.axios.post('/api/v1/auth/forget-password', {
                email,
            })
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
            console.log(response);
            return response.data;
        } catch (error) {
            console.log(error)
        }
    }

    static googleSignUpFlow = async ({phone, jobRole, email}: { phone: string, jobRole: string, email: string }) => {
        try {
            const response = await this.axios.put('/api/v1/auth/google-signup-flow', {
               phone,
               jobRole,
               email
            })
            return response.data;
        } catch (error) {
            console.log(error)
        }
    }
    
    static logout = async () => {
        try {
            const response = await this.axios.post("/api/v1/auth/logout");
            return response.data
        } catch (error) {
            
        }
    }
    

    // If you need to change the base URL
    static setBaseUrl(url: string) {
        this.axios = createAxios(url);
    }
}

export { ApiService }
