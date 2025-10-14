export const Repositories = {
    UserRepository: Symbol.for("UserRepository"),
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
    CloudStorageService: Symbol.for('CloudStorageService'),
    ImageService: Symbol.for('ImageService'),
  };
  
  export const UseCases = {
    // User Profile UseCases
    CreateUserUseCase: Symbol.for("CreateUserUseCase"),
    GetProfileUseCase: Symbol.for("GetProfileUseCase"),
    UpdateProfileUseCase: Symbol.for("UpdateProfileUseCase"),
    AboutUseCase: Symbol.for("AboutUseCase"),
    SearchUserUseCase: Symbol.for("SearchUserUseCase"),
    
    // File Upload UseCases
    UploadProfilePhotoUseCase: Symbol.for("UploadProfilePhotoUseCase"),
    UploadResumeUseCase: Symbol.for("UploadResumeUseCase"),
    GetUploadedFileUseCase: Symbol.for("GetUploadedFileUseCase"),
    DeleteFileUseCase: Symbol.for("DeleteFileUseCase"),
    DeleteResumeUseCase: Symbol.for("DeleteResumeUseCase"),
  };
  
  
  export const MessageBrokers = {
    UserUpdateProducer: Symbol.for("UserUpdateProducer"),
    UserCreatedConsumer: Symbol.for("UserCreatedConsumer"),
  };
  
  
  export const Controllers = {
    UserControllers: Symbol.for("UserControllers"),
  };
  
  
  
  