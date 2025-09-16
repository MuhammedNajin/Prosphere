import { ApiService } from "@/api/Auth.api";
import { AdminApi } from "@/api/Admin.api";
import { SignInFormData } from "@/types/formData";
import { adminLogin, googleSignUpFlow, IOtp, IUser, SignInResponse } from "@/types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const verifyOtpThunk = createAsyncThunk<IUser, IOtp, { rejectValue: string }>(
    "auth/verify-otp",
    ApiService.verifyOtp
  );

  export const signInThunk = createAsyncThunk<SignInResponse, SignInFormData, { rejectValue: unknown }>(
    "auth/signIn",
    ApiService.signIn
  );

 export const googleAuthThunk = createAsyncThunk<
  IUser, 
  googleSignUpFlow, 
  { rejectValue: unknown }
>(
  "auth/google-auth",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await ApiService.googleSignUpFlow(payload);
      return response;
    } catch (error: any) {
      console.log("error", error)
      
      // Return the error payload so it can be handled in the rejected case
      return rejectWithValue(error.response?.data?.errors?.message || "Something went wrong try again.");
    }
  }
);

  export const adminLoginThunk = createAsyncThunk<IUser, adminLogin, { rejectValue: unknown }>(
    "auth/admin",
    AdminApi.signIn
  );

  export const adminLogoutThuck = createAsyncThunk(
    "auth/admin/logout",
    AdminApi.logout
  );

  export const logoutThuck = createAsyncThunk(
    "auth/logout",
    ApiService.logout
  );