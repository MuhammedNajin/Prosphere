import { NextFunction, Request, Response } from "express";
import { winstonLogger } from "./winstonLogger";
import { ISubscriptionCheckUseCase } from "@/application/interface/companyUsecase_interface.ts";
import { URL } from "@/shared/types/enums";
import { BadRequestError } from "@muhammednajinnprosphere/common";

/**
 * TrailLimitMiddleware class handles the verification of trial limits
 * for company subscriptions in the application
 */
export class TrailLimitMiddleware {
  
    constructor(private subscriptionCheckUseCase: ISubscriptionCheckUseCase) {
      console.log("subscriptionCheckUseCase!!!!!!!!!!!!!!!!!!!!!!!!!", subscriptionCheckUseCase);
      
    }

    /**
     * Middleware method to check trial limits
     * This method can be used directly in Express routes
     */
    public checkTrailLimit = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
        winstonLogger.info('reached tail limit middleware', { headers: req.headers });

         const { id } = JSON.parse(req.headers['x-company-data'] as string);
         const url = req.url;
        const subscription = await this.subscriptionCheckUseCase.execute(id);
        winstonLogger.info('Checking trail limit', { subscription });

        if(!subscription) {
           throw new Error('Subscription not found');
        }

        if(!subscription?.isSubscribed) {
           console.log("trial checking");

          req.isTrail = true
          if(url.includes(URL.JobPost)) {

            if (
              subscription?.usageLimit['jobPostLimit'] >
              subscription?.trailLimit["jobPostLimit"]
            ) {
               throw new BadRequestError('Trail limit reached for job post');
            }
            
          }
        } else {
           
        }
        
        next();

        } catch (error) {
            winstonLogger.error('Error checking trail limit', { error });
            next(error);
        }
    };
}