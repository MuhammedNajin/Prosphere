import {
    ICreateApplicationUseCase
  } from "@/application/interface/applicationUsecase_interface.ts";
  import { application, NextFunction, Request, Response } from "express";
  
  export class createApplicationController {
    private createApplicationUseCase: ICreateApplicationUseCase;
    constructor(createApplicationUseCase: ICreateApplicationUseCase) {
      this.createApplicationUseCase = createApplicationUseCase;
    }
  
    public handler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log("req", req.body);
        const application = await this.createApplicationUseCase.execute(req.body);
  
        res.status(200).json({
          success: true,
          application,
        });

      } catch (error) {
        console.log("controller", error);
        next(error);
      }
    };
  }
  