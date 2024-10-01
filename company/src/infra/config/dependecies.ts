import {
  createUserUseCase,
  createCompanyUseCase,
  getCompanyUseCase,
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
};

export default {
  useCases,
  repository,
  messageBroker,
};
    