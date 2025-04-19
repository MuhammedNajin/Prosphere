import { Request, Response, NextFunction } from 'express';
import { Dependencies } from '@domain/entities/interfaces';


 const logoutController = (dependencies: Dependencies) => {
    const {
        useCases: { getUsersUseCase }
    } = dependencies;

    const logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("logout admin:+++++ new one monneee", req.cookies);
    
            res.cookie('adminAccess', '', {  // Changed from 'accessToken' to 'adminAccess'
                httpOnly: true,
                expires: new Date(0),
                sameSite: 'none',
                secure: true 
            });
            
            res.cookie('adminRefresh', '', {  // This was already correct
                httpOnly: true,
                expires: new Date(0),
                sameSite: 'none',
                secure: true 
            });
    
            res.sendStatus(200); 
        } catch (error) {
            console.log(error);
        }
    }

    return logout
}

export { logoutController }