import { Application } from '@infra/database/mongo';
import { IApplicationEntity } from '@domain/interface/IEntity';
import { ApplicationFilter, GetAllApplicationReturnType } from '@/shared/types/application';
import mongoose from 'mongoose';

export class GetAllApplicationRepository {
  static async getAll(
    companyId: string,
    { 
      page = 1, 
      pageSize = 10, 
      filter, 
      search, 
    }: ApplicationFilter
  ): Promise<GetAllApplicationReturnType> {
    try {
    console.log("debug get all applicatin repo", page, pageSize, filter, search, companyId)
      const query: any = { companyId: new mongoose.Types.ObjectId(companyId) };

      if (filter) {
        query.status = filter;
      }

      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [
            { 'jobData.jobTitle': { $regex: search, $options: 'i' } },
            { 'applicantData.username': { $regex: search, $options: 'i' } },
            { 'applicantData.email': { $regex: search, $options: 'i' } }
          ]
        };
      }

      const pipeline = [

        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'jobData'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'applicantId',
            foreignField: '_id',
            as: 'applicantData'
          }
        },

        { $unwind: '$jobData' },
        { $unwind: '$applicantData' },
   
        {
          $match: {
            ...query,
            ...searchQuery
          }
        },

    
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
      ];

      
      const [applications, total] = await Promise.all([
        Application.aggregate(pipeline),
        Application.countDocuments(query)
      ]);

      return {
        applications,
        total,
      };
    } catch (error) {
      console.error('Error in GetAllApplicationRepository:', error);
      throw error;
    }
  }
}