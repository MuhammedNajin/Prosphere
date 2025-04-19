import {
  IgetJobsUseCase,
} from "@/application/interface/jobUsecase_interface";
import { StatusCode } from "@muhammednajinnprosphere/common";
import { NextFunction, Request, Response } from "express";

export class GetJobsController {
  private getJobsUseCase: IgetJobsUseCase;
  constructor(getJobsUseCase: IgetJobsUseCase) {
    this.getJobsUseCase = getJobsUseCase;
  }

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
    console.log("get jobs ", req.query);
    
      
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const search = (req.query.search as string) || "";
      const location = (req.query.location as string) || ""
      const filter = { 
        salary: {
        
        }
      }
       const min = req.query.minSalary;
       const max = req.query.maxSalary;
       const experience = req.query.experience;
       const employment = req.query.employment;
       const jobLocation = req.query.jobLocation;

      if(min) {
         filter.salary.min = min
      }

      if(max) {
        filter.salary.max = max
      }

      if(experience) {
         filter.experience = experience
      }

      if(employment) {
        filter.employment = employment
      }

      if(jobLocation) {
        filter.jobLocation = jobLocation
      }





      const result = await this.getJobsUseCase.execute({
        page,
        pageSize,
        filter,
        search,
        location,
      });

      res.status(StatusCode.OK).json({
        ...result,
        hasMore: result.currentPage < result.totalPages
      });

    } catch (error) {
      console.error('GetJobsController error:', error);
      next(error);
    }
  };
}