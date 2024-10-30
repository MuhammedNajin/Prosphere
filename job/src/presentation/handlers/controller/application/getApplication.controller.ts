import {
    IgetAllApplicationUseCase
  } from "@/application/interface/applicationUsecase_interface.ts";
  import { application, NextFunction, Request, Response } from "express";
  
  export class  GetApplicationController {
    private getAllApplicationUseCase: IgetAllApplicationUseCase;
    constructor(getAllApplicationUseCase: IgetAllApplicationUseCase) {
      this.getAllApplicationUseCase = getAllApplicationUseCase;
    }
  
    public handler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log("req", req.params);
        const { companyId } = req.params;

        const applications = await this.getAllApplicationUseCase.execute(companyId);
  
        res.status(200).json({
          applications,
        });

      } catch (error) {
        console.log("controller", error);
        next(error);
      }
    };
  }
  