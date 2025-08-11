import express from "express";
import authRouter from "./auth-router";
import adminRouter from "./admin-router";


  const routes = express.Router();
   
    routes.use("/auth", authRouter);
    routes.use("/admin", adminRouter);
  
  
export default routes;
