import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'
import AppRouter from '@/presentation/router';
import { connectDB } from '@infrastructure/database/sql/connection'
import planRepository from '../repository/plan.repository';
import paymentRepository from '../repository/payment.repository';
import subscriptionRepository from '../repository/subscription.repository';
import companyRepository from '../repository/company.repository';
import { messageBroker } from '../messageBroker/kafka/connection';

dotenv.config();

class Server {
  private static instance: Server;
  public app: express.Application;
  public httpServer: http.Server;
  private port: number;

  private constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3005');
    this.httpServer = http.createServer(this.app);
    
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  public async start(): Promise<void> {
    try {
    
      await connectDB();

      this.configureMiddleware();

      this.httpServer.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      console.error('Server startup failed:', error);
      process.exit(1);
    }
  }

  private configureMiddleware(): void {
   

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use((req, res, next) => {
       console.log("request", req.url, req.method);
       next();
    })

    this.app.use(cors({
      origin: ["http://localhost:5173"],
      credentials: true
  }))

    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
      });
    });

    const router = new AppRouter(subscriptionRepository, planRepository, paymentRepository, companyRepository, messageBroker.getMessageProducers()).router;


    // this.app.use(logger);
    this.app.use('/api/v1', router);
  }

  public async shutdown(): Promise<void> {
    console.log('Shutting down server...');
    
    await new Promise<void>((resolve) => {
      this.httpServer.close(() => {
        console.log('HTTP server closed');
        resolve();
      });
    });

    process.exit(0);
  }
}

process.on('SIGTERM', async () => {
  const server = Server.getInstance();
  await server.shutdown();
});

process.on('SIGINT', async () => {
  const server = Server.getInstance();
  await server.shutdown();
});

export default Server;