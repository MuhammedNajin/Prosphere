import { JobPostController } from './jobPost.controller'
import { IJobPostUseCase } from '@application/interface/jobUsecase_interface'
export class JobController {
    

    static jobPost(jobPostUseCase: IJobPostUseCase) {
      return new JobPostController(jobPostUseCase).handler
    }
    

    
}