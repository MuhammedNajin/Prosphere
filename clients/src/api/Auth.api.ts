import { AxiosError, AxiosInstance, HttpStatusCode } from "axios";
import axiosInstance from "./config"

export interface IOtp {
    userId: string,
    otp: string,
}

class ApiService {
    private static axios: AxiosInstance = axiosInstance

    static signUp = async ({ data }) => {
      return await this.axios.post('/api/v1/auth/signup', data);
    }   

    static verifyOtp = async (data: IOtp, { rejectWithValue }) => {
        try {
            
            const response = await this.axios.post("/api/v1/auth/verify-otp", data);
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

static signIn = async (data: { email: string, password: string},  { rejectWithValue }) => {
        try {
            const response = await this.axios.post('/api/v1/auth/login', data);
            console.log("response", response);
            if(response.status === 200) {
                console.log(response);
                return response.data;
            }
        } catch (error) {
            console.log("error in the api", error);
            if(error instanceof AxiosError && error.status !== HttpStatusCode.TooManyRequests) {
                const { errors } = error?.response.data;
                console.log(errors);
                
                return rejectWithValue(errors[0].message)
            }
            return rejectWithValue("Too many requests")
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
    
}

export { ApiService }
