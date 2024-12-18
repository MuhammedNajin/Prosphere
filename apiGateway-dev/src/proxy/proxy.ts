import { Application, Request, Response } from "express";
import { createProxyMiddleware, RequestHandler, responseInterceptor } from "http-proxy-middleware";
import { AuthRouteConfig, ProxyConfig } from "../type/interface";
import { customLogger } from "../logger/morgan";
import { URL, UsageMetrics } from "../type/enums";
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
                proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
                    const response = responseBuffer.toString('utf8');
                     customLogger.info('logs', {  url: req.originalUrl, statu: res.statusCode ?? 'u'})
                     const url = req.originalUrl;
                     if(res.statusCode >= StatusCode.OK && res.statusCode < 300) {
                        console.log("seccess res", url, "\n", response);

                        if(url.includes(URL.JobPost)) {
                            // customLogger.debug('job post ', { data: response });
                            const data = JSON.parse(response)
                            const companyId = data?.job.companyId;
                            const { id, trail } = req.query; 
                            customLogger.debug('job post dtails ', { companyId, stats: UsageMetrics.JobPostsUsed, query: req.query });
                            if(trail === "true") {
                               console.log("heloo")
                              try {
                               await grpcPaymentClient.updateTrailLimit(id, UsageMetrics.JobPostsUsed)
                              } catch (error) {
                                console.log(" errror ", error);
                                
                              }
                            }
                            // grpcPaymentClient.updateFeaturesLimit(companyId, UsageMetrics.JobPostsUsed)
                        } 
                     }
                    return response;
                  }),
            }
        });

        app.use(route.url, proxyMiddleware);
    })
    
}
