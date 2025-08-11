import { app } from './app';
import 'reflect-metadata';
import { initConfig, cleanupConnections, getConnectionStatus } from '@/config/initConfig';
import 'dotenv/config';
import { createServer } from 'http';
import { SocketManager } from './infrastructure/socket';
import { initializeDependencies } from './di';

(async function start() {
  try {
   console.log("starting auth service...");
    // await initializeDependencies();

    await initConfig({
      enableDatabase: true,
      enableRedis: true,
      enableKafka: true,
      timeout: 30000,
    });

    // Bind InversifyJS dependencies after connections are established
    

    const connectionStatus = getConnectionStatus();
    console.log('📊 Connection Status:', connectionStatus);

    const httpServer = createServer(app);
    SocketManager.getInstance(httpServer);

    const PORT = process.env.PORT || 7000;
    httpServer.listen(PORT, () => {
      console.log(`Auth service is running on port ${PORT}`);
      console.log(`Server started at: ${new Date().toISOString()}`);
    });

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
    process.on('uncaughtException', async (error) => {
      console.error('Uncaught Exception:', error);
      await gracefulShutdown();
    });
    process.on('unhandledRejection', async (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      await gracefulShutdown();
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
})();

async function gracefulShutdown() {
  try {
    console.log('Starting graceful shutdown process...');
    await cleanupConnections();
    console.log('Graceful shutdown completed. Exiting process.');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}