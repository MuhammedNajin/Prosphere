import { create } from 'zustand';
import axios, { AxiosInstance, HttpStatusCode, AxiosError } from 'axios';
import store from '@/redux/store';
import { Message } from '@/types/company';
import { logout } from '@/redux/reducers/authSlice';

interface AlertStore {
  isLogout?: boolean;
  isOpen: boolean;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  retryAction?: () => Promise<any>;
  showAlert: (params: Omit<AlertStore, 'showAlert' | 'closeAlert' | 'isOpen' | 'logout'>) => void;
  closeAlert: () => void;
  logout: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  isLogout: false,
  isOpen: false,
  title: '',
  message: '',
  type: 'info',
  showAlert: (params) => set({ ...params, isOpen: true }),
  closeAlert: () => set({ isOpen: false }),
  logout: () => set({ isLogout: true }),
}));

const MAX_RETRY_ATTEMPTS = 3;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
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
      const retryAfter = parseInt(error.response.headers['retry-after'] || '60');
      
      useAlertStore.getState().showAlert({
        title: 'Rate Limit Exceeded',
        message: `Too many requests. Please wait ${retryAfter} seconds before trying again.`,
        type: 'warning',
        retryAction: async () => {
          await delay(retryAfter * 1000);
          return axiosInstance(request);
        }
      });
      
      return Promise.reject(error);
    }

    if (!error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      if (request._retryCount < MAX_RETRY_ATTEMPTS) {
        request._retryCount++;
        
        useAlertStore.getState().showAlert({
          title: 'Network Error',
          message: 'Connection failed. Would you like to retry?',
          type: 'error',
          retryAction: async () => {
            await delay(1000 * request._retryCount!);
            return axiosInstance(request);
          }
        });
        
        return Promise.reject(error);
      }
      
      useAlertStore.getState().showAlert({
        title: 'Connection Failed',
        message: 'Maximum retry attempts reached. Please check your internet connection.',
        type: 'error'
      });
      
      return Promise.reject(error);
    }

    if (error.response?.status === HttpStatusCode.Unauthorized && !request._authRetry) {
      request._authRetry = true;
      
      try {
        if (error.response?.data?.message === Message.denied) {
          useAlertStore.getState().showAlert({
            title: 'Access Denied',
            message: 'You do not have permission to access this resource.',
            type: 'error'
          });
          return Promise.reject(error);
        }
        
        await axiosInstance.post('/api/v1/auth/refreshToken');
        return axiosInstance(request);
      } catch (err) {
        try {
          const response = await axiosInstance.post('/api/v1/auth/logout');
          if (response.status === HttpStatusCode.Ok) {
             useAlertStore.getState().logout();
          }
        } catch (logoutError) {
          console.error('Logout failed:', logoutError);
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
    data?: {
      errors?: {
        message: string;
      }[];
    };
  };
};


export default axiosInstance;