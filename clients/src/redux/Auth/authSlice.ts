import { createAsyncThunk, createSlice, Slice, PayloadAction } from "@reduxjs/toolkit";
import { ApiService, AdminApi } from "../../api";


export const verifyOtpThunk = createAsyncThunk("auth/verify-otp", ApiService.verifyOtp);
export const signInThunk = createAsyncThunk("auth/signIn", ApiService.signIn);
export const googleAuthThunk = createAsyncThunk("auth/google-auth", ApiService.googleSignUpFlow);
export const adminLoginThunk = createAsyncThunk("auth/admin", AdminApi.signIn);
export const adminLogoutThuck = createAsyncThunk("auth/admin/logout", AdminApi.logout);
export const logoutThuck = createAsyncThunk("auth/logout", ApiService.logout);

interface AuthState {
  user: any | null;
  status: string;
  role: 'user' | 'admin';
}

const initialState: AuthState = {
  user: null,
  status: "",
  role: "user"
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    googleAuth: (state, action ) => {
       state.user = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtpThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(verifyOtpThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signInThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.user = action.payload;
        state.status = "success";
      })
      .addCase(adminLoginThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "success";
        state.role = "admin";
        state.user = action.payload;
      })
      .addCase(googleAuthThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.role = "user";
        state.status = 'success';
        state.user = action.payload;
      })
      .addCase(adminLogoutThuck.fulfilled, (state, action) => {
          console.log(action);
          state.user = null
          state.status = 'error'
      })
      .addCase(logoutThuck.fulfilled, (state, action) => {
          console.log(action);
          state.user = null
          state.status = 'error'
      })

  },
});
export const { googleAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;