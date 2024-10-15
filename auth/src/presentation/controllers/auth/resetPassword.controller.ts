import { Request, Response, NextFunction } from "express";
import { Dependencies } from "@domain/entities/interfaces";
import { BadRequestError } from "@muhammednajinnprosphere/common";

const resetPasswordController = (dependencies: Dependencies) => {
  const {
    useCases: { resetPasswordUseCase },
  } = dependencies;

  const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      console.log("reset-password contoller: ", req.body, token);

      const reset = await resetPasswordUseCase(dependencies).execute({
        token,
        password,
      });

      if (!reset) {
        throw new BadRequestError("Your link has been expired, try agian.");
      }

      res.status(201).json({
        status: "success",
        message: "password successfully reset",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return resetPassword;
};

export { resetPasswordController };
