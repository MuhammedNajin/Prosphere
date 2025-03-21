import { Router } from "express";
import { ApplicationController } from '../controller'
import ApplicationUseCase from '@application/interface/applicationUsecase_interface.ts';
import { validateRequestBody, CreateApplicationSchema } from '@muhammednajinnprosphere/common'


export class CompanyRoutes {
  
    private applicationUseCase;

    constructor(applicationUseCase: ApplicationUseCase) {
      console.log("contructor", applicationUseCase)
      this.applicationUseCase = applicationUseCase;
    }

    get router() {

        const router = Router();
        const { createApplicationUseCase, getAllApplicationUseCase } = this.applicationUseCase;
        console.log("job routes", createApplicationUseCase)
        router
         .route('/')
         .post(validateRequestBody(CreateApplicationSchema), ApplicationController.createApplication(createApplicationUseCase));

        router
        .route('/all/:companyId')
        .get(ApplicationController.getAllApplication(getAllApplicationUseCase))

        return router;
    }
}