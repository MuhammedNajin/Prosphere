import { Application } from "express";
import { ROLE } from "../@Types/enums";
import { authenticateUser, currentCompany } from "../middleware/protect-route";
import { requireAdmin, requireUser } from "../middleware/require-auth";
import { AuthRouteConfig } from "src/@Types/interface";

export const setupAuth = (app: Application, route: AuthRouteConfig[]) => {


    route.forEach((route: AuthRouteConfig) => {
        console.log(`Setting up auth for: ${route.url} with auth: ${route.auth}`);
        if (route.auth === ROLE.ADMIN) {
            app.use(route.url, authenticateUser, requireAdmin);
        } else if (route.auth === ROLE.USER) {
            app.use(route.url, authenticateUser, requireUser);
        } else if (route.auth === ROLE.COMPANY) {
            app.use(route.url, authenticateUser, requireUser, currentCompany);
        } else if (route.auth === "subscription") {
            app.use(route.url, authenticateUser, requireUser, currentCompany);
        }
    });
}