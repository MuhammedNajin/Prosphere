import { AxiosError, AxiosInstance, HttpStatusCode } from "axios";
import axiosInstance from "./config";
import { ResetFormData, signupFormData } from "@/types/formData";
import { googleSignUpFlow, IOtp } from "@/types/user";

class ApiService {
  private static axios: AxiosInstance = axiosInstance;

  static signUp = async ({ data }: { data: signupFormData }) => {
    return await this.axios.post("/api/v1/auth/signup", data);
  };

  static verifyOtp = async (
    data: IOtp,
    { rejectWithValue }: { rejectWithValue: (value: any) => void }
  ) => {
    try {
      const response = await this.axios.post("/api/v1/auth/verify-otp", data);
      console.log(response);

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        if (error.response) {
          const { errors } = error?.response.data;
          return rejectWithValue(errors[0].message);
        }
      }
    }
  };

  static signIn = async (
    data: { email: string; password: string },
    { rejectWithValue }: { rejectWithValue: (value: any) => void }
  ) => {
    try {
      const response = await this.axios.post("/api/v1/auth/login", data);
      console.log("response", response);
      if (response.status === 200) {
        console.log(response);
        return response.data;
      }
    } catch (error) {
      console.log("error in the api", error);
      if (
        error instanceof AxiosError &&
        error.status !== HttpStatusCode.TooManyRequests
      ) {
        if (error.response) {
          const { errors } = error?.response.data;
          return rejectWithValue(errors[0].message);
        }
      }
      return rejectWithValue("Too many requests");
    }
  };

  static googleAuth = async (token: any) => {
    try {
      console.log(token);

      const response = await this.axios.post(
        "/api/v1/auth/google-auth",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("google res", response);

      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  };

  static resetOtp = async ({
    email,
  }: {
    email: string;
  }) => {
    try {
      const response = await this.axios.post("/api/v1/auth/resent-otp", {
        email
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  static fogetPassword = async (email: string) => {
    try {
      const response = await this.axios.post("/api/v1/auth/forget-password", {
        email,
      });
      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  static resetPassword = async ({
    password,
    token,
  }: {
    password: string;
    token: string;
  }) => {
    try {
      const response = await this.axios.post(
        `/api/v1/auth/reset-password/${token}`,
        {
          password,
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  static googleSignUpFlow = async ({
    phone,
    jobRole,
    email,
  }: googleSignUpFlow) => {
    try {
      const response = await this.axios.put("/api/v1/auth/google-signup-flow", {
        phone,
        jobRole,
        email,
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  static logout = async () => {
    try {
      const response = await this.axios.post("/api/v1/auth/logout");
      return response.data;
    } catch (error) {}
  };

  static changePassword = async (data: ResetFormData) => {

      return await this.axios.post("/api/v1/auth/reset-password", data);
  
  };

 
}

export { ApiService };
