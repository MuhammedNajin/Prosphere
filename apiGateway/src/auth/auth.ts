import { Application } from "express";
import { AuthRouteConfig } from "../type/interface";
import { requireAuth, requireAdmin, curentUser, currentAdmin, currentCompany, NotAuthorizedError } from '@muhammednajinnprosphere/common'
import { ROLE } from "../type/enums";
import jwt, { JsonWebTokenError } from "jsonwebtoken";


interface CompanyPayload {
    id: string,
    name: string
    owner: string
    verified: boolean
    status: "pending" | 'uploaded' | 'verified' | 'reject';
    role : 'owner'
  }
  
export const setupAuth = (app: Application, route: AuthRouteConfig[]) => {
    route.forEach((route: AuthRouteConfig)  => {
        if(route.auth === ROLE.ADMIN) {
            app.use(route.url, currentAdmin, requireAdmin);
        } else if(route.auth === ROLE.USER) {
            app.use(route.url, curentUser, requireAuth);
        } else if(route.auth === ROLE.COMPANY) {
            app.use(route.url,  curentUser, requireAuth, currentCompany)
        }
    })
}