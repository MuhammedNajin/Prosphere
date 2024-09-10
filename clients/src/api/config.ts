import axios, { AxiosInstance} from 'axios';

const createAxios = (baseURL: string) => {
     return axios.create({
        baseURL: baseURL,
        withCredentials: true,
     });
}

export type { AxiosInstance }
export default createAxios;