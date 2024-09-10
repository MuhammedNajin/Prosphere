import { Request, Response, NextFunction } from 'express';
import { Dependencies } from '../../libs/entities/interfaces';
import generateToken from '../../libs/utils/token';
import Token from '../../libs/utils/token';




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
                throw new Error("invalid credentials");
            }

            
            const payload = {
                id: '',
                username: '',
                email: adminCredential.email,
                role: 'admin' as "admin" 
              };
            const token = Token.generateJwtToken(payload);
            console.log("token", token);
            
            res.cookie("jwt", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            });

            res.status(200).json(adminCredential);
            
        } catch (error) {
            
        }
    }

    return login
}

export { adminLoginController }