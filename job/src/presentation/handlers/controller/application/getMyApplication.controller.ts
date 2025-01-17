import {
    IgetMyApplicationUseCase
  } from "@/application/interface/applicationUsecase_interface.ts";
import { StatusCode } from "@muhammednajinnprosphere/common";
  import { application, NextFunction, Request, Response } from "express";
  
  export class  GetMyApplicationController {
    
    constructor(private getMyApplicationUseCase: IgetMyApplicationUseCase) {}
  
    public handler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log("req", req.params);
        const filter = req.query.filter as string;
        const page = parseInt(req.query.page as string);
        const pageSize = parseInt(req.query.pageSize as string);
        const search = req.query.search as string;
        
        
        const { id: userId } = JSON.parse(req.headers['x-user-data'] as string);

        const applications = await this.getMyApplicationUseCase.execute({filter , page, search, userId, pageSize});
  
        res.status(StatusCode.OK).json( applications );

      } catch (error) {
        console.log("controller", error);
        next(error);
      }
    };
  }
  