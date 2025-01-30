import { AdminApi, ApiService } from "@/api";
import { SignInFormData } from "@/types/formData";
import { adminLogin, googleSignUpFlow, IOtp, SignInResponse, UserData } from "@/types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const verifyOtpThunk = createAsyncThunk<UserData, IOtp, { rejectValue: string }>(
    "auth/verify-otp",
    ApiService.verifyOtp
  );

  export const signInThunk = createAsyncThunk<SignInResponse, SignInFormData, { rejectValue: unknown }>(
    "auth/signIn",
    ApiService.signIn
  );

  export const googleAuthThunk = createAsyncThunk<UserData, googleSignUpFlow, { rejectValue: unknown }>(
    "auth/google-auth",
    ApiService.googleSignUpFlow
  );

  export const adminLoginThunk = createAsyncThunk<UserData, adminLogin, { rejectValue: unknown }>(
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