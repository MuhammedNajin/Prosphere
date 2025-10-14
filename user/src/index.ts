import { createApp } from './app';
import 'reflect-metadata';
import { initConfig } from '@/config/initConfig';
import 'dotenv/config';
import { createServer } from 'http';
import container from './di/container';
import { UserCreatedConsumer } from './infrastructure/messageBroker/kafka/consumer/user-created.consumer';
import { MessageBrokers } from './di/symbols';


(async function start() {
  try {
    console.log("starting user service...");

     
    const connectionStatus = initConfig.getConnectionStatus();
    console.log('📊 Connection Status:', connectionStatus);
    
    const app = await createApp();
    const httpServer = createServer(app);
    // SocketManager.getInstance(httpServer); // Uncomment if you have socket support
    
    const PORT = process.env.PORT || process.env.port || 3003;
    httpServer.listen(PORT, () => {
      console.log(`User service is running on port ${PORT}`);
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
    await initConfig.cleanup();
    console.log('Graceful shutdown completed. Exiting process.');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}