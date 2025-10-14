import { RateLimitConfig } from "src/@Types/interface";

export const authRoutes: RateLimitConfig[] = [

    {
        path: '/auth/login',
        windowMs: 5 * 60 * 1000, 
        limit: 5, 
        
    },

    {
        path: '/auth/signup',
        windowMs: 5 * 60 * 1000,
        limit: 5,

    }
]