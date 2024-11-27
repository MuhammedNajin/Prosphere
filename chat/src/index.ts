import Server from '@infra/server/index';
import { messageBroker } from './infra/MessageBroker/Kafka/config';
import { SocketManager  } from './infra/socket';


async function main() {
  const server = Server.getInstance();
  await messageBroker.connect();
  await server.start();
  SocketManager.getInstance(server.httpServer);
}

main().catch(error => {
  console.error('Application failed to start:', error);
  process.exit(1);
});