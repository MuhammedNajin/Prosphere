import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiService, AdminApi } from "../../api";

// Define proper types for your API responses
interface UserCredential {
  // Add appropriate user properties
  id?: string;
  email?: string;
  // ... other properties
}

interface SignInResponse {
  userCredential: UserCredential;
  profile: string[];
}

// Create typed async thunks
export const verifyOtpThunk = createAsyncThunk<UserCredential>(
  "auth/verify-otp",
  ApiService.verifyOtp
);

export const signInThunk = createAsyncThunk<SignInResponse>(
  "auth/signIn",
  ApiService.signIn
);

export const googleAuthThunk = createAsyncThunk<UserCredential>(
  "auth/google-auth",
  ApiService.googleSignUpFlow
);

export const adminLoginThunk = createAsyncThunk<UserCredential>(
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

interface AuthState {
  user: UserCredential | null;
  status: 'idle' | 'loading' | 'success' | 'failed' | 'error' | '';
  role: 'user' | 'admin' | 'none';
  resume: string[];
}

const initialState: AuthState = {
  user: null,
  status: "",
  role: "user",
  resume: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    googleAuth: (state, action: PayloadAction<UserCredential>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.status = '';
      state.role = 'none';
    },
    setResume: (state, action: PayloadAction<string>) => {
      // Ensure resume is always an array before pushing
      if (!Array.isArray(state.resume)) {
        state.resume = [];
      }
      state.resume.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(verifyOtpThunk.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(verifyOtpThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.user = action.payload.userCredential;
        // Ensure resume is assigned as an array
        console.log("action.payload", action.payload)
        state.resume = Array.isArray(action.payload?.profile?.resumeKey) 
          ? action.payload.profile 
          : [];
        state.status = "success";
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.role = "admin";
        state.user = action.payload;
      })
      .addCase(googleAuthThunk.fulfilled, (state, action) => {
        state.role = "user";
        state.status = 'success';
        state.user = action.payload;
      })
      .addCase(adminLogoutThuck.fulfilled, (state) => {
        state.user = null;
        state.status = 'error';
      })
      .addCase(logoutThuck.fulfilled, (state) => {
        state.user = null;
        state.status = 'error';
        state.role = 'none';
        state.resume = [];
      });
  },
});

export const { googleAuth, logout, setResume } = authSlice.actions;
export const authReducer = authSlice.reducer;