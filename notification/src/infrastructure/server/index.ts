import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import AppRouter from '@/presentation/routes';
import notificationRepository from '../repository/notification.repository';
import { NotFoundError } from '@muhammednajinnprosphere/common';
dotenv.config();

class Server {
  private static instance: Server;
  public app: express.Application;
  public httpServer: http.Server;
  private port: number;
  private routes;
  private constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '4000');
    this.httpServer = http.createServer(this.app);
     this.routes = new AppRouter(notificationRepository).router
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  public async start(): Promise<void> {
    try {
    
      await this.connectDatabase();

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

  private async connectDatabase(): Promise<void> {
    const MONGO_URL = process.env.MONGO_URL ;

    try {
      await mongoose.connect(`${MONGO_URL!}/NOTIFICATION-SERVICE`, {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        retryWrites: true
      });


      console.log('Connected to MongoDB successfully');

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('Lost MongoDB connection');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('Reconnected to MongoDB');
      });
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  private configureMiddleware(): void {
   
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use((req, res, next) => {
       console.log("request", req.url, req.method);
       next();
    })

    const dev_domain = process.env.DEV_FRONTEND_DOMAIN;
    const prod_domain = process.env.PROD_FRONTEND_DOMAIN;
    this.app.use(
      cors({
        origin:[ dev_domain!, prod_domain! ],
        credentials: true,
      })
    );

    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
      });
    });

    this.app.use('/api/v1', this.routes);

    this.app.use('*', () => {
       throw new NotFoundError()
    })

  }

  public async shutdown(): Promise<void> {
    console.log('Shutting down server...');
    
    await new Promise<void>((resolve) => {
      this.httpServer.close(() => {
        console.log('HTTP server closed');
        resolve();
      });
    });

    await mongoose.connection.close(false);
    console.log('MongoDB connection closed');
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