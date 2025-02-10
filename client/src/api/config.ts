import { create } from "zustand";
import axios, { HttpStatusCode, AxiosError } from "axios";
import { Message } from "@/types/company";
var baseURL = import.meta.env.VITE_URL as string;

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

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_URL as string,
  withCredentials: true,
  timeout: 10000,
});

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
      request._authRetry = true;

      try {
        if (error.response?.data?.message === Message.denied) {
          useAlertStore.getState().showAlert({
            title: "Access Denied",
            message: "You do not have permission to access this resource.",
            type: "error",
          });
          return Promise.reject(error);
        }

        if (error.response.config.baseURL?.includes("/api/v1/admin")) {
          console.log("not admin");
          const re = await axiosInstance.post("/api/v1/auth/refreshToken");
          console.log("debug: admin refresh", re);
        } else {
          const re = await axiosInstance.post(
            "/api/v1/auth/admin/refresh-token"
          );
          console.log("debug: user refresh", re);
        }

        return axiosInstance(request);
      } catch (err: unknown) {
        console.log("errr refresh toke endpoint", err);
        try {
          if (err instanceof AxiosError) {
            console.log(
              "debug: url",
              err.response?.config.url,
              err.response?.config.url?.includes("/api/v1/auth/refreshToken")
            );
            let url = err.response?.config.url?.includes(
              "/api/v1/auth/refreshToken"
            )
              ? "/api/v1/auth/logout"
              : "/api/v1/admin/logout";
            const response = await axiosInstance.post(url);
            if (response.status === HttpStatusCode.Ok) {
              console.log("logout", response);
              useAlertStore.getState().logout();
            }
          }
        } catch (logoutError) {
          console.error("Logout failed:", logoutError);
        }
        return Promise.reject(err);
      }
    }

    // useAlertStore.getState().showAlert({
    //   title: 'Error',
    //   message: error.response?.data?.message || 'An unexpected error occurred',
    //   type: 'error'
    // });

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
