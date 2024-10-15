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
const service: Service = {
  transporter,

};

export default {
  useCases,
  repository,
  service,
  messageBroker
};
