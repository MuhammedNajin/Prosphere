import dependecies from "@/infra/config/dependecies";
import { NextFunction, Request, Response } from "express";
import { winstonLogger } from "./winstonLogger";


export const checkTrailLimit = (dependecies: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { 
            repository: { companyRepository, subscriptionRepository },
            useCases: { subscriptionCheckUseCase }
           } = dependecies;

          const { id } = JSON.parse(req.headers['x-company-data'] as string);

        const subscription = await subscriptionCheckUseCase(dependecies).execute(id);

        winstonLogger.info(`Subscription found for company ${id}`, { subscription });

      next();
    }
}