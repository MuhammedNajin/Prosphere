import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  adminLoginThunk,
  adminLogoutThuck,
  googleAuthThunk,
  logoutThuck,
  signInThunk,
  verifyOtpThunk,
} from "../action/actions";
import { UserRole } from "@/types/user";

export interface UserState {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  resume: string[];
  profileComplete: boolean;
  role: UserRole | "none";
  status: "idle" | "loading" | "success" | "failed" | "error" | "";
  error?: any;
}

const initialState: UserState = {
  id: undefined,
  username: undefined,
  email: undefined,
  phone: undefined,
  avatar: undefined,
  resume: [],
  profileComplete: true,
  role: "none",
  status: "",
  error: null,
};

// Helper function to extract payload from ResponseWrapper structure
const extractPayload = (response: any) => {

  console.log("response in extract payload >>>>", response);
  if (response?.data?.payload) {
    return response.data.payload;
  }
  return response;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    googleAuth: (state, action: PayloadAction<Partial<UserState>>) => {
      console.log("googleAuth payload >>>>>>>>", action.payload);
      Object.assign(state, action.payload);
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
    setResume: (state, action: PayloadAction<string>) => {
      state.resume.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        const payload = extractPayload(action.payload);
        Object.assign(state, payload, {
          status: "success",
          role: "user",
          error: null,
          profileComplete: true,
        });
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(verifyOtpThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        const data = extractPayload(action.payload);

        console.log("signInThunk data >>>>", data);
    
          Object.assign(state, data.payload);
        state.resume = Array.isArray(data?.resumeKey) ? data.resumeKey : [];
        state.status = "success";
        state.error = null;
        state.profileComplete = true;
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signInThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        const payload = extractPayload(action.payload);
        Object.assign(state, payload, {
          status: "success",
          role: "admin",
        
        });
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(adminLoginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(googleAuthThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(googleAuthThunk.fulfilled, (state, action) => {
        const payload = extractPayload(action.payload);
        console.log("google payload >>>>>>", payload);
        state.status = "success";
        state.error = null;

        if (payload.profile_complete === false) {
          Object.assign(state, payload, { profileComplete: false });
        } else {
          Object.assign(state, payload, { profileComplete: true });
        }
      })
      .addCase(googleAuthThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.profileComplete = true;
      })
      .addCase(adminLogoutThuck.fulfilled, (state) => {
        Object.assign(state, initialState);
      })
      .addCase(logoutThuck.fulfilled, (state) => {
        Object.assign(state, initialState);
      });
  },
});

export const { googleAuth, logout, setResume, clearError } = userSlice.actions;
export const userReducer = userSlice.reducer;
