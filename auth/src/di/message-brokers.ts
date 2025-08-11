import { Container } from 'inversify';
import { UserCreatedProducer } from "@infrastructure/MessageBroker/kafka/producer/user-created-producer";
import { MessageBrokers } from "./symbols";

export async function bindMessageBroker(container: Container) {
    container.bind<UserCreatedProducer>(MessageBrokers.UserCreatedProducer).to(UserCreatedProducer).inSingletonScope();
}
