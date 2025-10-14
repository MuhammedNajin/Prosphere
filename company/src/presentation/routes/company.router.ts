import express from "express";
import { resolve } from "@/di/index";
import { CompanyController } from "@/presentation/controller/company-controller";
import { 
  asyncHandler, 
  validateParams, 
  objectIdSchema 
} from "@muhammednajinnprosphere/common";
import { Controllers } from "@/di/symbols";
import { upload } from "@/presentation/middlewares/multer";

const router = express.Router();

const companyController = resolve<CompanyController>(Controllers.CompanyControllers);

// Company CRUD Operations
router
  .route("/")
  // .post(
  //   // POST /api/v1/companies - Create a new company
  //   asyncHandler(companyController.createCompany)
  // )
  // .get(
  //   // GET /api/v1/companies?page=1&limit=10&search=term - Get companies (for admin/listing)
  //   asyncHandler(companyController.getCompanies)
  // );

// Current User's Company Operations
// router.get(
//   "/me", 
//   // GET /api/v1/companies/me - Get current user's company
//   asyncHandler(companyController.getMyCompany)
// );

router.get(
  "/me/employees",
  // GET /api/v1/companies/me/employees - Get current company's employees
  asyncHandler(companyController.getEmployees)
);

// Specific Company Operations
router
  .route("/:id")
  .get(
    // GET /api/v1/companies/:id - Get company profile by ID
    validateParams(objectIdSchema),
    asyncHandler(companyController.getCompanyProfile)
  )
  .put(
    // PUT /api/v1/companies/:id - Update entire company profile
    validateParams(objectIdSchema),
    asyncHandler(companyController.updateCompanyProfile)
  );


// Company Logo Operations
router.put(
  "/:id/logo",
  // PUT /api/v1/companies/:id/logo - Upload/update company logo
  validateParams(objectIdSchema),
  upload.single("file"),
  asyncHandler(companyController.updateCompanyLogo)
);

// Company Verification Documents


// Company Employees Operations
router
  .route("/:id/employees")
  .get(
    // GET /api/v1/companies/:id/employees - Get company employees
    validateParams(objectIdSchema),
    asyncHandler(companyController.getEmployees)
  )
  .post(
    // POST /api/v1/companies/:id/employees - Add employee to company
    validateParams(objectIdSchema),
    asyncHandler(companyController.addEmployee)
  );

// Employee Operations (alternative RESTful approach)
router.put(
  "/:companyId/employees/:userId", 
  // PUT /api/v1/companies/:companyId/employees/:userId - Add specific user as employee
  validateParams(objectIdSchema),
  asyncHandler(companyController.addEmployee)
);

// File/Asset Operations
router.get(
  "/assets/:key",
  // GET /api/v1/companies/assets/:key - Get company asset/file by key
  asyncHandler(companyController.getFile)
);

router.post(
  "/assets/batch",
  // POST /api/v1/companies/assets/batch - Get multiple files by keys
  asyncHandler(companyController.getFiles)
);

export default router;