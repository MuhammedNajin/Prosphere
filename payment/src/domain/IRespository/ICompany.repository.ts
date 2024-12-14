import { Company } from "@/infrastructure/database/sql/entities/company.entitiy";
import { ICompany } from "@/shared/types/company.interface";

export interface ICompanyRepository {
    create(company: Company): Promise<ICompany | null>
    getCompany(companyId: string): Promise<ICompany | null>
} 