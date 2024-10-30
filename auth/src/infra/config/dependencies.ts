import { userRepository, otpRepository } from "@infra/repository";


import {
  signupUseCase,
  loginUseCase,
  getUserUseCase,
  sentMailUseCase,
  verifyOtpUseCase,
  verifyUserUseCase,
  forgetPasswordUseCase,
  resetPasswordUseCase,
  adminUseCase,
  getUsersUseCase,
  blockUserUseCase,
  googleAuthUseCase,
  googleAuthFlowUseCase
} from "@application/usecase";
import { Repository, Service, UseCases } from "@domain/entities/interfaces";
import { transporter } from "@infra/Service";
import { UserCreatedProducer } from "@infra/MessageBroker/kafka/producer/user-created-producer";
import { kafka } from "./kafka";
import { GrpcClient } from '@infra/rpc/grpc/authGrpcClient'
const useCases: UseCases = {
  signupUseCase,
  loginUseCase,
  getUserUseCase,
  sentMailUseCase,
  verifyOtpUseCase,
  verifyUserUseCase,
  forgetPasswordUseCase,
  resetPasswordUseCase,
  adminUseCase,
  getUsersUseCase,
  blockUserUseCase,
  googleAuthUseCase,
  googleAuthFlowUseCase
};
console.log(useCases);
const repository: Repository = {
  userRepository,
  otpRepository,
};

const messageBroker = {
  UserCreatedProducer,
  kafka

}

const rpc = {
   grpcClient: new GrpcClient(),
}

const service: Service = {
  transporter,

};

export default {
  useCases,
  repository,
  service,
  messageBroker,
  rpc
};
