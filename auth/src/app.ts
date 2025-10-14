import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler, NotFoundError } from "@muhammednajinnprosphere/common";
import "reflect-metadata";
import { initializeDependencies } from "./di";

class AppBuilder {
  private app: express.Application;

  constructor() {
    console.log("Initializing application...");
    this.app = express();
  }

  async initialize(): Promise<express.Application> {
    try {
      this.validateEnvironment();
      await this.initializeDependencies();
      console.log("AppBuilder: Dependencies initialized successfully");
      this.setupCorsMiddleware();
      this.setupParsingMiddleware();
      this.setupLoggingMiddleware();
      await this.setupRoutes(); // Make sure this is awaited
      this.setupErrorHandling();
      return this.app;
    } catch (error) {
      console.error("Failed to initialize application:", error);
      throw error;
    }
  }

  private validateEnvironment(): void {
    // validateEnvironment();
  }

  private async initializeDependencies(): Promise<void> {
    console.log("AppBuilder: Initializing dependencies...");
    await initializeDependencies();
    console.log("AppBuilder: Dependencies initialized successfully");
  }

  private setupCorsMiddleware(): void {
    const allowedOrigins = this.getAllowedOrigins();
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) return callback(null, true);
          console.warn(`CORS blocked request from origin: ${origin}`);
          return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        exposedHeaders: ["X-Total-Count"],
        maxAge: 86400,
      })
    );
  }

  private setupParsingMiddleware(): void {
    this.app.use(cookieParser());
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  }

  private setupLoggingMiddleware(): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      console.log(
        `${req.method} ${req.url} - ${req.ip}, Body: ${JSON.stringify(
          req.body
        )}    - Headers: ${JSON.stringify(req.headers)}`
      );
      res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(
          `${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`
        );
      });
      next();
    });
  }

  private async setupRoutes(): Promise<void> {
    console.log("Setting up routes...");

    // Set up health check routes first
    this.app.get("/health", this.healthCheckHandler);
    this.app.get("/api/health", this.healthCheckHandler);

    try {
      // Dynamically import router to delay loading until dependencies are initialized
      console.log("Importing routes from @presentation/routes...");
      const { default: router } = await import("@presentation/routes");

      if (!router) {
        console.error("Router is undefined! Check @presentation/routes export");
        throw new Error("Failed to import router");
      }

      console.log("Router imported successfully, type:", typeof router);
      this.app.use("/api/v1", router);
      console.log("Routes set up successfully");

      // Log all registered routes for debugging
      this.logRegisteredRoutes();
    } catch (error) {
      console.error("Failed to import or setup routes:", error);
      throw error;
    }
  }

  private logRegisteredRoutes(): void {
    console.log("=== Registered Routes ===");
    this.app._router?.stack?.forEach((middleware: any) => {
      if (middleware.route) {
        // Routes registered directly on the app
        console.log(
          `${Object.keys(middleware.route.methods).join(", ").toUpperCase()} ${
            middleware.route.path
          }`
        );
      } else if (middleware.name === "router") {
        // Router middleware
        console.log("Router middleware found:", middleware.regexp.toString());
        if (middleware.handle?.stack) {
          middleware.handle.stack.forEach((handler: any) => {
            if (handler.route) {
              console.log(
                `  ${Object.keys(handler.route.methods)
                  .join(", ")
                  .toUpperCase()} ${middleware.regexp.source}${
                  handler.route.path
                }`
              );
            }
          });
        }
      }
    });
    console.log("========================");
  }

  private setupErrorHandling(): void {
    // 404 handler - this should be the last route handler
    this.app.use("*", (req: Request, res: Response, next: NextFunction) => {
      console.warn(`Route not found: ${req.method} ${req.originalUrl}`);
      console.warn(`Available routes have been logged above`);
      next(new NotFoundError("Route not found"));
    });

    // Global error handler
    this.app.use(errorHandler);

    // Process error handlers
    process.on("uncaughtException", (error: Error) => {
      console.error("Uncaught Exception:", error);
      this.gracefulShutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason: any) => {
      console.error("Unhandled Rejection:", reason);
      this.gracefulShutdown("unhandledRejection");
    });
  }

  private healthCheckHandler = (req: Request, res: Response): void => {
    const healthData = {
      status: "UP",
      timestamp: new Date().toISOString(),
      message: "Service is running successfully",
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
    };
    res.status(200).json(healthData);
  };

  private getAllowedOrigins(): string[] {
    const origins: string[] = [];
    console.log("DEV_FRONTEND_DOMAIN:", process.env.DEV_FRONTEND_DOMAIN);
    console.log("PROD_FRONTEND_DOMAIN:", process.env.PROD_FRONTEND_DOMAIN);

    if (process.env.DEV_FRONTEND_DOMAIN)
      origins.push(process.env.DEV_FRONTEND_DOMAIN);
    if (process.env.PROD_FRONTEND_DOMAIN)
      origins.push(process.env.PROD_FRONTEND_DOMAIN);

    if (process.env.NODE_ENV === "development") {
      origins.push(
        "http://localhost:1573",
        "http://localhost:6002",
        "http://127.0.0.1:3000",
        "http://localhost:5173"
      );
    }

    console.log("Allowed CORS origins:", origins);
    return origins;
  }

  private gracefulShutdown = (signal: string): void => {
    console.log(`Received ${signal}. Starting graceful shutdown...`);
    setTimeout(() => {
      console.error("Forcing shutdown after timeout");
      process.exit(1);
    }, 10000);
    process.exit(0);
  };
}

export const createApp = async (): Promise<express.Application> => {
  const appBuilder = new AppBuilder();
  return await appBuilder.initialize();
};

export { createApp as default };
