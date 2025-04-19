import { CreateApplicationController,  } from "./createApplication.controller";
import  { GetAllApplicationController } from "./getAllApplication.controller";
import { ChangeApplicationStatusController } from './changeApplicationStatus.controller'
import {
  ICreateApplicationUseCase,
  IgetAllApplicationUseCase,
  IChangeApplicationStatusUseCase,
  IgetApplicationUseCase,
  IgetMyApplicationUseCase,
  IisAppliedUseCase,
} from "@application/interface/applicationUsecase_interface.ts";
import { GetApplicationController } from "./getApplication.controller";
import { GetMyApplicationController } from "./getMyApplication.controller";
import { IsAppliedController } from "./IsApplied.controller";
import { Dependency } from "@/infra/config/dependencies";

export class ApplicationController {

  static createApplication(ApplicationPostUseCase: ICreateApplicationUseCase, IsAppliedUseCase: IisAppliedUseCase, notificationProducer: Dependency['messageBroker']['notificationProducer']) {
    return new CreateApplicationController(ApplicationPostUseCase, IsAppliedUseCase, notificationProducer).handler;
  }

  static getAllApplication(getAllapplicationUseCase: IgetAllApplicationUseCase) {
    return new GetAllApplicationController(getAllapplicationUseCase).handler;
  }

  static getApplication(getApplicationUseCase: IgetApplicationUseCase) {
    return new GetApplicationController(getApplicationUseCase).handler;
  }

  static isApplied(isAppliedUseCase: IisAppliedUseCase) {
    return new IsAppliedController(isAppliedUseCase).handler;
  }

  static getMyApplication(getMyApplicationUseCase: IgetMyApplicationUseCase) {
    return new GetMyApplicationController(getMyApplicationUseCase).handler;
  }

  static changeApplicationStatus(changeApplicationStatusUseCase: IChangeApplicationStatusUseCase) {
    return new ChangeApplicationStatusController(changeApplicationStatusUseCase).handler
  }

}
