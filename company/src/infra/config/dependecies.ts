import {
  createUserUseCase,
  createCompanyUseCase,
  getCompanyUseCase,
  getMyCompanyUseCase
} from "../../application/useCases";
import { userRepository, companyRepository } from "../repository/";

import { CompanyCreatedProducer } from '../messageBroker/kafka';
import { kafka } from './messageBroker'

const repository = {
  userRepository,
  companyRepository
};

const messageBroker = {
   CompanyCreatedProducer,
   kafka
}

const useCases = {
  createUserUseCase,
  createCompanyUseCase,
  getCompanyUseCase,
  getMyCompanyUseCase
};

export default {
  useCases,
  repository,
  messageBroker,
};
    