import { Company,  } from "../database/mongo/schema";
import { CompanyAttrs, } from "../database/mongo/schema/company.schema";
import { ICompany } from '@domain/entities/ICompany'
import { CompanyStatus } from '@/shared/types/company'
import { BadRequestError, NotFoundError } from '@muhammednajinnprosphere/common'
import { Types } from "mongoose";
import Subscription from "../database/mongo/schema/subscription.schema";

export default {
  createCompany: async (attrs: CompanyAttrs) => {
   const company = await Company.build(attrs).save();
    await Subscription.build({ companyId: company._id }).save();
    return company;
  },

  getCompany: async (name: string) => {
    const company = await Company.findOne({ name }).populate('owner')
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
          status: 'uploaded' 
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
      console.log("getCompanyById from _id", _id)
        const company = await Company.findById(_id).populate('owner');
        const subscription = await Subscription.findOne({ companyId : _id });

        return { company, subscription };
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

       if(status === CompanyStatus.Verified) {
          company.verified = true;
       }

       company?.statusHistory?.push({
         status: status,
         updatedAt: Date.now(),
       })

       await company?.save();

     } catch (error) {
        console.log(error)
        throw error;
     }
  },

   addEmployee: async (companyId: string, userId: string) => {
    try {
     
      if (!companyId || !userId) {
        throw new Error('Company ID and User ID are required');
      }
  
      if (!Types.ObjectId.isValid(companyId) || !Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid Company ID or User ID format');
      }
  
  
      const existingEmployee = await Company.findOne({
        _id: companyId,
        'team.userId': userId
      });
  
      if (existingEmployee) {
        throw new BadRequestError('Employee already exists')
      }

      const result = await Company.updateOne(
        { _id: companyId },
        {
          $addToSet: {
            team: { userId }
          }
        }
      );

    } catch (error) {
      console.error('Error in addEmployee:', error)
      throw new Error('Failed to add employee to company');
    }
  },

  getEployees: async (companyId: string) => {
     try {
       return await Company.findOne({ _id: companyId }, { team: 1}).populate('team.userId');
     } catch (error) {
        console.log(error);
        throw error;
        
     }
  }
}
