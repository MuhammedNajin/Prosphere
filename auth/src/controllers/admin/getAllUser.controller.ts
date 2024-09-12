import { Request, Response, NextFunction } from 'express';
import { Dependencies } from '../../libs/entities/interfaces';
import generateToken from '../../libs/utils/token';
import Token from '../../libs/utils/token';




 const getAllUserController = (dependencies: Dependencies) => {
    const {
        useCases: { getUsersUseCase }
    } = dependencies;

    const fetchUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("getAll users", req.cookies);
            
            const users = await getUsersUseCase(dependencies).execute();
            res.status(200).json(users);
            
        } catch (error) {
            
        }
    }

    return fetchUsers
}

export { getAllUserController }