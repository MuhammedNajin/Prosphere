import {
    IgetMyApplicationUseCase
  } from "@/application/interface/applicationUsecase_interface.ts";
  import { application, NextFunction, Request, Response } from "express";
  
  export class  GetMyApplicationController {
    private getMyApplicationUseCase:  IgetMyApplicationUseCase;
    constructor(getMyApplicationUseCase:  IgetMyApplicationUseCase) {
      this.getMyApplicationUseCase = getMyApplicationUseCase;
    }
  
    public handler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log("req", req.params);
        const { userId } = req.params;

        const applications = await this.getMyApplicationUseCase.execute(userId);
  
        res.status(200).json({
          status: true,
          applications,
          message: "My Job Application"
        });

      } catch (error) {
        console.log("controller", error);
        next(error);
      }
    };
  }
  