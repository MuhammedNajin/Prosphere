import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { Services, UseCases } from "@/di/symbols";
import { ChangeCompanyStatusUseCase } from "@/application/usecases/admin/changeStatus.usecase";
import { GetCompaniesUseCase } from "@/application/usecases/admin/getCompanies.usecase";
import { GetCompanyByIdUseCase } from "@/application/usecases/company/getCompanyById.usecase";
import { CompanyStatus } from "@/shared/constance";
import { ResponseWrapper, ResponseMapper, HttpStatusCode, BadRequestError } from "@muhammednajinnprosphere/common";
import { ICompany, ICompanyVerificationDoc, IOwnerVerificationDoc } from "@/domain/interface/ICompany";
import { ILocationPoint } from "@/shared/types/shared-types";
import { GetUploadedFileUseCase } from "@/application/usecases/company/getUploadedFiles.usecase";

// Response DTOs
interface CompanyResponseDTO {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  locations?: ILocationPoint[];
  companyVerificationDoc?: ICompanyVerificationDoc;
  ownerVerificationDoc?: IOwnerVerificationDoc;
  size?: string;
  type?: string;
  owner: string;
  verified: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CompanyListResponseDTO {
  companies: CompanyResponseDTO[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface VerificationDocResponseDTO {
  url: string;
}

@injectable()
export class AdminController {
  private companyMapper: ResponseMapper<ICompany, CompanyResponseDTO>;
  private companyListMapper: ResponseMapper<any, CompanyListResponseDTO>;
  private verificationDocMapper: ResponseMapper<any, VerificationDocResponseDTO>;

  constructor(
    @inject(UseCases.ChangeCompanyStatusUseCase) 
    private changeCompanyStatusUseCase: ChangeCompanyStatusUseCase,

    @inject(UseCases.GetCompaniesUseCase) 
    private getCompaniesUseCase: GetCompaniesUseCase,

    @inject(UseCases.GetCompanyByIdUseCase) 
    private getCompanyByIdUseCase: GetCompanyByIdUseCase,

    @inject(UseCases.GetUploadedFileUseCase) 
    private getUploadedFilesUseCase: GetUploadedFileUseCase,
  ) {
    this.companyMapper = new ResponseMapper<ICompany, CompanyResponseDTO>({
      fields: {
        id: 'id',
        name: 'name',
        logo: 'logo',
        website: 'website',
        locations: 'locations',
        companyVerificationDoc: 'companyVerificationDoc',
        ownerVerificationDoc: 'ownerVerificationDoc',
        size: 'size',
        type: 'type',
        owner: 'owner',
        verified: 'verified',
        status: 'status',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
    });

    this.companyListMapper = new ResponseMapper<any, CompanyListResponseDTO>({
      fields: {
        companies: (entity: any) => entity.companies || entity.data || [],
        pagination: (entity: any) => ({
          currentPage: entity.currentPage || entity.page || 1,
          totalPages: entity.totalPages || Math.ceil((entity.totalCount || entity.total || 0) / (entity.limit || 10)),
          totalCount: entity.totalCount || entity.total || 0,
          hasNext: entity.hasNext || false,
          hasPrev: entity.hasPrev || false
        })
      }
    });

    this.verificationDocMapper = new ResponseMapper<any, VerificationDocResponseDTO>({
      fields: {
        url: 'url'
      }
    });
  }

  /**
   * Change Company Status
   */
  changeCompanyStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { id } = req.params;
    const { status } = req.query;

    const updatedCompany = await this.changeCompanyStatusUseCase.execute(
      id, 
      status as CompanyStatus
    );

    const response = this.companyMapper.toResponse(updatedCompany!);

    wrapper
      .status(HttpStatusCode.OK)
      .success(
        response,
        `Company status changed to ${status}`
      );
  };

  /**
   * Get All Companies (with pagination)
   */
  getCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { page = 1, limit = 10, status, search } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const companiesResult = await this.getCompaniesUseCase.execute({
      page: pageNum,
      limit: limitNum,
      skip,
      status: status as string,
      search: search as string
    });

    const mappedCompanies = this.companyMapper.toResponseList(companiesResult.companies);

    const response = {
      companies: mappedCompanies,
      pagination: companiesResult.pagination,
      filters: {
        availableStatuses: [CompanyStatus.PENDING, CompanyStatus.UNDER_REVIEW, CompanyStatus.SUSPENDED, CompanyStatus.ACTIVE, CompanyStatus.REJECTED, CompanyStatus.VERIFIED]
      }
    };

    wrapper.status(HttpStatusCode.OK).success(response, "Companies retrieved successfully.");
  };

  /**
   * Get Company By ID
   */
  getCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { id } = req.params;

    const company = await this.getCompanyByIdUseCase.execute(id);
   
   const response = this.companyMapper.toResponse(company);
    wrapper
      .status(HttpStatusCode.OK)
      .success(response, "Company retrieved successfully.");
  };

  /**
   * Get Verification Documents
   */
  getVerificationDocs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { key } = req.params;

    console.log("Requested key!!!!!!!!!!!!!:", key);

    const url = await this.getUploadedFilesUseCase.execute(key)

    if (!url) {
      throw new BadRequestError(`Verification document with key '${key}' not found.`);
    }

   const response = this.verificationDocMapper.toResponse({ url });
    wrapper
      .status(HttpStatusCode.OK)
      .success(response, "Verification document URL retrieved successfully.");
  };

  /**
   * Get Companies by Status
   */
  getCompaniesByStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const wrapper = new ResponseWrapper(res);
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!Object.values(CompanyStatus).includes(status as CompanyStatus)) {
      throw new BadRequestError("Invalid company status");
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const companiesResult = await this.getCompaniesUseCase.execute({
      page: pageNum,
      limit: limitNum,
      status: status as CompanyStatus
    });

    wrapper
      .status(HttpStatusCode.OK)
      .sendWithMapping(companiesResult, this.companyListMapper, `Companies with status '${status}' retrieved successfully.`);
  };

  /**
   * Get Company Statistics
   */
  getCompanyStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const wrapper = new ResponseWrapper(res);

    const allCompanies = await this.getCompaniesUseCase.execute({ 
      page: 1, 
      limit: 1000 
    });

    const companies = Array.isArray(allCompanies) ? allCompanies : allCompanies.companies || [];
    
    const stats = {
      total: companies.length,
      verified: companies.filter(c => c.status === CompanyStatus.Verified).length,
      pending: companies.filter(c => c.status === CompanyStatus.Pending).length,
      rejected: companies.filter(c => c.status === CompanyStatus.Rejected).length,
      suspended: companies.filter(c => c.status === CompanyStatus.Suspended).length
    };

    wrapper.status(HttpStatusCode.OK).success(stats, "Company statistics retrieved successfully.");
  };
}
