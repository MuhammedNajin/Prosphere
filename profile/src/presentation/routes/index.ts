import express from "express";

import { profileRoutes } from "./user";

export const routes = (depedencies: any) => {
    console.log("routes")
  const routes = express.Router();
   
  try {
    routes.use("/profile", profileRoutes(depedencies));
   
  } catch (error) {
    console.log(error);
  }
  return routes;
};
