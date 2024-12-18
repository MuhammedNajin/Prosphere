import { NextFunction, Request, Response } from "express";

export const subscriptionWrapper = (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        console.log(error);
        throw error
        
    }
}