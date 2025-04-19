import { TIME_FRAME } from "@/shared/types/enums";
import { GetAllJobByCompanyIdController,  } from "./getAllJobByCompanyId.controller";
import { GetApplicationByJobIdController } from "./getApplicationsByJobId.controller";

import {
 IgetAllJobByCompanyIdUseCase, 
 IGetApplicationByJobIdUseCase,
 IGetJobMetrixUseCase
} from "@application/interface/companyUsecase_interface.ts";
import { GetJobMetrixController } from "./getJobMetrix.controller";
export class CompanyController {

  static getAllJob(getAllJobByCompanyIdUseCase: IgetAllJobByCompanyIdUseCase) {
    return new GetAllJobByCompanyIdController(getAllJobByCompanyIdUseCase).handler;
  }

  static getApplicatioByJobId(getJobsByJobIdUseCase: IGetApplicationByJobIdUseCase) {
    return new GetApplicationByJobIdController(getJobsByJobIdUseCase).handler;
  }

  static getJobMetrix(getJobMetrixUseCase: IGetJobMetrixUseCase) {
    return new GetJobMetrixController(getJobMetrixUseCase).handler; 
  }

  static getJobSeen(getJobSeenUseCase: IGetJobMetrixUseCase) {
    return new GetJobMetrixController(getJobSeenUseCase).handler; 
  }

}
