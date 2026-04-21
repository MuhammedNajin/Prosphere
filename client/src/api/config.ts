import { create } from "zustand";
import axios, { HttpStatusCode, AxiosError } from "axios";
import { Message } from "@/types/company";

var baseURL = import.meta.env.VITE_URL as string;

console.log("base url !!!!!!!!!!!!!!!!!!!!!", baseURL);

interface AlertStore {
  isLogout?: boolean;
  isOpen: boolean;
  title: string;
  message: string;
  type: "error" | "warning" | "info";
  retryAction?: () => Promise<any>;
  showAlert: (
    params: Omit<AlertStore, "showAlert" | "closeAlert" | "isOpen" | "logout">
  ) => void;
  closeAlert: () => void;
  logout: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  isLogout: false,
  isOpen: false,
  title: "",
  message: "",
  type: "info",
  showAlert: (params) => set({ ...params, isOpen: true }),
  closeAlert: () => set({ isOpen: false }),
  logout: () => set({ isLogout: true }),
}));

const MAX_RETRY_ATTEMPTS = 3;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

console.log("baseURL", baseURL);

const refreshAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_URL as string,
  withCredentials: true,
  timeout: 10000,
});

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_URL as string,
  withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message: string }>) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const request = originalRequest as typeof originalRequest & {
      _retryCount?: number;
      _authRetry?: boolean;
    };

    request._retryCount = request._retryCount ?? 0;

    if (error.response?.status === HttpStatusCode.TooManyRequests) {
      const retryAfter = parseInt(
        error.response.headers["retry-after"] || "60"
      );

      useAlertStore.getState().showAlert({
        title: "Rate Limit Exceeded",
        message: `Too many requests. Please wait ${retryAfter} seconds before trying again.`,
        type: "warning",
        retryAction: async () => {
          await delay(retryAfter * 1000);
          return axiosInstance(request);
        },
      });

      return Promise.reject(error);
    }

    if (
      !error.response ||
      error.code === "ECONNABORTED" ||
      error.message === "Network Error"
    ) {
      if (request._retryCount < MAX_RETRY_ATTEMPTS) {
        request._retryCount++;

        useAlertStore.getState().showAlert({
          title: "Network Error",
          message: "Connection failed. Would you like to retry?",
          type: "error",
          retryAction: async () => {
            await delay(1000 * request._retryCount!);
            return axiosInstance(request);
          },
        });

        return Promise.reject(error);
      }

      useAlertStore.getState().showAlert({
        title: "Connection Failed",
        message:
          "Maximum retry attempts reached. Please check your internet connection.",
        type: "error",
      });

      return Promise.reject(error);
    }

    if (
      error.response?.status === HttpStatusCode.Unauthorized &&
      !request._authRetry
    ) {
  
      const isRefreshTokenRequest = 
        originalRequest.url?.includes('/refresh-token') ||
        originalRequest.url?.includes('/logout');
      
      if (isRefreshTokenRequest) {
        console.log("Refresh token request failed, logging out");
        useAlertStore.getState().logout();
        return Promise.reject(error);
      }

      request._authRetry = true;

      if (error.response?.data?.message === Message.denied) {
        useAlertStore.getState().showAlert({
          title: "Access Denied",
          message: "You do not have permission to access this resource.",
          type: "error",
        });
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(request);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;

      try {
      
        const isAdminRequest = 
          error.response.config.baseURL?.includes("/api/v1/admin") || 
          error.response.config.url?.includes("/api/v1/admin");

        if (isAdminRequest) {
          console.log("Refreshing admin token");
          const refreshResponse = await refreshAxiosInstance.post(
            "/api/v1/admin/refresh-token"
          );
          console.log("Admin refresh successful", refreshResponse.status);
        } else {
          console.log("Refreshing user token");
          const refreshResponse = await refreshAxiosInstance.post(
            "/api/v1/auth/refresh-token"
          );
          console.log("User refresh successful", refreshResponse.status);
        }

        processQueue(null);
        isRefreshing = false;


        return axiosInstance(request);
        
      } catch (refreshError: unknown) {
        console.log("Token refresh failed", refreshError);
        
        // Process queued requests with error
        processQueue(refreshError);
        isRefreshing = false;

        try {
          if (refreshError instanceof AxiosError) {
            const isAdminRefresh = refreshError.response?.config.url?.includes("/api/v1/admin/refresh-token");
            
            // Attempt logout
            const logoutUrl = isAdminRefresh 
              ? "/api/v1/admin/logout"
              : "/api/v1/auth/logout";
            
            console.log("Attempting logout via", logoutUrl);
            const logoutResponse = await refreshAxiosInstance.post(logoutUrl);
            
            if (logoutResponse.status === HttpStatusCode.NoContent || 
                logoutResponse.status === HttpStatusCode.Ok) {
              console.log("Logout successful");
            }
          }
        } catch (logoutError) {
          console.error("Logout failed:", logoutError);
        } finally {
          // Always trigger logout in store
          useAlertStore.getState().logout();
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export type ApiError = {
  response: {
    data: {
      errors: {
        message: string;
      }[];
    };
  };
};

export interface ApiErrorResponse {
  errors: Array<{
    message: string;
  }>;
}

export default axiosInstance;