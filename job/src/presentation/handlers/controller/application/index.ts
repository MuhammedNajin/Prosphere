import { CreateApplicationController,  } from "./createApplication.controller";
import  { GetAllApplicationController } from "./getAllApplication.controller";
import { ChangeApplicationStatusController } from './changeApplicationStatus.controller'
import {
  ICreateApplicationUseCase,
  IgetAllApplicationUseCase,
  IChangeApplicationStatusUseCase,
  IgetApplicationUseCase
} from "@application/interface/applicationUsecase_interface.ts";
import { GetApplicationController } from "./getApplication.controller";

export class ApplicationController {

  static createApplication(applicationPostUseCase: ICreateApplicationUseCase) {
    return new CreateApplicationController(applicationPostUseCase).handler;
  }

  static getAllApplication(getAllapplicationUseCase: IgetAllApplicationUseCase) {
    return new GetAllApplicationController(getAllapplicationUseCase).handler;
  }

  static getApplication(getApplicationUseCase: IgetApplicationUseCase) {
    return new GetApplicationController(getApplicationUseCase).handler;
  }

  static changeApplicationStatus(changeApplicationStatusUseCase: IChangeApplicationStatusUseCase) {
    return new ChangeApplicationStatusController(changeApplicationStatusUseCase).handler
  }

}
