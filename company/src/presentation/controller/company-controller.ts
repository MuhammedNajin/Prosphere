import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";

import { HttpStatusCode, BadRequestError, NotFoundError, ForbiddenError, ResponseMapper } from "@muhammednajinnprosphere/common";
import { ResponseWrapper } from "@muhammednajinnprosphere/common";
import { generateCompanyAccessToken } from "@/infrastructure/libs/token";
import { UseCases, Services } from "@/di/symbols";
import { AddEmployeeUseCase } from "@/application/usecases/company/addTeam.usecase";
import { CreateCompanyUseCase } from "@/application/usecases/company/createCompany.usecase";
import { GetCompanyByIdUseCase } from "@/application/usecases/company/getCompanyById.usecase";
import { GetCompanyByNameUseCase } from "@/application/usecases/company/getCompanyByname.usecase"; // Fixed import
import { GetMyCompanyUseCase } from "@/application/usecases/company/getMyComapany.usecase";
import { GetEmployeesUseCase } from "@/application/usecases/company/getEmployees.usecase";
import { UpdateCompanyLogoUseCase } from "@/application/usecases/company/updateCompanylogo.usecase";
import { UpdateProfileUseCase } from "@/application/usecases/company/UpdateProfile.usecase";
import { UploadCompanyVerificationDocsUseCase } from "@/application/usecases/company/uploadVerificationnDocs";
import { ErrorCode } from "@/shared/constance";
import { ICompany } from "@/domain/interface/ICompany";
import { UploadCompanyLogoUseCase } from "@/application/usecases/company/uploadCompanyLogo.usecase";
import { GetUploadedFileUseCase } from "@/application/usecases/company/getUploadedFiles.usecase";

interface VerificationDocument {
  documentType: string;
  documentUrl: string;
  uploadedAt: number;
}

// Response DTOs
interface CompanyResponseDTO {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  locations?: string;
  size?: string;
  type?: string;
  owner: string;
  verified: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EmployeeResponseDTO {
  id: string;
  userId: string;
  companyId: string;
  role: string;
  joinedAt: Date;
}

interface SubscriptionResponseDTO {
  isSubscribed: boolean;
  subscriptionStatus: string;
  subscriptionType: string;
  subscriptionPlan: string;
  trailLimit: number;
  usageLimit: number;
  isTrail: boolean;
  startDate: Date;
  endDate: Date;
}

interface FileResponseDTO {
  url: string;
}

interface LogoUpdateResponseDTO {
  logoUrl: string | null;
}

@injectable()
export class CompanyController {
  private companyMapper: ResponseMapper<ICompany, CompanyResponseDTO>;
  private employeeMapper: ResponseMapper<any, EmployeeResponseDTO>;
  private subscriptionMapper: ResponseMapper<any, SubscriptionResponseDTO>;
  private fileMapper: ResponseMapper<any, FileResponseDTO>;
  private logoUpdateMapper: ResponseMapper<any, LogoUpdateResponseDTO>;

  constructor(
    @inject(UseCases.AddEmployeeUseCase) private readonly addEmployeeUseCase: AddEmployeeUseCase,
    
    @inject(UseCases.GetCompanyByNameUseCase) private readonly getCompanyByNameUseCase: GetCompanyByNameUseCase,
    @inject(UseCases.GetCompanyByIdUseCase) private readonly getCompanyByIdUseCase: GetCompanyByIdUseCase,
    @inject(UseCases.GetEmployeesUseCase) private readonly getEmployeesUseCase: GetEmployeesUseCase,
    @inject(UseCases.UpdateCompanyLogoUseCase) private readonly updateCompanyLogoUseCase: UpdateCompanyLogoUseCase,
    @inject(UseCases.UpdateProfileUseCase) private readonly updateProfileUseCase: UpdateProfileUseCase,
    @inject(UseCases.UploadCompanyVerificationDocsUseCase) private readonly uploadCompanyVerificationDocsUseCase: UploadCompanyVerificationDocsUseCase,
    @inject(UseCases.GetUploadedFileUseCase) private getUploadedFilesUseCase: GetUploadedFileUseCase,
  ) {
    // Initialize Company Mapper
    this.companyMapper = new ResponseMapper<ICompany, CompanyResponseDTO>({
      fields: {
        id: 'id',
        name: 'name',
        website: 'website',
        locations: 'locations',
        size: 'size',
        type: 'type',
        owner: 'owner',
        logo: 'logo',
        verified: 'verified',
        status: 'status',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
    });

    // Initialize Employee Mapper
    this.employeeMapper = new ResponseMapper({
      fields: {
        id: 'id',
        userId: 'userId',
        companyId: 'companyId',
        role: 'role',
        joinedAt: 'joinedAt'
      }
    });

    // Initialize Subscription Mapper
    this.subscriptionMapper = new ResponseMapper({
      fields: {
        isSubscribed: 'isSubscribed',
        subscriptionStatus: 'status',
        subscriptionType: 'type',
        subscriptionPlan: 'plan',
        trailLimit: 'trailLimit',
        usageLimit: 'usageLimit',
        isTrail: (entity: any) => !entity.isSubscribed,
        startDate: (entity: any) => entity.startDate ?? new Date(),
        endDate: (entity: any) => entity.endDate ?? new Date()
      }
    });

    // Initialize File Mapper
    this.fileMapper = new ResponseMapper({
      fields: {
        url: 'url'
      }
    });

    // Initialize Logo Update Mapper
    this.logoUpdateMapper = new ResponseMapper({
      fields: {
        logoUrl: 'logoUrl'
      }
    });
  }

  addEmployee = async (req: Request, res: Response): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { id: companyId } = req.params;
    const { userId } = req.body;
    
    if (!companyId || !userId) {
      throw new BadRequestError("Company ID and user ID are required.");
    }

    const employee = await this.addEmployeeUseCase.execute(companyId, userId);
    if (!employee) {
      throw new NotFoundError("Failed to add employee to company.");
    }

    wrapper
      .status(HttpStatusCode.CREATED)
      .success({ employee }, "Employee added successfully.");
  };


