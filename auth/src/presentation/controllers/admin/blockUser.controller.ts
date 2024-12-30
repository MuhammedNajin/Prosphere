import { Request, Response, NextFunction } from 'express';
import { Dependencies } from '@domain/entities/interfaces';



 const blockUserController = (dependencies: Dependencies) => {
    const {
        useCases: { blockUserUseCase }
    } = dependencies;

    const blockUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
          const blocked = await blockUserUseCase(dependencies).execute(id);
          if(!blocked) {
            throw new Error("something went wrong")
          }
            res.status(200).json({ blocked: true });
        } catch (error) {
            
        }
    }

    return blockUsers
}

export { blockUserController }