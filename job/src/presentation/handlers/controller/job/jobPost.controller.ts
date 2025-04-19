import { IUpdateFreeTrailUseCase } from "@/application/interface/companyUsecase_interface.ts";
import { IJobPostUseCase } from "@/application/interface/jobUsecase_interface";
import { Dependency } from "@/infra/config/dependencies";
import { StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";

export class JobPostController {

  private KEY = "usageLimit.jobPostLimit";
  
  constructor(
    private jobPostUseCase: IJobPostUseCase,
    private updateFreeTrailUseCase: IUpdateFreeTrailUseCase,
    private notificationProducer: Dependency["messageBroker"]["notificationProducer"],
    private updateTrailProducer: Dependency["messageBroker"]["updateTrailProducer"]
  ) {}

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req body", req.body);
      const job = await this.jobPostUseCase.execute(req.body);
      console.log("job", job);

      await this.notificationProducer.produce({
        actionUrl: `/job-description/${job?._id}`,
        data: {
          jobId: job?._id,
        },
        message: `A new ${job?.jobTitle} position is now available at ${job?.companyId.name}`,
        recipient: "all",
        title: "New Job Opportunity Posted",
        type: "job",
      });


      console.log("isTrail variable ", req.isTrail);

     if(req.isTrail) {
      await this.updateFreeTrailUseCase.execute(job?.companyId?._id, this.KEY)

      await this.updateTrailProducer.produce({
        companyId: job?.companyId._id,
        key: this.KEY,
      });
     }

      res.status(StatusCode.CREATED).json({
        success: true,
        message: "Job posted successfully",
        job,
      });

    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
