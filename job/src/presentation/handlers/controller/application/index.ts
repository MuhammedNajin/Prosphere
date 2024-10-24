import { CreateApplicationController,  } from "./createApplication.controller";
import  { GetAllApplicationController } from "./getAllApplication.controller"
import {
  ICreateApplicationUseCase,
  IgetAllApplicationUseCase
} from "@application/interface/applicationUsecase_interface.ts";

export class ApplicationController {

  static createApplication(applicationPostUseCase: ICreateApplicationUseCase) {
    return new CreateApplicationController(applicationPostUseCase).handler;
  }

  static getAllApplication(getAllapplicationUseCase: IgetAllApplicationUseCase) {
    return new GetAllApplicationController(getAllapplicationUseCase).handler;
  }

}
