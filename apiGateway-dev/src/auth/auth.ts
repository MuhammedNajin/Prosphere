import { Application } from "express";
import { AuthRouteConfig } from "../interface";
import { requireAuth, requireAdmin, curentUser, currentAdmin } from '@muhammednajinnprosphere/common'

export const setupAuth = (app: Application, route: AuthRouteConfig[]) => {
    route.forEach((route: AuthRouteConfig)  => {
        if(route.auth === 'admin') {
            app.use(route.url, currentAdmin, requireAdmin);
        } else if(route.auth === 'user') {
            app.use(route.url, curentUser, requireAuth);
        }
    })
}