  getCompanyProfile = async (req: Request, res: Response): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { id } = req.params;

    
    
    if (!id) {
      throw new BadRequestError("Company ID is required.");
    }

    const company = await this.getCompanyByIdUseCase.execute(id);
    if (!company) {
      throw new NotFoundError(`Company with ID '${id}' not found.`);
    }
    
  
    wrapper
      .status(HttpStatusCode.OK)
      .success(company, "Company profile retrieved successfully.");
  };

  getEmployees = async (req: Request, res: Response): Promise<void> => {
    const wrapper = new ResponseWrapper(res);

    const companyId = req.params.id as string
    console.log("Company ID from params:", companyId);

    if (!companyId) {
      throw new BadRequestError("Company ID is required in headers or query.");
    }

    const employees  = await this.getEmployeesUseCase.execute(companyId);
    if (!employees) {
      throw new NotFoundError(`No employees found for company ID '${companyId}'.`);
    }

    wrapper
      .status(HttpStatusCode.OK)
      .success({ team: employees.team }, "Employees retrieved successfully.");
  };

  getFile = async (req: Request, res: Response): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { key } = req.params;
    
    if (!key) {
      throw new BadRequestError("File key is required.");
    }

    const url = await this.getUploadedFilesUseCase.execute(key);
    if (!url) {
      throw new NotFoundError(`File with key '${key}' not found in the bucket.`);
    }

    wrapper
      .status(HttpStatusCode.OK)
      .success({ url }, "File URL retrieved successfully.");
  };

  getFiles = async (req: Request, res: Response): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { keys } = req.body;
    
    if (!Array.isArray(keys)) {
      throw new BadRequestError("Keys must be an array.");
    }

    const urls = await Promise.all(
      keys.map(async (key: string) => {
        if (key) {
          const url = await this.getUploadedFilesUseCase.execute(key);
          return { url };
        }
        return { url: null };
      })
    );

    wrapper
      .status(HttpStatusCode.OK)
      .success({ urls }, "File URLs retrieved successfully.");
  };

  updateCompanyLogo = async (req: Request, res: Response): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { id } = req.params;
    const file = req.file;
  

    if(!file) {
      throw new BadRequestError("Logo file is required.");
    }

    const url = await this.updateCompanyLogoUseCase.execute({ id, file });
    
    wrapper
      .status(HttpStatusCode.CREATED)
      .success({ url }, `Logo updated successfully.`);
  };

  updateCompanyProfile = async (req: Request, res: Response): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { id } = req.params;
    const body = req.body;
    
    if (!id || !body || Object.keys(body).length === 0) {
      throw new BadRequestError("Company ID and update payload are required.");
    }

    const updatedProfile = await this.updateProfileUseCase.execute({ id, body });

    console.log("Updated company profile:", updatedProfile);

    
    
    wrapper
      .status(HttpStatusCode.OK)
      .success(updatedProfile, "Company profile updated successfully.");
  };

  uploadCompanyVerificationDocs = async (req: Request, res: Response): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { id } = req.params;
    const { companyDocType, ownerDocType } = req.body;
    const { companyDoc, ownerDoc } = req.files as { companyDoc: Express.Multer.File[]; ownerDoc: Express.Multer.File[] };

    if (!id || !companyDocType || !ownerDocType || !companyDoc?.length || !ownerDoc?.length) {
      throw new BadRequestError("Company ID, document types, and files are required.");
    }

    const generateUniqueKey = (originalName: string): string => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9.]/g, "-");
      return `${timestamp}-${random}-${sanitizedName}`;
    };

    const companyDocKey = generateUniqueKey(companyDoc[0].originalname);
    const ownerDocKey = generateUniqueKey(ownerDoc[0].originalname);

    await Promise.all([
      this.s3OperationService.uploadImageToBucket(
        companyDoc[0].buffer,
        companyDoc[0].mimetype,
        companyDocKey
      ),
      this.s3OperationService.uploadImageToBucket(
        ownerDoc[0].buffer,
        ownerDoc[0].mimetype,
        ownerDocKey
      ),
    ]);

    const verificationData = {
      id,
      companyDoc: {
        documentType: companyDocType,
        documentUrl: companyDocKey,
        uploadedAt: Date.now(),
      } as VerificationDocument,
      ownerDoc: {
        documentType: ownerDocType,
        documentUrl: ownerDocKey,
        uploadedAt: Date.now(),
      } as VerificationDocument,
    };

    const updatedProfile = await this.uploadCompanyVerificationDocsUseCase.execute(verificationData);

    wrapper
      .status(HttpStatusCode.OK)
      .sendWithMapping(updatedProfile, this.companyMapper, "Company verification documents uploaded successfully.");
  };
}