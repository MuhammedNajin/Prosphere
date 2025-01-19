import express, { Router } from 'express';
import PaymentRouter from './payment.router';
import { IPlanRepository } from '@/domain/IRespository/IPlan.repository';
import { IPaymentRepository } from '@/domain/IRespository/IPayment.repository';
import PlanRouter from './plan.router';
import { ISubscriptionRepository } from '@/domain/IRespository/ISubscription.repository';
import { ICompanyRepository } from '@/domain/IRespository/ICompany.repository';
import SubscriptionRouter from './subscription.router';
import { MessageBrokerProducers } from '@/infrastructure/messageBroker/kafka';
class AppRouter {
    public router: Router;
    private paymentRouter;
    private planRouter;
    private subscriptionRouter;
    constructor( 
        private subscriptionRepo: ISubscriptionRepository,
        private planRepo: IPlanRepository,
        private paymentRepo: IPaymentRepository,
        private companyRepo: ICompanyRepository,
        private messageBroker: MessageBrokerProducers,
    ) {
        this.router = Router();
        this.paymentRouter = new PaymentRouter(
            this.subscriptionRepo,
            this.planRepo,
            this.paymentRepo,
             this.companyRepo,
             this.messageBroker
            ).router


        this.planRouter= new PlanRouter(this.planRepo).router

        this.subscriptionRouter = new SubscriptionRouter(this.subscriptionRepo).router;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(this.paymentRouter);
        this.router.use(this.planRouter)
        this.router.use(this.subscriptionRouter)
    }

}

export default AppRouter;