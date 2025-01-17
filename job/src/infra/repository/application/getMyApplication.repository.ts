import { Application } from '@infra/database/mongo';
import { IApplicationEntity } from '@domain/interface/IEntity';

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


        console.log("getApplied application repository", filter, page, search, pageSize);

        
        const filterConditions: any = {
            applicantId: userId
        };

       
        if (filter && filter !== 'All') {
            filterConditions.status = filter;
        }

       
        if (search) {
           
            const searchRegex = new RegExp(search, 'i');
            filterConditions.$or = [
                { 'companyId.name': searchRegex },
                { 'jobId.jobTitle': searchRegex }
            ];
        }

        const [applications, totalCount] = await Promise.all([
            Application.find(filterConditions)
                .select('_id appliedAt status')
                .populate({
                    path: 'companyId',
                    select: 'name'
                })
                .populate({
                    path: 'jobId',
                    select: 'jobTitle'
                })
                .sort({ appliedAt: -1 }) 
                .skip(skip)
                .limit(pageSize),
            
            Application.countDocuments()
        ]);

        return {
            applications,
            total: totalCount
        };
    }
}