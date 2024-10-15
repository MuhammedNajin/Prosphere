import { Request, Response, NextFunction } from 'express';
import { Dependencies } from '@domain/entities/interfaces';
import Token from '@infra/libs/token';
import { BadRequestError } from '@muhammednajinnprosphere/common';




 const loginController = (dependencies: Dependencies) => {
    const {
        useCases: { loginUseCase, getUserUseCase }
    } = dependencies;

    const login = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { email, password } = req.body;
            console.log("login controller ", req.body)

            console.log("cookies", req.cookies);

            const userCredential = await loginUseCase(dependencies).execute({
                email,
                password,
            })
            console.log("userCredential", userCredential);

            if(!userCredential) {
                throw new BadRequestError("Invalid credential, please try again.")
            }

            
            const payload = {
                id: userCredential._id,
                username: userCredential.username,
                email: userCredential.email,
                role: "user" as "user"
              };

              const { accessToken, refreshToken } = Token.generateJwtToken(payload);

              res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
              });

              res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
              });

            res.status(200).json(userCredential);
            
        } catch (error) {
            console.log(error);
            
            next(error)
        }
    }

    return login
}

export { loginController }