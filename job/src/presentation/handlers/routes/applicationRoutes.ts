import { Router } from "express";
import { ApplicationController } from '../controller'
import ApplicationUseCase from '@application/interface/applicationUsecase_interface.ts';
import { validateRequest, CreateApplicationSchema } from '@muhammednajinnprosphere/common'
export class ApplicationRoutes {
  
    private applicationUseCase;

    constructor(applicationUseCase: ApplicationUseCase) {
      this.applicationUseCase = applicationUseCase;
    }

    get router() {

        const router = Router();
        console.log("job routes", this.applicationUseCase)
        const { createApplicationUseCase } = this.applicationUseCase;
        router
         .route('/')
         .post(validateRequest(CreateApplicationSchema), ApplicationController.createApplication(createApplicationUseCase));

        return router;
    }
}