import express from "express";

import { adminController } from "../controllers";

export const adminRoutes = (dependencies: any) => {
  const router = express.Router();
  console.log("authroutes");

  const {
     getAllUserController
  } = adminController(dependencies);

  
  router.get("/users", getAllUserController);
  router.patch("/block/:email", )

  return router;
};
