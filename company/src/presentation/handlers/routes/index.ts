import express from "express";
import { companyRoutes } from './company'
import { adminRoutes } from "./admin";
import { userRoutes } from "./user";
import { currentAdmin, requireAdmin } from "@muhammednajinnprosphere/common";

export const routes = (depedencies: any) => {
    console.log("routes")
  const routes = express.Router();
   
  try {
    routes.use((req, res, next) => {
      console.log("app route ", req.url)
      next()
   })
    routes.use("/company", companyRoutes(depedencies));
    routes.use("/admin", currentAdmin, requireAdmin,  adminRoutes(depedencies));
    routes.use("/user", userRoutes(depedencies));

  } catch (error) {
    console.log(error);
  }
  return routes;
};
