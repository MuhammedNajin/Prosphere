import Company from '@infra/database/mongo/schema/company.schema';



class CompanyRepository {
     
     async create(company): Promise<null> {
        return await Company.build(company).save();
    }

}


export default new CompanyRepository()