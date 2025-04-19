import { NextFunction, Request, Response } from "express";
import { ResponseUtil, StatusCode } from "@muhammednajinnprosphere/common";
import { INotificationRepository } from "@/domian/IRepository/INotification.repository";
import { ReadNotificationUseCase } from "@application/usecase/readNotification.usecase"

export class ReadNotificationController {
  constructor(private notificationRepo: INotificationRepository) {}

  public readNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("req.params", req.params);
      const { id } = req.params;

      await new ReadNotificationUseCase(this.notificationRepo).execute(id);

      res
       .status(StatusCode.OK)
       .json(ResponseUtil.success({ success: true }));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
