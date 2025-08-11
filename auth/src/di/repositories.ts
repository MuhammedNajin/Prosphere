import { Container } from 'inversify';
import { UserRepository } from "@/infrastructure/database/mongo/repository/authRepository";
import { Repositories } from "./symbols";

export function bindRepositories(container: Container) {
    container.bind(Repositories.UserRepository).to(UserRepository).inSingletonScope();
}