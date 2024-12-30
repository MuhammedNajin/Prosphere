import { KafkaProducer, UserCreatedEvent, KafkaClient } from '@muhammednajinnprosphere/common'
import { UserCreatedProducer } from '@infra/MessageBroker/kafka/producer/user-created-producer'

export interface Dependencies {
  useCases: UseCases;
  repository: any;
  service: Service;
  messageBroker: Producer;
  rpc: any
}

export interface Producer {
   UserCreatedProducer: typeof UserCreatedProducer
   kafka: KafkaClient
}
export interface UseCases {
  signupUseCase: any;
  loginUseCase: any;
  getUserUseCase: any;
  sentMailUseCase: any;
  verifyOtpUseCase: any;
  verifyUserUseCase: any;
  forgetPasswordUseCase: any;
  resetPasswordUseCase: any;
  adminUseCase: any
  getUsersUseCase: any
  blockUserUseCase: any
  googleAuthUseCase: any
  googleAuthFlowUseCase: any;
}

export interface Repository {
  userRepository: any;
  otpRepository: any;
  redisRepository: any;
}

export interface Service {
  transporter: any;
 
}

export interface IUser {
  username: string;
  email: string;
  phone: string;
  password: string;
  jobRole: string;
}


export interface TokenData {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface IOtp {
  email: string;
  otp: string;
}

export interface Mail {
  from: string;
  to: string;
  subject: string;
  html: unknown;
}
