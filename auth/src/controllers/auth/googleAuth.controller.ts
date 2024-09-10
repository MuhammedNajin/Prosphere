import { Request, Response, NextFunction, json } from "express";
import { Dependencies } from "../../libs/entities/interfaces";
import Token from "../../libs/utils/token";


const googleAuthController = (dependencies: Dependencies) => {
  const {
    useCases: { googleAuthUseCase },
  } = dependencies;

  const googleAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers["authorization"]?.substring(7) as string;
   

      const { status, user } = await googleAuthUseCase(dependencies).execute(
        token
      );
      const payload = {
        id: user._id,
        email: user.email,
        username: user.username,
        role: 'user' as 'user',
      }
       const accessToken = Token.generateJwtToken(payload)
       res.cookie('jwt', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
       })
      res.status(200).json({ status, user });
    } catch (error) {
      console.log(error);
    }
  };

  return googleAuth;
};

export { googleAuthController };
