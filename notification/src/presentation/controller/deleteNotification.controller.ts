import { NextFunction, Request, Response } from "express";
import { NotificationType, ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { INotificationRepository } from "@/domian/IRepository/INotification.repository";
import { DeleteNotificationUseCase } from "@application/usecase/deleteNotification.usecase";

export class DeleteNotificationController {
  constructor(private notificationRepo: INotificationRepository) {}

  public deleteNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const { id } = req.params;
      
      await new DeleteNotificationUseCase(this.notificationRepo).execute(id);
      
      res
       .status(StatusCode.OK)
       .json(ResponseUtil.success({ success: true }));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
