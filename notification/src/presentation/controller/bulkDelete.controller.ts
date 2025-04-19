import { NextFunction, Request, Response } from "express";
import { NotificationType, ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { INotificationRepository } from "@/domian/IRepository/INotification.repository";
import { DeleteNotificationUseCase } from "@application/usecase/deleteNotification.usecase";
import { DeleteBulkNotificationUseCase } from "@/application/usecase/deleteBulkNotification.usecase";

export class DeleteBulkNotificationController {
  constructor(private notificationRepo: INotificationRepository) {}

  public deleteBulkNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const { ids } = req.body;
      
      await new DeleteBulkNotificationUseCase(this.notificationRepo).execute(ids);
      
      res
       .status(StatusCode.OK)
       .json(ResponseUtil.success({ success: true }));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
