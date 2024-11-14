import express from "express";
import { companyRoutes } from './company'
import { adminRoutes } from "./admin";
export const routes = (depedencies: any) => {
    console.log("routes")
  const routes = express.Router();
   
  try {
    routes.use("/company", companyRoutes(depedencies));
    routes.use("/admin", adminRoutes(depedencies));
   
  } catch (error) {
    console.log(error);
  }
  return routes;
};
