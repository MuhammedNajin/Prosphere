import { Company } from '../database/mongo/schema'
import { CompanyAttrs } from '../database/mongo/schema/company.schema'
import mongoose from 'mongoose'



export default {
    
    createCompany: async (attrs: CompanyAttrs) => {
       return await Company.build(attrs).save();
    },

    getCompany: async (url: string) => {
        const company = await Company.findOne({ url });
        return company;
    },

    getMyCompany: async (id: string) => {  
        return await Company.find({ owner: id})
    }


}