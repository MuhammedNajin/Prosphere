import { IBaseCommandRepository, IBaseQueryRepository } from "./IBaseRepository";
import { CompanyStatus, TeamRole } from "@/shared/constance";
import { ICompany, ICompanyVerificationDoc, IOwnerVerificationDoc, ITeamMember } from "@/domain/interface/ICompany";
import { CompanyDoc } from "@/infrastructure/database/mongo/schema/company.schema";


export interface FindAllParams {
  page: number;
  limit: number;
  skip: number;
  status?: string;
  search?: string;
}

export interface FindAllResult {
  companies: ICompany[];
  total: number;
}

export interface ICompanyQueryRepository extends IBaseQueryRepository<ICompany, 'companies'> {
  findByName(name: string): Promise<ICompany | null>;
  findByWebsite(name: string): Promise<ICompany | null>;
  findByOwner(ownerId: string): Promise<ICompany[]>;
  findEmployees(companyId: string): Promise<{id: string; team?: ITeamMember[] } | null>;
  findCompanyByStatus(status: string): Promise<ICompany[]>;
  findAll(params: FindAllParams): Promise<FindAllResult>;
  findById(id: string): Promise<CompanyDoc | null>;
}

export interface ICompanyCommandRepository extends IBaseCommandRepository<ICompany> {
  updateDocs(
    id: string,
    ownerDocKey: IOwnerVerificationDoc,
    companyDocKey: ICompanyVerificationDoc 
  ): Promise<void>;
  updateStatus(id: string, status: CompanyStatus): Promise<ICompany | null>;
  addEmployee(companyId: string, userId: string, role: TeamRole): Promise<ICompany | null>;
}


export interface ICompanyRepository extends ICompanyQueryRepository, ICompanyCommandRepository {
  generateId(): string;
}

