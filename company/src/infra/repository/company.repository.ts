import { Company } from "../database/mongo/schema";
import { CompanyAttrs } from "../database/mongo/schema/company.schema";
import { ICompany } from '@domain/entities/ICompany'

export default {
  createCompany: async (attrs: CompanyAttrs) => {
    return await Company.build(attrs).save();
  },

  getCompany: async (url: string) => {
    const company = await Company.findOne({ url });
    return company;
  },

  getMyCompany: async (id: string) => {
    return await Company.find({ owner: id });
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
    option: { isArray?: boolean } = {}
  ) => {
    console.log("isArray", option);
    try {
        if (option?.isArray) {
            return await Company.findByIdAndUpdate(
              { _id },
              {
                $addToSet: { ...body },
              },
              {
                new: true,
                runValidators: true,
              }
            );
          }
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
    }
  },
};
