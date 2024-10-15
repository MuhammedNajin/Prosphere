import { Request, Response, NextFunction } from 'express';
import { Dependencies } from '@domain/entities/interfaces';





 const logoutController = (dependencies: Dependencies) => {
    const {
        useCases: { getUsersUseCase }
    } = dependencies;

    const fetchUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("logout admin", req.cookies);
            res.clearCookie("adminAccess")
            res.clearCookie("adminRefresh");
            res.sendStatus(200); 
        } catch (error) {
            console.log(error);
        }
    }

    return fetchUsers
}

export { logoutController }