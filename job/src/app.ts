import express from "express";
import { AppRoutes } from "@presentation/handlers/routes";
import cors from "cors";
import { errorHandler } from "@muhammednajinnprosphere/common";
import cookieParser from "cookie-parser";
class App {
  private readonly app: express.Application;
  private readonly dependencies;

  constructor(dependencies: any) {
    this.dependencies = dependencies;
    this.app = express();
    this.config();
    this.registerRoutes();
    this.startServer();
  }

  private config() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cookieParser());
    const dev_domain = process.env.DEV_FRONTEND_DOMAIN;
    const prod_domain = process.env.PROD_FRONTEND_DOMAIN;
    this.app.use(
      cors({
        origin: [dev_domain!, prod_domain!],
        credentials: true,
      })
    );

    this.app.use((req, res, next) => {
      console.log(req.url, req.method, req.body);
      next();
    });
  }

  private registerRoutes(): void {
    this.app.get("/health", (req, res) => {
      res.status(200).json({
        status: "UP",
        timestamp: new Date().toISOString(),
        message: "Service is running successfully",
      });
    });

    const appRoute = new AppRoutes(this.dependencies);
    this.app.use("/api/v1/", appRoute.routes);

    this.app.use(errorHandler);
  }

  private startServer(): void {
    const PORT: number = 5000;
    this.app.listen(process.env.PORT || PORT, () => {
      console.log(`Job service is running at ${PORT}`);
    });
  }
}

export { App };
