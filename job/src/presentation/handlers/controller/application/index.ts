import { CreateApplicationController,  } from "./createApplication.controller";
import  { GetAllApplicationController } from "./getAllApplication.controller";
import { ChangeApplicationStatusController } from './changeApplicationStatus.controller'
import {
  ICreateApplicationUseCase,
  IgetAllApplicationUseCase,
  IChangeApplicationStatusUseCase,
  IgetApplicationUseCase,
  IgetMyApplicationUseCase
} from "@application/interface/applicationUsecase_interface.ts";
import { GetApplicationController } from "./getApplication.controller";
import { GetMyApplicationController } from "./getMyApplication.controller";

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

  static getMyApplication(getMyApplicationUseCase: IgetMyApplicationUseCase) {
    return new GetMyApplicationController(getMyApplicationUseCase).handler;
  }

  static changeApplicationStatus(changeApplicationStatusUseCase: IChangeApplicationStatusUseCase) {
    return new ChangeApplicationStatusController(changeApplicationStatusUseCase).handler
  }

}
