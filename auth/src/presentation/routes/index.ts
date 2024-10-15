import express from "express";
import { authRoutes } from "./auth";
import { adminRoutes } from "./admin";

export const routes = (depedencies: any) => {
    console.log("routes")
  const routes = express.Router();
   
  try {
    routes.use("/auth", authRoutes(depedencies));
    routes.use("/admin", adminRoutes(depedencies));
  } catch (error) {
    console.log(error);
  }
  return routes;
};
