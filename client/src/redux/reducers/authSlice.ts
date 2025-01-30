import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "@/types/user";
import {
  adminLoginThunk,
  adminLogoutThuck,
  googleAuthThunk,
  logoutThuck,
  signInThunk,
  verifyOtpThunk,
} from "../action/actions";

interface AuthState {
  user: UserData | null;
  status: "idle" | "loading" | "success" | "failed" | "error" | "";
  role: "user" | "admin" | "none";
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
    googleAuth: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.status = "";
      state.role = "none";
    },
    setResume: (state, action: PayloadAction<string>) => {
      console.log("setResume", action.payload, state.resume);
      const array = [...state.resume, action.payload];
      console.log("setResume array", array);

      state["resume"] = array;
    },
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

        console.log("action.payload", action.payload, action.payload.resumeKey);
        state["resume"] = Array.isArray(action.payload?.resumeKey)
          ? action.payload.resumeKey
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
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(adminLogoutThuck.fulfilled, (state) => {
        state.user = null;
        state.status = "error";
      })
      .addCase(logoutThuck.fulfilled, (state) => {
        state.user = null;
        state.status = "error";
        state.role = "none";
        state.resume = [];
      });
  },
});

export const { googleAuth, logout, setResume } = authSlice.actions;
export const authReducer = authSlice.reducer;
