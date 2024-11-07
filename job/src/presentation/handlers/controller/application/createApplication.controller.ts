import {
  ICreateApplicationUseCase,
  IgetApplicationUseCase,
  IgetMyApplicationUseCase,
} from "@/application/interface/applicationUsecase_interface.ts";
import { StatusCode, ResponseUtil } from "@muhammednajinnprosphere/common";
import { application, NextFunction, Request, Response } from "express";

export class CreateApplicationController {
  constructor(
    private CreateApplicationUseCase: ICreateApplicationUseCase,
    private GetMyApplicationUseCase: IgetMyApplicationUseCase
  ) {}

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req body", req.body);
      const { jobId, companyId , applicantId } = req.body
      console.log(jobId.length, companyId.length, applicantId.length);
      
      const payload = JSON.parse(req.headers["x-user-data"] as string);
      console.log("payload", payload);
      // const applicationExixts = await this.GetMyApplicationUseCase.execute(
      //   payload.id
      // );

      // if (applicationExixts) {
      //   res
      //     .status(StatusCode.CONFLICT)
      //     .json(
      //       ResponseUtil.error(
      //         StatusCode.CONFLICT,
      //         "Only one application per candidate is allowed"
      //       )
      //     );
      // }

      const application = await this.CreateApplicationUseCase.execute(req.body);

      res
        .status(StatusCode.CREATED)
        .json(
          ResponseUtil.success(application, "Application created successfully")
        );

    } catch (error) {
      console.log("controller", error);
      next(error);
    }
  };
}
