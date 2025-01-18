import { IgetAllApplicationUseCase } from "@/application/interface/applicationUsecase_interface.ts";
import { StatusCode } from "@muhammednajinnprosphere/common";
import { application, NextFunction, Request, Response } from "express";

export class GetAllApplicationController {
  constructor(private getAllApplicationUseCase: IgetAllApplicationUseCase) {}

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req", req.params);
      const { companyId } = req.params;
      const filter = req.query.filter as string;
      const page = parseInt(req.query.page as string);
      const pageSize = parseInt(req.query.pageSize as string);
      const search = req.query.search as string;

      const applications = await this.getAllApplicationUseCase.execute(
        companyId,
        {
          page,
          pageSize,
          search,
          filter,
        }
      );

      console.log("applications", applications);

      res.status(StatusCode.OK).json(applications);
    } catch (error) {
      next(error);
    }
  };
}
