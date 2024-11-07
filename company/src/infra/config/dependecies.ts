import {
  createUserUseCase,
  createCompanyUseCase,
  getCompanyUseCase,
  getMyCompanyUseCase,
  updateCompanyLogoUseCase,
  getCompanyByIdUseCase,
  updateProfileUseCase
} from "../../application/useCases";
import { userRepository, companyRepository } from "../repository/";
import { CompanyCreatedProducer } from '../messageBroker/kafka';
import { kafka } from './messageBroker'
import s3Operation from '@infra/externalService/aws-s3-service';

const repository = {
  userRepository,
  companyRepository
};

const messageBroker = {
   CompanyCreatedProducer,
   kafka
}

const service = {
  s3Operation,
}

const useCases = {
  createUserUseCase,
  createCompanyUseCase,
  getCompanyUseCase,
  getMyCompanyUseCase,
  updateCompanyLogoUseCase,
  getCompanyByIdUseCase,
  updateProfileUseCase,
};

export default {
  useCases,
  repository,
  messageBroker,
  service
};
    