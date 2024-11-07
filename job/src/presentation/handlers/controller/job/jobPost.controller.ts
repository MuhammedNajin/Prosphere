import { IJobPostUseCase } from "@/application/interface/jobUsecase_interface";
import { NextFunction, Request, Response } from "express";

export class JobPostController {
     private jobPostUseCase: IJobPostUseCase
     constructor(jobPostUseCase: IJobPostUseCase) {
       this.jobPostUseCase = jobPostUseCase;
     }
    

     public handler = async (req: Request, res: Response, next: NextFunction) => {
          
        try {
             console.log('req body', req.body)
             const job = await this.jobPostUseCase.execute(req.body);

            res
             .status(201)
             .json({
                success: true,
                message: "Job posted successfully",
                job
             })
        } catch (error) {


            console.log(error)
            next(error);
        }

     }

}