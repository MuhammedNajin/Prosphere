import { Container } from 'inversify';
import { MessageBrokers } from "./symbols";
import { UserUpdateProducer } from '@/infrastructure/messageBroker/kafka/producer/profile-update-producer';
import { UserCreatedConsumer } from '@/infrastructure/messageBroker/kafka/consumer/user-created.consumer';
import { consumers } from 'nodemailer/lib/xoauth2';

export async function bindMessageBroker(container: Container) {
    container.bind<UserUpdateProducer>(MessageBrokers.UserUpdateProducer).to(UserUpdateProducer).inSingletonScope();
    container.bind<UserCreatedConsumer>(MessageBrokers.UserCreatedConsumer).to(UserCreatedConsumer);
}
