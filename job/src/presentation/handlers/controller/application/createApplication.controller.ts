import {
  ICreateApplicationUseCase,
  IisAppliedUseCase,
} from "@/application/interface/applicationUsecase_interface.ts";
import { Dependency } from "@/infra/config/dependencies";
import { winstonLogger } from "@/presentation/middleware/winstonLogger";
import { StatusCode, ResponseUtil } from "@muhammednajinnprosphere/common";
import { application, NextFunction, Request, Response } from "express";

export class CreateApplicationController {
  constructor(
    private CreateApplicationUseCase: ICreateApplicationUseCase,
    private IsAppliedUseCase: IisAppliedUseCase,
    private notificationProducer: Dependency["messageBroker"]["notificationProducer"]
  ) {
    console.log("notificationProducer", notificationProducer);
  }

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req body", req.body);
      const { jobId, companyId, applicantId } = req.body;
      console.log(jobId.length, companyId.length, applicantId.length);

      const { id } = JSON.parse(req.headers["x-user-data"] as string);
      console.log("id", id);

      const applicationExixts = await this.IsAppliedUseCase.execute(id, jobId);

      winstonLogger.info("applicationExixts", { applicationExixts });

      if (applicationExixts) {
        console.log("application already exists", applicationExixts)
        return res
          .status(StatusCode?.CONFLICT)
          .json(
            ResponseUtil.error("Only one application per candidate is allowed")
          );
      }

      const application = await this.CreateApplicationUseCase.execute(req.body);

      await this.notificationProducer.produce({
        actionUrl: `/myapplication`,
        data: {
          applicationId: application?._id,
        },
        message: `Your application for ${application?.jobId?.jobTittle} at ${application?.companyId?.name} has been successfully submitted. We'll notify you when there's an update.`,
        recipient: id,
        title: "Application Received",
        type: "application",
      });

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
