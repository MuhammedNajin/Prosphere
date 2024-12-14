import { Repository } from "typeorm";
import { AppDataSource } from "../database/sql/connection";
import { Company } from "../database/sql/entities/company.entitiy";
import { ICompanyRepository } from "@/domain/IRespository/ICompany.repository";
import { User } from "../database/sql/entities/user.entity";
import { ICompany } from "@/shared/types/company.interface";


class CompanyRepository implements ICompanyRepository {
    private repository: Repository<Company>

    constructor() {
         this.repository = AppDataSource.getRepository(Company)
    }

    private handleDBError() {
         
    }

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
          where: { companyId }
      })
    }
}


export default new CompanyRepository()