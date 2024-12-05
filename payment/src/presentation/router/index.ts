import express, { Router } from 'express';
import PaymentRouter from './payment.router';
import { IPlanRepository } from '@/domain/IRespository/IPlan.repository';
import { IPaymentRepository } from '@/domain/IRespository/IPayment.repository';
import PlanRouter from './plan.router';


class AppRouter {
    public router: Router;
    private paymentRouter;
    private planRouter
    constructor(private planRepo: IPlanRepository, private paymentRepo: IPaymentRepository) {
        this.router = Router();
        this.paymentRouter = new PaymentRouter(this.paymentRepo).router
        this.planRouter= new PlanRouter(this.planRepo).router
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(this.paymentRouter);
        this.router.use(this.planRouter)
    }

}

export default AppRouter;