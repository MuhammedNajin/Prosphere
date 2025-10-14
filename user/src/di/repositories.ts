import { Container } from 'inversify';
import { UserRepository } from "@/infrastructure/database/mongo/repository/user.repository";
import { Repositories } from "./symbols";

export function bindRepositories(container: Container) {
    container.bind(Repositories.UserRepository).to(UserRepository).inSingletonScope();
}