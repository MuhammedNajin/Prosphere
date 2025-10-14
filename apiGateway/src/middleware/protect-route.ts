import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ResponseUtil, HttpStatusCode, ResponseWrapper } from "@muhammednajinnprosphere/common";
import { TOKEN_TYPE } from "../@Types/enums";
import { CompanyPayload, Payload } from "src/@Types/interface";

enum Message {
  denied = "Access denied",
}

export const curentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies[TOKEN_TYPE.ACCESS_TOKEN];
  console.log("cookie user", token, "\n", process.env.TOKEN_SECRECT!);

  if (!token) {
    return next();
  }
  try {
    const tokenSecrect = process.env.TOKEN_SECRECT;
    const payload = jwt.verify(token, tokenSecrect!) as Payload;
    console.log("payload", payload);

    req.currentUser = payload;
  } catch (err) {
    console.log("err", err);
  }
  next();
};

export const currentAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.adminAccess;
  console.log("cookie", token);

  if (!token) {
    return next();
  }
  try {
    const tokenSecrect = process.env.ADMIN_SECRECT;
    const payload = jwt.verify(token, tokenSecrect!) as Payload;
    console.log("payload", payload);

    req.currentAdmin = payload;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const currentCompany = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(" current company middleware");

    const token = req.cookies[TOKEN_TYPE.COMPANY_ACCESS_TOKEN];
    console.log("token111111111111", token);

    if (!token) {
      console.log("token not found1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json(ResponseUtil.error(Message.denied));
    }

    const secret = process.env.COMPANY_ACCESS_SECRET!;
    console.log("jwt secret", secret, Message.denied);
    const payload = jwt.verify(token, secret) as CompanyPayload;

    // change this to as sperate middleware if multiple role comes (hr / onwer)
    if (payload.owner !== req.currentUser?.id) {
      console.log("owner id$$$$$$$$$$$$$", payload.owner, req.currentUser?.id);
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json(ResponseUtil.error(Message.denied));
    }

    req.currentCompany = payload;
    next();
  } catch (error) {
    console.log("error from current Company!!!!!!!!!!!!", error);
    res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json(ResponseUtil.error(Message.denied));
  }
};

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies[TOKEN_TYPE.ACCESS_TOKEN];
  console.log("token from authenticateUser", token);
  const resWrap = new ResponseWrapper(res);
  if (!token) {
    return resWrap
        .status(HttpStatusCode.UNAUTHORIZED)
        .error("TOKEN_REQUIRED", "Authentication required");
  }

  try {
    const tokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
    const payload = jwt.verify(token, tokenSecret!) as Payload;
    console.log("payload", payload)
    req.currentUser = payload.user;
    next();
  } catch (err) {
    console.log("Token verification error:", err);
     return resWrap
        .status(HttpStatusCode.UNAUTHORIZED)
        .error("TOKEN_REQUIRED", "Authentication required");
  }
};
