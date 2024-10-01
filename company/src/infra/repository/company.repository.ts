import { Company } from '../database/mongo/schema'
import { CompanyAttrs } from '../database/mongo/schema/company.schema'




export default {
    
    createCompany: async (attrs: CompanyAttrs) => {
       return await Company.build(attrs).save();
    },

    getCompany: async (url: string) => {
        const company = await Company.findOne({ url });
        return company;
    },


}