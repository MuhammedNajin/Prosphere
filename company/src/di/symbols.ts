export const Repositories = {
    UserRepository: Symbol.for("UserRepository"),
    CompanyRepository: Symbol.for("CompanyRepository"),
  };
  
  export const Connections = {
   RedisClient: Symbol.for('RedisClient'),
   DatabaseConnection: Symbol.for('DatabaseConnection'),
   KafkaConnection: Symbol.for('KafkaConnection'),
}
  
  export const GrpcServices = {
    AuthGrpcService: Symbol.for('AuthGrpcService'),
  };
  
  export const Services = {
    TokenService: Symbol.for('TokenService'),
    MailService: Symbol.for('MailService'),
    HashService: Symbol.for('HashService'),
    CloudStorageService: Symbol.for('CloudStorageService'),
    CacheService: Symbol.for('CacheService'),
    RedisClient: Symbol.for('RedisClient'),
  };
  
  export const UseCases = {
  CreateCompanyUseCase: Symbol.for("CreateCompanyUseCase"),
  GetCompanyByIdUseCase: Symbol.for("GetCompanyByIdUseCase"),
  GetCompanyByNameUseCase: Symbol.for("GetCompanyByNameUseCase"),
  GetMyCompanyUseCase: Symbol.for("GetMyCompanyUseCase"),
  UpdateProfileUseCase: Symbol.for("UpdateProfileUseCase"),
  UpdateCompanyLogoUseCase: Symbol.for("UpdateCompanyLogoUseCase"),
  UploadCompanyVerificationDocsUseCase: Symbol.for("UploadCompanyVerificationDocsUseCase"),
  AddEmployeeUseCase: Symbol.for("AddEmployeeUseCase"),
  GetEmployeesUseCase: Symbol.for("GetEmployeesUseCase"),
  SearchUserUseCase: Symbol.for("SearchUserUseCase"),
  ChangeCompanyStatusUseCase: Symbol.for("ChangeCompanyStatusUseCase"),
  GetCompaniesUseCase: Symbol.for("GetCompaniesUseCase"),
  GetCompanyUseCase: Symbol.for("GetCompanyUseCase"),
  CreateUserUseCase: Symbol.for("CreateUserUseCase"),
  GenerateCompanyAccessTokenUseCase: Symbol.for("GenerateCompanyAccessTokenUseCase"),
  GetUploadedFileUseCase: Symbol.for("GetUploadedFileUseCase"),
  UploadCompanyLogoUseCase: Symbol.for("UploadCompanyLogoUseCase"),
};

  
  export const MessageBrokers = {
    UserCreatedConsumer: Symbol.for("UserCreatedConsumer"),
    CompanyCreatedProducer: Symbol.for("CompanyCreatedProducer"),
  };
  
  
  export const Controllers = {
    UserControllers: Symbol.for("UserControllers"),
    AdminControllers: Symbol.for("AdminControllers"),
    CompanyControllers: Symbol.for("CompanyControllers"),
  };
  
  
  
  