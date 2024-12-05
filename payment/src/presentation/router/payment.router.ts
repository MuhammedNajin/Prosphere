import express, { Router } from 'express';
import { CreatePaymentController } from '../controller/payment/payment.controller';
import { IPlanRepository } from '@/domain/IRespository/IPlan.repository';

class PaymentRouter {
    public router: Router;
    private paymentController = new CreatePaymentController()
    constructor(private planRepo: IPlanRepository) {
        this.router = Router();

        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/payment', this.paymentController.create);
    }

}

export default PaymentRouter;