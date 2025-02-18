import { Application, Request, Response } from "express";
import { createProxyMiddleware, RequestHandler, responseInterceptor } from "http-proxy-middleware";
import { AuthRouteConfig, ProxyConfig } from "../type/interface";
import { customLogger } from "../logger/morgan";
import { Trail_Status, URL, UsageMetrics } from "../type/enums";
import { StatusCode } from "@muhammednajinnprosphere/common";
import grpcPaymentClient from "../grpc/grpcPaymentClient";

export const setupProxies = (app: Application, routes: AuthRouteConfig[]) => {
    routes.forEach( route => {
        const proxyMiddleware: RequestHandler = createProxyMiddleware({
            target: route.proxy.target,
            changeOrigin: route.proxy.changeOrigin,
            selfHandleResponse: true,
            on: {
                proxyReq: (proxyReq, req: any, res: any) => {
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
    })
    
}
