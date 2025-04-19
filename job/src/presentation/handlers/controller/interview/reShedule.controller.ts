import { IgetAllJobByCompanyIdUseCase } from "@/application/interface/companyUsecase_interface.ts";
import { winstonLogger } from "@/presentation/middleware/winstonLogger";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";

export class GetAllJobByCompanyIdController {
  constructor(
    private getAllJobByCompanyIdUseCase: IgetAllJobByCompanyIdUseCase
  ) {}

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      winstonLogger.info("req.query", req.query);

      const to = req.query.to as string;
      const from = req.query.from as string;
      const filter = req.query.filter as string;
      const { id } = JSON.parse(req.headers["x-company-data"] as string);
      const page = req.query.page as string;
      const pageSize = req.query.pageSize as string;

      const jobs = await this.getAllJobByCompanyIdUseCase.execute(id, {
        filter,
        from,
        to,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });

      res
       .status(StatusCode.OK)
       .json(jobs);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
