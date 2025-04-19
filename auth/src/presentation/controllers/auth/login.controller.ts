import { Request, Response, NextFunction } from 'express';
import { Dependencies } from '@domain/entities/interfaces';
import Token from '@infra/libs/token';
import { BadRequestError, StatusCode } from '@muhammednajinnprosphere/common';
import { winstonLogger } from '@/presentation/middleware/winstonLogger';
import { TOKEN_TYPE } from '@/shared/types/enums';



 const loginController = (dependencies: Dependencies) => {
    const {
        useCases: { loginUseCase, getUserUseCase },
        rpc: { grpcClient }
    } = dependencies;

    const login = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { email, password } = req.body;
            console.log("login controller ", req.body)

            winstonLogger.debug("Login controller", req.body);

            const userCredential = await loginUseCase(dependencies).execute({
                email,
                password,
            })
            console.log("userCredential", userCredential);

            if(!userCredential) {
                throw new BadRequestError("Invalid credential, please try again.")
            }
            
            const profile = await grpcClient.getUserProfile(userCredential._id);
            console.log("profile", profile)
            const payload = {
                id: userCredential._id,
                username: userCredential.username,
                email: userCredential.email,
                role: "user" as "user"
              };

              const { accessToken, refreshToken } = Token.generateJwtToken(payload);
              console.log(accessToken, refreshToken);
              
              res.cookie(TOKEN_TYPE.USER_ACCESS_TOKEN, accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
              });

              res.cookie(TOKEN_TYPE.USER_REFRESH_TOKEN, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
              });

            res
             .status(StatusCode.OK)
             .json({ userCredential, ...profile });
            
        } catch (error) {
            console.log(error);
            
            next(error)
        }
    }

    return login
}

export { loginController }