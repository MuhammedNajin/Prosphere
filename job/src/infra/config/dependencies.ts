import {
  JobRepository,
  CompanyRepository,
  UserRepository,
  ApplicationRepository,
  subscriptionRepository
} from "@infra/repository";

import {
  JobPostUseCase,
  CompanyCreationUseCase,
  UserCreationUseCase,
  GetJobsUseCase,
  ApplicationCreationUseCase,
  GetAllApplicationUseCase,
  ChangeApplicationStatusUseCaseUseCase,
  GetApplicationUseCase,
  UpdateJobUseCase,
  AddCommentUseCase,
  LikeJobUseCase,
  GetCommentUseCase,
  GetJobDetailsUseCase,
  IsAppliedUseCase,
  GetAllJobByCompanyIdUseCase,
  GetApplicationByJobIdUseCase,
  JobSeenUseCase,
  GetJobSeenUseCase,
  UpdateFreeTrailUseCase
} from"@application/usecase";
import { GetMyApplicationUseCase } from "@/application/usecase/application/getMyApplication.usecase";
import { GetJobMetrixUseCase } from "@/application/usecase/company/getJobMetrix.usecase";
import { NotificationProducer } from "../messageBroker/kafka/producer/notificationProducer";
import { MessageBrokerConnection } from "./messageBroker";
import { SubscriptionCheckUseCase } from "@/application/usecase/company/checkSubscription.usecase";
import { UpdateTrailProducer } from "../messageBroker/kafka/producer/updateTrailProducer";
import { JobStatsUseCase } from "@/application/usecase/admin/jobStats.usecase";


export class Dependency {
  private jobRepository: JobRepository;
  private companyRepository: CompanyRepository;
  private userRepository: UserRepository;
  private applicationRepository: ApplicationRepository;
  private subscriptionRepository = subscriptionRepository;


  constructor() {
    this.jobRepository = new JobRepository();
    this.companyRepository = new CompanyRepository();
    this.userRepository = new UserRepository();
    this.applicationRepository = new ApplicationRepository();
  }

  get messageBroker() {
     return {
       notificationProducer: new NotificationProducer (MessageBrokerConnection.kafka.producer),
       updateTrailProducer: new UpdateTrailProducer(MessageBrokerConnection.kafka.producer)
     }
  }

  get useCase() {
    const jobUseCase = {
      jobPostUseCase: new JobPostUseCase(this.jobRepository),
      getJobsUseCase: new GetJobsUseCase(this.jobRepository),
      updateJobUseCase: new UpdateJobUseCase(this.jobRepository),
      addCommentUseCase: new AddCommentUseCase(this.jobRepository),
      likeJobUseCase: new LikeJobUseCase(this.jobRepository),
      getCommentUseCase: new GetCommentUseCase(this.jobRepository),
      getJobDetailsUseCase: new GetJobDetailsUseCase(this.jobRepository),
      jobSeenUseCase: new JobSeenUseCase(this.jobRepository),
    };

    const companyUseCases = {
      companyCreationUseCase: new CompanyCreationUseCase(this.companyRepository),
      getAllJobByCompanyIdUseCase: new GetAllJobByCompanyIdUseCase(this.companyRepository),
      getApplicationByJobIdUseCase: new GetApplicationByJobIdUseCase(this.companyRepository),
      getJobMetrixUseCase: new GetJobMetrixUseCase(this.companyRepository),
      getJobSeenUseCase: new GetJobSeenUseCase(this.companyRepository),
      subscriptionCheckUseCase: new SubscriptionCheckUseCase(this.subscriptionRepository),
      updateFreeTrailUseCase: new UpdateFreeTrailUseCase(this.subscriptionRepository)
    };

    const userUseCases = {
      userCreationUseCase: new UserCreationUseCase(this.userRepository),
    };

    const applicationUseCase = {
      createApplicationUseCase: new ApplicationCreationUseCase(this.applicationRepository),
      getAllApplicationUseCase: new GetAllApplicationUseCase(this.applicationRepository),
      changeApplicationStatusUseCase: new ChangeApplicationStatusUseCaseUseCase(this.applicationRepository),
      getApplicationUseCase: new GetApplicationUseCase(this.applicationRepository),
      getMyApplicationUseCase:  new GetMyApplicationUseCase(this.applicationRepository),
      isAppliedUseCase: new IsAppliedUseCase(this.applicationRepository),
    
    };

    const adminUseCase = {
      jobStatsUseCase: new JobStatsUseCase(this.jobRepository)
      
    }
    
    return {
      jobUseCase,
      userUseCases,
      companyUseCases,
      applicationUseCase,
      adminUseCase
    };
  }
}
