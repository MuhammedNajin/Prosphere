import { HttpStatusCode, ResponseUtil } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json(ResponseUtil.error("Authentication required"));
  }

  if (req.currentUser.role !== 'admin') {
    return res
      .status(HttpStatusCode.FORBIDDEN)
      .json(ResponseUtil.error("Admin access required"));
  }

  next();
};

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json(ResponseUtil.error("Authentication required"));
  }

  if (req.currentUser.role !== 'user') {
    return res
      .status(HttpStatusCode.FORBIDDEN)
      .json(ResponseUtil.error("User access required"));
  }

  next();
};