import { Application } from "express";
import { createProxyMiddleware, RequestHandler } from "http-proxy-middleware";
import { customLogger } from "../logger/morgan";
import { AuthRouteConfig } from "src/@Types/interface";

export const setupProxies = (app: Application, routes: AuthRouteConfig[]) => {
    routes.forEach(route => {
        console.log("route", route)
        const proxyMiddleware: RequestHandler = createProxyMiddleware({
            target: route.proxy.target,
            changeOrigin: route.proxy.changeOrigin,
            timeout: 10000,
            proxyTimeout: 10000,
            
            on: {
                proxyReq: (proxyReq, req: any, res: any) => {
                    req.startTime = Date.now();

                    customLogger.info(`Original URL: ${req.url}`);
                    customLogger.info(`Proxying to: ${route.proxy.target}   
                                    ${proxyReq.path}`);
                    
                    if(req.currentUser) {
                        proxyReq.setHeader('X-User-Data', JSON.stringify(req.currentUser));
                        if(req.currentCompany) {
                            proxyReq.setHeader('X-Company-Data', JSON.stringify(req.currentCompany));
                        }
                    } else if(req.currentAdmin) {
                        proxyReq.setHeader('X-Admin-Data', JSON.stringify(req.currentAdmin));
                    }
                },
            }
        });

        app.use(route.url, proxyMiddleware);
    });
};