import { Repository } from "typeorm";
import { AppDataSource } from "../database/sql/connection";
import { Company } from "../database/sql/entities/company.entitiy";
import { ICompanyRepository } from "@/domain/IRespository/ICompany.repository";
import { ICompany } from "@/shared/types/company.interface";
import { UsageMetrics } from "@/shared/types/enums";

class CompanyRepository implements ICompanyRepository {
  private repository: Repository<Company>;

  constructor() {
    this.repository = AppDataSource.getRepository(Company);
  }

  private handleDBError() {}

  async create(companyDTO: Company): Promise<ICompany | null> {
    try {
      const company = this.repository.create(companyDTO);
      return await this.repository.save(company);
    } catch (error) {
      throw error;
    }
  }

  async getCompany(companyId: string): Promise<ICompany | null> {
    return await this.repository.findOne({
      where: { companyId },
    });
  }

  async updateTrail(
    companyId: string,
    usage_stats: UsageMetrics
  ): Promise<void | null> {
    const company = await this.repository.findOne({
      where: { companyId },
    });

    if (!company) {
      return null;
    }

    console.log(" update trail limit repo ", company, usage_stats);

    if (!company.usageStats) {
      company.usageStats = {
        jobPostsUsed: 0,
        videoCallsUsed: 0,
        messagesUsed: 0,
      };
    }

    company.usageStats[usage_stats]++;

    await this.repository.save(company);
  }
}

export default new CompanyRepository();
