import { NextFunction, Request, Response } from "express";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { INotificationRepository } from "@/domian/IRepository/INotification.repository";
import { ReadNotificationsUseCase } from "@/application/usecase/ReadNotifications.usecase";

export class ReadNotificationsController {
  constructor(private notificationRepo: INotificationRepository) {}

  public readNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("req.params", req.body);
      const { ids } = req.body

      await new ReadNotificationsUseCase(this.notificationRepo).execute(ids);

      res
       .status(StatusCode.OK)
       .json(ResponseUtil.success({ success: true }));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
