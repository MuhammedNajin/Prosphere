import { JobRepository, CompanyRepository, UserRepository } from '@infra/repository';
import { JobPostUseCase, CompanyCreationUseCase, UserCreationUseCase  } from '@application/usecase';


export class Dependency {
    private jobRepository: JobRepository;
    private companyRepository: CompanyRepository;
    private userRepository: UserRepository;
    constructor() {
        this.jobRepository = new JobRepository();
        this.companyRepository = new CompanyRepository();
        this.userRepository = new UserRepository();
    }
   

    get useCase() {

        const jobUseCase = {
            jobPostUseCase: new JobPostUseCase(this.jobRepository),
            companyCreationUseCase: new CompanyCreationUseCase(this.companyRepository),
            userCreationUseCase: new UserCreationUseCase(this.userRepository)
        }
       
        return {
            jobUseCase,
        }
    }
}