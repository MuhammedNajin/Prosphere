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


 interface UserPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
  tokenId: string;
}

export interface Payload {
  iat: number;
  iss: string;
  aud: string;
  jti: string;
  user: UserPayload;
  exp: number;
}

export interface CompanyPayload {
  id: string,
  name: string
  owner: string
  verified: boolean
  status: "pending" | 'uploaded' | 'verified' | 'reject';
  role : 'owner'
}