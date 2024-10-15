import { Request, Response, NextFunction } from 'express';
import { Dependencies } from '@domain/entities/interfaces';
import Token from '@infra/libs/token';
import { BadRequestError } from '@muhammednajinnprosphere/common';

 const adminLoginController = (dependencies: Dependencies) => {
    const {
        useCases: { adminUseCase }
    } = dependencies;

    const login = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { email, password } = req.body;
            console.log("login controller ", req.body)

            console.log("cookies", req.cookies);

            const adminCredential = await adminUseCase(dependencies).execute({
                email,
                password,
            })
            console.log("adminCredential", adminCredential);

            if(!adminCredential) {
                throw new BadRequestError("Invalid credentials, please try again.")
            }

            
            const payload = {
                id: '',
                username: '',
                email: adminCredential.email,
                role: 'admin' as "admin" 
              };
            const { accessToken, refreshToken } = Token.generateJwtToken(payload, { createAdminToken: true });

            console.log("token", accessToken, refreshToken);
            
            res.cookie("adminAccess", accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            });

            res.cookie("adminRefresh", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"
            })

            res.status(200).json(adminCredential);
            
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    return login
}

export { adminLoginController }