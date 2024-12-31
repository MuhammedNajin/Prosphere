import { RateLimitInfo,Options} from 'express-rate-limit'
interface ProxyConfig {
    target: string;
    changeOrigin: boolean;
  }
  
  interface AuthRouteConfig {
    url: string;
    auth: string;
    proxy: ProxyConfig;
  }

  export {
     AuthRouteConfig,
     ProxyConfig,
  }


  export interface RateLimitConfig {
    path: string,
    windowMs: Options['windowMs']
    limit: Options['max']
  }