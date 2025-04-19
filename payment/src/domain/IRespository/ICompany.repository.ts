import { Company } from "@/infrastructure/database/sql/entities/company.entitiy";
import { ICompany } from "@/shared/types/company.interface";
import { UsageMetrics } from "@/shared/types/enums";

export interface ICompanyRepository {
    create(company: Company): Promise<ICompany | null>
    getCompany(companyId: string): Promise<ICompany | null>
    updateTrail(companyId: string, usage_stats: UsageMetrics): Promise<void | null>
} 