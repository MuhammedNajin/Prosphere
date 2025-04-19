import Server from "@/infrastructure/server";
import { NotificationSocketManager } from "@infrastructure/socket";
import { messageBroker } from "./infrastructure/messageBroker/kafka/config";


async function main() {
  const server = Server.getInstance();
  await messageBroker.connect();
  await server.start();
  NotificationSocketManager.getInstance(server.httpServer);
}

main().catch(error => {
  console.error('Application failed to start:', error);
  process.exit(1);
});