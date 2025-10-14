import { Container } from 'inversify';
import { MessageBrokers } from "./symbols";
import { CompanyCreatedProducer, UserCreatedConsumer } from '@/infrastructure/message-broker/kafka';

export async function bindMessageBroker(container: Container) {
    container.bind<UserCreatedConsumer>(MessageBrokers.UserCreatedConsumer).to(UserCreatedConsumer);
    container.bind<CompanyCreatedProducer>(MessageBrokers.CompanyCreatedProducer).to(CompanyCreatedProducer);
}
