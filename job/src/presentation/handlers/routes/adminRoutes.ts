import { Router } from "express";
import { JobStatsController } from "../controller/admin/jobStats.controller";
import IAdminUseCase from "@/application/interface/adminUsecase_interface.ts";
import { Job } from "@/infra/database/mongo";


export class AdminRoutes {
    private jobStatsController: JobStatsController;
    constructor(private adminUseCase: IAdminUseCase) {
        console.log("adminUseCase ******************", this.adminUseCase);
        
      const { jobStatsUseCase } = this.adminUseCase
      this.jobStatsController = new JobStatsController(jobStatsUseCase)
    }

    get router() {
        const router = Router();
        router.get('/job-stats', this.jobStatsController.handler)
        return router;
    }
}