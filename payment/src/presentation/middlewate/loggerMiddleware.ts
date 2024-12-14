import { Request, Response, NextFunction } from 'express';
import { createCustomLogger } from '@muhammednajinnprosphere/common';
import winston from 'winston';



declare global {
    namespace Express {
        export interface Request {
            logger?: winston.Logger,
        }
    }
}


const customLogger = createCustomLogger('payment-service', __dirname);

const loggerMiddleware = (req: any, res: Response, next: NextFunction) => {
    req.logger = customLogger;
    next();
};


export default loggerMiddleware;