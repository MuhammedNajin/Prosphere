import {
    IgetJobDetailsUseCase
  } from "@/application/interface/jobUsecase_interface";
  import { NextFunction, Request, Response } from "express";

  
  export class GetJobDetailsController {
    constructor(private getJobDetailsUseCase: IgetJobDetailsUseCase) {}
  
    public handler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        console.log("id", id);
        
        const job = await this.getJobDetailsUseCase.execute(id);
        console.log("jod", job)
        res.status(200).json({
          job
        });
      } catch (error) {
        console.log(error);
        next(error);
      }
    };
  }
  