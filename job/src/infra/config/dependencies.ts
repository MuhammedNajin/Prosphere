import {
  JobRepository,
  CompanyRepository,
  UserRepository,
  ApplicationRepository,
} from "@infra/repository";
import {
  JobPostUseCase,
  CompanyCreationUseCase,
  UserCreationUseCase,
  GetJobsUseCase,
  ApplicationCreationUseCase,
  GetAllApplicationUseCase,
} from "@application/usecase";

export class Dependency {
  private jobRepository: JobRepository;
  private companyRepository: CompanyRepository;
  private userRepository: UserRepository;
  private applicationRepository: ApplicationRepository;
  
  constructor() {
    this.jobRepository = new JobRepository();
    this.companyRepository = new CompanyRepository();
    this.userRepository = new UserRepository();
    this.applicationRepository = new ApplicationRepository();
  }

  get useCase() {
    const jobUseCase = {
      jobPostUseCase: new JobPostUseCase(this.jobRepository),
      getJobsUseCase: new GetJobsUseCase(this.jobRepository),
    };

    const companyUseCases = {
      companyCreationUseCase: new CompanyCreationUseCase(
        this.companyRepository
      ),
    };

    const userUseCases = {
      userCreationUseCase: new UserCreationUseCase(this.userRepository),
    };

    const applicationUseCase = {
      createApplicationUseCase: new ApplicationCreationUseCase(this.applicationRepository),
      getAllApplicationUseCase: new GetAllApplicationUseCase(this.applicationRepository)
    };
    
    return {
      jobUseCase,
      userUseCases,
      companyUseCases,
      applicationUseCase,
    };
  }
}
