import { NextFunction, Request, Response } from "express";
import { NotificationType, ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { INotificationRepository } from "@/domian/IRepository/INotification.repository";
import { GetNotificationUseCase } from "@application/usecase/getNotification.usecase";

export class GetNotificationController {
  constructor(private notificationRepo: INotificationRepository) {}

  public getNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("req.params", req.params, req.query);
      const { context, companyId, type } = req.query;
      const { userId } = req.params;
      const notifications = await new GetNotificationUseCase(
        this.notificationRepo
      
      ).execute(userId, type as NotificationType);
      console.log("notification", notifications);

      res
       .status(StatusCode.OK)
       .json(ResponseUtil.success(notifications));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
