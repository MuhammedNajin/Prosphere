import { createAsyncThunk, createSlice, Slice } from "@reduxjs/toolkit";
import { ApiService, AdminApi } from "../../api";


export const verifyOtpThunk = createAsyncThunk("auth/verify-otp", ApiService.verifyOtp);
export const signInThunk = createAsyncThunk("auth/signIn", ApiService.signIn);
export const googleAuthThunk = createAsyncThunk("auth/google-auth", ApiService.googleAuth)
export const adminLoginThunk = createAsyncThunk("auth/admin", AdminApi.signIn);

const authSlice: Slice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "",
    role: "user"
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        console.log("payload", action.payload);
        state.status = "success";
        state.user = action.payload as null;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        console.log("state", state, action);
      })
      .addCase(verifyOtpThunk.pending, (state, action) => {
        console.log("state", state, action);
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        console.log("action", action)
         state.user = action.payload 
         state.status = "success"
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        console.log(action);
        
          state.status = "success"
          state.role = "admin"
          state.user = action.payload;
      })
  },
});

export const authReducer = authSlice.reducer;
