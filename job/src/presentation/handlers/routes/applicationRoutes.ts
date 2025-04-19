import { Router } from "express";
import { ApplicationController } from '../controller'
import ApplicationUseCase from '@application/interface/applicationUsecase_interface.ts';
import { validateRequestBody, CreateApplicationSchema, currentCompany } from '@muhammednajinnprosphere/common'
import dotenv from 'dotenv'
import { Dependency } from "@/infra/config/dependencies";

dotenv.config()
export class ApplicationRoutes {
  
    private applicationUseCase;

    constructor(applicationUseCase: ApplicationUseCase, private notificationProducer: Dependency['messageBroker']['notificationProducer']) {
      console.log("contructor", applicationUseCase, notificationProducer)
      this.applicationUseCase = applicationUseCase;
    }

    get router() {

        const router = Router();
        const { 
          createApplicationUseCase,    
          getAllApplicationUseCase,
          changeApplicationStatusUseCase,
          getApplicationUseCase,
          getMyApplicationUseCase,
          isAppliedUseCase

               } = this.applicationUseCase;


        router.use((req, res, next) => {
          console.log("application route", req.url, req.method)
          next()
        })

        router
        .route('/')
         .post(validateRequestBody(CreateApplicationSchema), ApplicationController.createApplication(createApplicationUseCase, isAppliedUseCase, this.notificationProducer));

         router.get('/my-application', ApplicationController.getMyApplication(getMyApplicationUseCase))
         
         router.get('/:jobId',ApplicationController.isApplied(isAppliedUseCase))

        
        return router;
    }
}