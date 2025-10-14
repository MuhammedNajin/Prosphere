import express from "express";

import userRouter from './user.router';
import companyRouter from './company.router';
import adminRouter from './admin.router';

const routes = express.Router();

routes.use("/users", userRouter); 
routes.use("/companies", companyRouter); 
routes.use("/admin", adminRouter);

export default routes;