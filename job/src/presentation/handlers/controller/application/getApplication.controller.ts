import {
    IgetAllApplicationUseCase,
    IgetApplicationUseCase
  } from "@/application/interface/applicationUsecase_interface.ts";
  import { application, NextFunction, Request, Response } from "express";
  
  export class  GetApplicationController {
    private getApplicationUseCase: IgetApplicationUseCase;
    constructor(getApplicationUseCase: IgetApplicationUseCase) {
      this.getApplicationUseCase = getApplicationUseCase;
    }
  
    public handler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log("req", req.params);
        const { id } = req.params;

        const applications = await this.getApplicationUseCase.execute(id);
  
        res.status(200).json({
          status: true,
          applications,
          message: "Job Application details"
        });

      } catch (error) {
        console.log("controller", error);
        next(error);
      }
    };
  }
  