import { KafkaClient } from "@muhammednajinnprosphere/common";
import { UserCreatedConsumer } from "@infra/messageBroker/kafka/consumer/user-created-listener";

const kafka = new KafkaClient();

const messageBrokerConnect = async (depedencies: any) => {
  const KAFKA_BROKER = process.env.MESSAGE_BROKERS || "localhost:29092";
  const KAFKA_GROUP = process.env.KAFKA_GROUP || "Profile-service-group";
  const KAFKA_CLIENT = process.env.USER_CLIENT_ID || "Profile-service";
  
  console.log("Connecting to message broker", );

  await kafka.connect(
    KAFKA_CLIENT,
    [KAFKA_BROKER],
    KAFKA_GROUP
  );

  new UserCreatedConsumer(kafka.consumer, depedencies).listen();
};

export { messageBrokerConnect, kafka };
