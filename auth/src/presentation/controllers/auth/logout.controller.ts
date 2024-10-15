import { Request, Response, NextFunction } from "express";

const logoutController = (depedencies: any) => {
  const logout = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.sendStatus(200)
    } catch (error) {
      console.log(error);
    }
  };

  return logout;
};

export { logoutController };
