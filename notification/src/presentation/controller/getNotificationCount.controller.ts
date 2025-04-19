import { NextFunction, Request, Response } from "express";
import { NotificationType, ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { INotificationRepository } from "@/domian/IRepository/INotification.repository";
import { GetNotificationCountUseCase } from "@/application/usecase/getNotificationCount.usecase";


export class GetNotificationCountController {
  constructor(private notificationRepo: INotificationRepository) {}

  public getNotificationCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    
      const { userId } = req.params;
      const count = await new GetNotificationCountUseCase(
        this.notificationRepo
      
      ).execute(userId);
      console.log("notification", count);

      res
       .status(StatusCode.OK)
       .json(ResponseUtil.success(count));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
