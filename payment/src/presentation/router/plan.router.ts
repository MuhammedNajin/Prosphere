import express, { Router } from 'express';
import { CreatePaymentController } from '../controller/payment/payment.controller';
import { IPlanRepository } from '@/domain/IRespository/IPlan.repository';
import { CreatePlanController } from '../controller/plan/createPlan.controller';

class PlanRouter {
    public router: Router;
    private planController = new CreatePlanController(this.planRepo)
    constructor(private planRepo: IPlanRepository) {
        this.router = Router();

        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/payment/plans', this.planController.create);
        this.router.get('plans', )

    }

}

export default PlanRouter;