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
     getAllUserController
    );


  router.patch("/block/:id",
    blockUserController
  );

  router.post("/logout",
     logoutController
    );

  return router;
};
