import { Request, Response, NextFunction } from "express";
import { Dependencies } from "@domain/entities/interfaces";
import { StatusCode } from "@muhammednajinnprosphere/common";

const changePasswordController = (dependencies: Dependencies) => {
  const {
    useCases: { changePasswordUseCase },
  } = dependencies;

  const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, newPassword, oldPassword } = req.body;
      console.log("resent-otp contoller: ", req.body);

      await changePasswordUseCase(dependencies).execute(oldPassword, newPassword, id)


      res
       .status(StatusCode.CREATED)
       .json({ success: true });

    } catch (error) {

      console.log(error);

       next(error)
    }
  };

  return forgotPassword;
};

export { changePasswordController };
