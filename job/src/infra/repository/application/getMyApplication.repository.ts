import { Application } from '@infra/database/mongo';
import { IApplicationEntity } from '@domain/interface/IEntity';
import mongoose from 'mongoose'
interface PaginatedApplicationResponse {
    applications: Array<{
        _id: string;
        appliedAt: Date;
        status: string;
        companyId: {
            name: string;
            _id: string;
        };
        jobId: {
            jobTitle: string;
            _id: string;
        };
    }>;
    pagination: {
        total: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export class GetMyApplicationRepository {

    static async getApplied(
       {
        filter,
        page = 1,
        search,
        userId,
        pageSize,
       }: {
        userId: string, 
        search: string, 
        filter: string , 
        page: number 
        pageSize: number
       }
    ): Promise<PaginatedApplicationResponse> {
        
        const currentPage = Math.max(1, page);
        const skip = (currentPage - 1) * pageSize;


        console.log("getApplied application repository", filter, page, search, pageSize, userId);

        
        const filterConditions: any = {
            applicantId: userId
        };

       
        if (filter && filter !== 'All') {
            filterConditions.status = filter;
        }

       
        if (search) {
    
            filterConditions.$or =  [
                { 'companyId.name': { $regex: search, $options: 'i' } },
                { 'jobId.jobTitle': { $regex: search, $options: 'i' } }
              ]
        }

        console.log("fiterConditon", filterConditions)

        const aggregationPipeline = [
            {
                $match: {
                    applicantId: new mongoose.Types.ObjectId(userId),
                    ...(filter && filter !== 'All' ? { status: filter } : {})
                }
            },
        
            {
                $lookup: {
                    from: 'companies',  
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'companyInfo'
                }
            },
        
            {
                $unwind: '$companyInfo'
            },
        
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'jobId',
                    foreignField: '_id',
                    as: 'jobInfo'
                }
            },

            {
                $unwind: '$jobInfo'
            },

            ...(search ? [{
                $match: {
                    $or: [
                        { 'companyInfo.name': { $regex: search, $options: 'i' } },
                        { 'jobInfo.jobTitle': { $regex: search, $options: 'i' } }
                    ]
                }
            }] : []),

            {
                $sort: { appliedAt: -1 }
            },

            {
                $skip: skip
            },

            {
                $limit: pageSize
            },
        
            {
                $project: {
                    _id: 1,
                    appliedAt: 1,
                    status: 1,
                    'companyId': {
                        _id: '$companyInfo._id',
                        name: '$companyInfo.name',
                        logo: '$companyInfo.logo'
                    },
                    'jobId': {
                        _id: '$jobInfo._id',
                        jobTitle: '$jobInfo.jobTitle'
                    }
                }
            }
        ];

        const [applications, totalCount, countArray] = await Promise.all([
            Application.aggregate(aggregationPipeline),
            
            Application.countDocuments({ applicantId: userId }),
            Application.aggregate([
                {
                    $match: { 
                        applicantId: new mongoose.Types.ObjectId(userId),
                    }
                },
                { 
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        status: "$_id",
                        count: 1,
                        _id: 0
                    }
                }
            ])
        ]);

       const filtersCount = {
         All: totalCount,
         applied: 0,
         inreview:0,
         shortlisted: 0,
         interview: 0,
         rejected: 0,
         selected: 0,
       }
       
       for(let i = 0; i < countArray.length; i++) {
          const key = countArray[i].status;
          const value = countArray[i].count;
           filtersCount[key] = value;
       }

        console.log("filtersCount", filtersCount);
        return {
            applications,
            total: totalCount,
            filtersCount
        };
    }
}