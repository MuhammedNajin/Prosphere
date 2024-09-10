import { Request, Response, NextFunction } from 'express';
import { Dependencies } from '../../libs/entities/interfaces';
import Token from '../../libs/utils/token';




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
                throw new Error("invalid credentials");
            }

            
            const payload = {
                id: userCredential._id,
                username: userCredential.username,
                email: userCredential.email,
                role: "user" as "user"
              };
            const token = Token.generateJwtToken(payload);
            console.log("token", token);
            
            res.cookie("jwt", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            });

            res.status(200).json(userCredential);
            
        } catch (error) {
            
        }
    }

    return login
}

export { loginController }