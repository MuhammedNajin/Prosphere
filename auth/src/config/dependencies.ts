import { userRepository, otpRepository } from "../app/repository";

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
  googleAuthUseCase
} from "../usecase";
import { Repository, Service, UseCases } from "../libs/entities/interfaces";
import { transporter } from "../app/Service";

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
  googleAuthUseCase
};
console.log(useCases);
const repository: Repository = {
  userRepository,
  otpRepository,
};
const service: Service = {
  transporter,
};

export default {
  useCases,
  repository,
  service,
};
