import { Request, Response, NextFunction } from "express";
import { Dependencies } from "../../libs/entities/interfaces";

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
      console.log("reset-password contoller: ", req.body);

      const reset = await resetPasswordUseCase(dependencies).execute({
        token,
        password,
      });

      if (!reset) {
        throw new Error("reset passowrd token is not valid");
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
