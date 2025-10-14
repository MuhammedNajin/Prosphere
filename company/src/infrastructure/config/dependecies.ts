import {
  createUserUseCase,
  createCompanyUseCase,
  getCompanyUseCase,
  getMyCompanyUseCase,
  updateCompanyLogoUseCase,
  getCompanyByIdUseCase,
  updateProfileUseCase,
  uploadCompanyVerificationDocsUseCase,
  getCompaniesUseCase,
  changeCompanyStatusUseCase,
  searchUserUseCase,
  addEmployeeUseCase,
  getEmployeesUseCase,
  subscriptionCheckUseCase
} from "../../application/usecases";

import { userRepository, companyRepository, subscriptionRepository } from "../repository";
import { CompanyCreatedProducer, CompanyUpdateProducer } from '../message-broker/kafka';
import { kafka } from './messageBroker'
import s3Operation from '@/infrastructure/externalService/aws-s3-service';
import { GrpcClient } from "../rpc/grpc/grpc.client";


const repository = {
  userRepository,
  companyRepository,
  subscriptionRepository
};

const messageBroker = {
   CompanyCreatedProducer,
   CompanyUpdateProducer,
   kafka
}


const service = {
  s3Operation,
  grpcClient: GrpcClient.getInstance()
}

const useCases = {
  createUserUseCase,
  createCompanyUseCase,
  getCompanyUseCase,
  getMyCompanyUseCase,
  updateCompanyLogoUseCase,
  getCompanyByIdUseCase,
  updateProfileUseCase,
  uploadCompanyVerificationDocsUseCase,
  getCompaniesUseCase,
  changeCompanyStatusUseCase,
  searchUserUseCase,
  addEmployeeUseCase,
  getEmployeesUseCase,
  subscriptionCheckUseCase
};

export default {
  useCases,
  repository,
  messageBroker,
  service
};
    