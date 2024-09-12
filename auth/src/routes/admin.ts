import express from "express";
import { adminController } from "../controllers";
import { currentAdmin, requireAdmin } from '@muhammednajinnprosphere/common'

export const adminRoutes = (dependencies: any) => {
  const router = express.Router();
  console.log("authroutes");

  const {
     getAllUserController,
     blockUserController,
     logoutController
  } = adminController(dependencies);

  
  router.get("/users",
     currentAdmin,
     requireAdmin,
     getAllUserController
    );


  router.patch("/block/:email",
    currentAdmin,
    requireAdmin,
    blockUserController
  );

  router.post("/logout",
     logoutController
    );

  return router;
};
