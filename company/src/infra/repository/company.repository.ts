import { Company,  } from "../database/mongo/schema";
import { CompanyAttrs, } from "../database/mongo/schema/company.schema";
import { ICompany } from '@domain/entities/ICompany'
import { CompanyStatus } from '@/shared/types/company'
import { BadRequestError, NotFoundError } from '@muhammednajinnprosphere/common'

export default {
  createCompany: async (attrs: CompanyAttrs) => {
    return await Company.build(attrs).save();
  },

  getCompany: async (_id: string) => {
    const company = await Company.findOne({ _id }).populate('owner')
    return company;
  },

  getMyCompany: async (id: string) => {
     try {
      
      if(!id) {
         throw new Error('Argument required: id is missing')
      }
      return await Company.find({ owner: id });
     } catch (error) {
        console.log(error)
     }
  },

  uploadDocs: async (ownerVerificationDoc: CompanyAttrs['ownerVerificationDoc'], companyVerificationDoc: CompanyAttrs['companyVerificationDoc'], _id: string) => {
      return await Company.updateOne({ _id }, {
        $set: { 
          ownerVerificationDoc, 
          companyVerificationDoc, 
          status: 'pending' 
        }
      },
      {
        runValidators: true
      }
    )
  },

  /**
   * Updates a company document in the database
   * @param _id - The ID of the company to update
   * @returns Promise containing the update result
   */

  getCompanyById: async (_id: string) => {
     try {
      console.log("_id", _id)
        return await Company.findById(_id);
     } catch (error) {
        console.log(error)
        throw error;
     }
  },

  /**
   * Updates a company document in the database
   * @param _id - The ID of the company to update
   * @param body - The update payload
   * @param options - Update options
   * @returns Promise containing the update result
   */
  updateCompany: async (
    _id: string,
    body: Partial<ICompany>,
  ) => {
    try {
        
          return await Company.findByIdAndUpdate(
            { _id },
            {
              $set: { ...body },
            },
            {
              new: true,
              runValidators: true,
            }
          );

    } catch (error) {
        console.log(error);
        throw error
    }
  },

  getCompanies: async () => {
     try {
         return await Company.find({});
     } catch (error) {
       console.log(error)
       throw error
     }
  },

  changeCompanyStatus: async (status: CompanyStatus, _id: string) => {
     try {
      console.log(" repo ",  status, _id)
       const company = await Company.findOne({ _id });

       if(!company) {
         throw new BadRequestError(`Company not found with _id: ${_id}`);
       }

       if(!status) {
         throw new Error("argument status is missing")
       }

       if(company.status === CompanyStatus.Verified) {
          throw new BadRequestError('Company status already verified')
       }

       if(status === CompanyStatus.Pending) {
         throw new BadRequestError("Can't change status to pending")
       }

       company.status = status;
       company?.statusHistory?.push({
         status: status,
         updatedAt: Date.now(),
       })

       await company?.save();

     } catch (error) {
        console.log(error)
        throw error;
     }
  }
};
