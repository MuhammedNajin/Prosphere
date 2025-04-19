import "reflect-metadata"
import Server from '@infrastructure/server';
import { messageBroker } from "./infrastructure/messageBroker/kafka/connection";
import { GrpcServer } from "./infrastructure/rpc/grpc/grpc.server";
async function main() {
  
  const server = Server.getInstance();
  await messageBroker.connect()
  await server.start();
  const grpc = GrpcServer.getInstance();
  grpc.start();
}

main().catch(error => {
  console.error('Application failed to start:', error);
  process.exit(1);
});