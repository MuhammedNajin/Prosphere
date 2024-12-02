import Server from "@/infrastructure/server";


async function main() {
  const server = Server.getInstance();
//   await messageBroker.connect();
  await server.start();
//   SocketManager.getInstance(server.httpServer);
}

main().catch(error => {
  console.error('Application failed to start:', error);
  process.exit(1);
});