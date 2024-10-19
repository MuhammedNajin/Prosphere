import { createApplicationController } from "./createApplicationController";
import {
  ICreateApplicationUseCase
} from "@application/interface/applicationUsecase_interface.ts";

export class ApplicationController {

  static createApplication(applicationPostUseCase: ICreateApplicationUseCase) {
    return new createApplicationController(applicationPostUseCase).handler;
  }

}
