import { NextFunction, Request, Response } from "express";
import { StatusCode, ResponseUtil } from "@muhammednajinnprosphere/common";

export const changeCompanyStatusController = (dependencies: any) => {
  console.log("signup");

  const {
    useCases: { changeCompanyStatusUseCase },
  } = dependencies;

  const changeCompanyStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.query, req.params, "change status");
      const { id } = req.params;
      const { status } = req.query;

      await changeCompanyStatusUseCase(dependencies).execute(status, id);

      res
        .status(StatusCode.OK)
        .json(ResponseUtil.success(status, "Status changed successfully"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  return changeCompanyStatus;
};
