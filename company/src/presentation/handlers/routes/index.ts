import express from "express";
import { companyRoutes } from './company'

export const routes = (depedencies: any) => {
    console.log("routes")
  const routes = express.Router();
   
  try {
    routes.use("/company", companyRoutes(depedencies));
   
  } catch (error) {
    console.log(error);
  }
  return routes;
};
