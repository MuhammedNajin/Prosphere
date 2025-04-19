import { ILikeJobUseCase } from "@/application/interface/jobUsecase_interface"; 
import { NextFunction, Request, Response } from "express";

export class JobLikeController {
  private likeJobUseCase: ILikeJobUseCase;

  constructor(likeJobUseCase: ILikeJobUseCase) {
    this.likeJobUseCase = likeJobUseCase;
  }

  public handler = async (req: Request, res: Response, next: NextFunction) => {
    try {


      const { jobId, userId } = req.body;  

      const job = await this.likeJobUseCase.execute(jobId, userId);

      res.status(200).json({
        success: true,
        message: job ? "Job liked/unliked successfully" : "Job not found",
        job,
      });


    } catch (error) {
      console.error(error);
      next(error); 
    }
  };
}
