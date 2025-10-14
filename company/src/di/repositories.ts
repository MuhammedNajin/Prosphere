import { Container } from "inversify";
import { UserRepository } from "@infrastructure/database/mongo/repository/userRepository";
import { CompanyRepository } from "@infrastructure/database/mongo/repository/companyRepository";
import { Repositories } from "./symbols";

export function bindRepositories(container: Container) {
  container
    .bind(Repositories.UserRepository)
    .to(UserRepository)
    .inSingletonScope();
  container
    .bind(Repositories.CompanyRepository)
    .to(CompanyRepository)
    .inSingletonScope();
}
