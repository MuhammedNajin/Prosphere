export const Repositories = {
  UserRepository: Symbol.for("UserRepository"),
};


export const GrpcServices = {
  AuthGrpcService: Symbol.for('AuthGrpcService'),
};

export const Services = {
  TokenService: Symbol.for('TokenService'),
  MailService: Symbol.for('MailService'),
  HashService: Symbol.for('HashService'),
  OtpService: Symbol.for('OtpService'),
  CloudStorageService: Symbol.for('CloudStorageService'),
  CacheService: Symbol.for('CacheService'),
  RedisClient: Symbol.for('RedisClient'),
};

export const UseCases = {
  SignupUseCase: Symbol.for("SignupUseCase"),
  SigninUseCase: Symbol.for("SigninUseCase"),
  ResetPasswordUseCase: Symbol.for("ResetPasswordUseCase"),
  VerifyOtpUseCase: Symbol.for("VerifyOtpUseCase"),
  GoogleAuthUseCase: Symbol.for("GoogleAuthUseCase"),
  GoogleAuthFlowUseCase: Symbol.for("GoogleAuthFlowUseCase"),
  ForgetPasswordUseCase: Symbol.for("ForgetPasswordUseCase"),
  ChangePasswordUseCase: Symbol.for("ChangePasswordUseCase"),
  RefreshTokenUseCase: Symbol.for("RefreshTokenUseCase"),
  AdminRefreshTokenUseCase: Symbol.for("AdminRefreshTokenUseCase"),
  AdminLoginUseCase: Symbol.for("AdminLoginUseCase"),
  BlockUserUseCase: Symbol.for("BlockUserUseCase"),
  GetUsersUseCase: Symbol.for("GetUsersUseCase"),
};


export const MessageBrokers = {
  UserCreatedProducer: Symbol.for("UserCreatedProducer"),
};


export const Controllers = {
  AuthControllers: Symbol.for("AuthControllers"),
  AdminControllers: Symbol.for("AdminControllers"),
};



