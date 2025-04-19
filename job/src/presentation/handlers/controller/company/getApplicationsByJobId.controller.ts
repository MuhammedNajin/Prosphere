import { IGetApplicationByJobIdUseCase } from "@/application/interface/companyUsecase_interface.ts";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";

export class GetApplicationByJobIdController {
  constructor(private getJobsByJobIdUseCase: IGetApplicationByJobIdUseCase) {}

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      // Validate pagination parameters
      if (page < 1 || pageSize < 1) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json(ResponseUtil.error("Invalid pagination parameters"));
      }

      const result = await this.getJobsByJobIdUseCase.execute(
        id,
        page,
        pageSize
      );

      res.status(StatusCode.OK).json({
        data: result.applications,

        total: result.total,
        currentPage: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
      });
    } catch (error) {
      console.error("Error in GetApplicationByJobIdController:", error);
      next(error);
    }
  };
}
