import { Application, Request, Response } from "express";
import { createProxyMiddleware, RequestHandler } from "http-proxy-middleware";
import { AuthRouteConfig, ProxyConfig } from "../type/interface";


export const setupProxies = (app: Application, routes: AuthRouteConfig[]) => {
    routes.forEach( route => {
        const proxyMiddleware: RequestHandler = createProxyMiddleware({
            target: route.proxy.target,
            changeOrigin: route.proxy.changeOrigin,
            on: {
                proxyReq: (proxyReq, req: any, res: any) => {
                    if(req.currentUser) {
                        proxyReq.setHeader('X-User-Data', JSON.stringify(req.currentUser));

                    } else if(req.currentAdmin) {
                        proxyReq.setHeader('X-Admin-Data', JSON.stringify(req.currentAdmin));
                    }
                }
            }
        });

        app.use(route.url, proxyMiddleware);
    })
    
}
