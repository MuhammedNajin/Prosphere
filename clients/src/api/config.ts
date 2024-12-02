import axios, { AxiosInstance} from 'axios';
import { Message } from '@/types/company'
import store from '@/redux/store';
import { setSelectedCompany } from '@/redux/reducers/companySlice';

     const axiosInstance = axios.create({
        baseURL: `${BASE_URL}`,
        withCredentials: true,
     });

     axiosInstance.interceptors.response.use(
      response => response,
      async function (error) {
        console.log("hello", error)
          const originalRequest = error.config;
          if (error.response && error.response.status === 401 && !originalRequest._retry) {
              originalRequest._retry = true;
              try {
                  console.log("i am here on intercpetre" , error.response)
                  if(error.response?.data?.message == Message.denied) {
                    //  store.dispatch(setSelectedCompany(null))
                  } else {
                    await axiosInstance.post('/api/v1/auth/refreshToken');
                    return axiosInstance(originalRequest);
                  }
                 
              } catch (err) {
                  console.log(err, "from interptor");
                  const response = await axiosInstance.post('/api/v1/auth/logout');
                  if(response.status == 200) {
                     // if(store) store.dispatch(logout());
                  }
                  return Promise.reject(err);
              }
          }
          return Promise.reject(error);
      }
  );

export type { AxiosInstance }
export default axiosInstance;