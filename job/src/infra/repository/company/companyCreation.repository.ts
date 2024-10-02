import { Company } from '@infra/database/mongo';
import { ICompanyEntity } from '@domain/interface/IEntity';


export class CompanyCreationRepository {
     
    static async create(company: ICompanyEntity): Promise<ICompanyEntity | null> {
        return await Company.build(company).save();
    }
}