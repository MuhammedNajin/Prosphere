import { Router } from "express";
import { ApplicationController } from '../controller'
import ApplicationUseCase from '@application/interface/applicationUsecase_interface.ts';
import { validateRequestBody, CreateApplicationSchema } from '@muhammednajinnprosphere/common'
export class ApplicationRoutes {
  
    private applicationUseCase;

    constructor(applicationUseCase: ApplicationUseCase) {
      console.log("contructor", applicationUseCase)
      this.applicationUseCase = applicationUseCase;
    }

    get router() {

        const router = Router();
        const { 
          createApplicationUseCase,    
          getAllApplicationUseCase,
          changeApplicationStatusUseCase,
          getApplicationUseCase,
          getMyApplicationUseCase
               } = this.applicationUseCase;
        console.log("job routes", createApplicationUseCase)
        router
         .route('/')
         .post(validateRequestBody(CreateApplicationSchema), ApplicationController.createApplication(createApplicationUseCase));

        router
        .route('/all/:companyId')
        .get(ApplicationController.getAllApplication(getAllApplicationUseCase))

        router
        .route('/:id')
        .get(ApplicationController.getApplication(getApplicationUseCase))
        .put(ApplicationController.changeApplicationStatus(changeApplicationStatusUseCase))

        router.get('/my-application/:userId', ApplicationController.getMyApplication(getMyApplicationUseCase))
        
        return router;
    }
}