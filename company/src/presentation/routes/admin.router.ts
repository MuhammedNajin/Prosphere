import express from "express";
import { resolve } from "@/di/index";
import { AdminController } from "@/presentation/controller/admin-controller";
import { 
  asyncHandler, 
  validateParams, 
  validateQuery,
  objectIdSchema 
} from "@muhammednajinnprosphere/common";
import { Controllers } from "@/di/symbols";

const router = express.Router();

const adminController = resolve<AdminController>(Controllers.AdminControllers);

// Company Management for Admin
router.get(
  "/companies",
  // GET /api/v1/admin/companies?page=1&limit=10&status=pending&search=company
  asyncHandler(adminController.getCompanies)
);

router.get(
  "/companies/statistics",
  // GET /api/v1/admin/companies/statistics - Get company statistics
  asyncHandler(adminController.getCompanyStats)
);

// Companies by status (alternative filtering approach)
router.get(
  "/companies/status/:status",
  // GET /api/v1/admin/companies/status/pending - Get companies by status
  asyncHandler(adminController.getCompaniesByStatus)
);

// Specific Company Operations for Admin
router
  .route("/companies/:id")
  .get(
    // GET /api/v1/admin/companies/:id - Get company details for admin
    validateParams(objectIdSchema),
    asyncHandler(adminController.getCompany)
  );

// Company Status Management
router.patch(
  "/companies/:id/status",
  // PATCH /api/v1/admin/companies/:id/status?status=verified - Change company status
  validateParams(objectIdSchema),
  asyncHandler(adminController.changeCompanyStatus)
);

// Verification Documents Management
router.get(
  "/companies/docs/:key",
  // GET /api/v1/admin/companies/verification-docs/:key - Get verification document
  asyncHandler(adminController.getVerificationDocs)
);

// User Management (if needed in admin)
// router.get("/users", asyncHandler(adminController.getUsers));
// router.patch("/users/:id/status", asyncHandler(adminController.changeUserStatus));

export default router;