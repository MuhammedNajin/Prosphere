import {
    IChangeApplicationStatusUseCase
  } from "@/application/interface/applicationUsecase_interface.ts";
  import { application, NextFunction, Request, Response } from "express";
  
  export class ChangeApplicationStatusController {
    private changeApplicationStatusUseCase: IChangeApplicationStatusUseCase;
    constructor(changeApplicationStatusUseCase: IChangeApplicationStatusUseCase) {
      console.log("createApplicationUseCase", changeApplicationStatusUseCase)
      this.changeApplicationStatusUseCase = changeApplicationStatusUseCase;
    }
  
    public handler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const { 
          status,
          title,
          description
         } = req.body

        const statusDescription = {
          title,
          description,
        }
        const application = await this.changeApplicationStatusUseCase.execute(id, status, statusDescription);
  
        res.status(200).json({
          success: true,
          application,
          message: "Status updated successfully"
        });

      } catch (error) {
        console.log("controller", error);
        next(error);
      }
    };
  }
  