import {  Company } from '@infra/database/mongo';
import { ApplicationDoc } from '@infra/database/mongo/schema/application.schema';


export class UpdateCompanyRepository {
     
    static async update(_id : string, updateQuery: object): Promise<ApplicationDoc[] | null> {
        return await Company.updateOne({ _id }, {
            $set: updateQuery,
        })
    }
}