import "reflect-metadata"
import Server from '@infrastructure/server';
import { messageBroker } from "./infrastructure/messageBroker/kafka/connection";

async function main() {

  const server = Server.getInstance();
  await messageBroker.connect()
  await server.start();

}

main().catch(error => {
  console.error('Application failed to start:', error);
  process.exit(1);
});