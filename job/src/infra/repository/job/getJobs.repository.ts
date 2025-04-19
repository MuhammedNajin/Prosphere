import { Job } from '@infra/database/mongo';
import { FilterQuery } from 'mongoose';
import { JobListingQueryParams } from '@/shared/types/interface';

export class GetJobsRepository {
    static async getJobs({
        page = 1,
        pageSize = 10,
        filter = {},
        search = "",
        location = ""
    }: JobListingQueryParams ) {
        try {
            const query: FilterQuery<typeof Job> = {};

            if (search) {
                query.$or = [
                    { jobTitle: { $regex: search, $options: 'i' } },
                ];
            }

            if (location) {
                query.officeLocation = { $regex: location, $options: 'i' };
            }

            if (filter.salary?.min || filter.salary?.max) {
                if (filter.salary.min) {
                    query['salary.from'] = { $gte: parseInt(filter.salary.min) }
                }
                if (filter.salary.max) {
                    query['salary.to'] = { $lte: parseInt(filter.salary.max) };
                }
            }
            
            if (filter.experience) {
                query.experience = { $gte: filter.experience };
            }

            // Handle employment filter for both string and array inputs
            console.log("filter", filter)
            if (filter.employment) {
                const employmentTypes = Array.isArray(filter.employment) 
                    ? filter.employment 
                    : filter.employment?.split(',');

                    console.log("employment filter ",  employmentTypes);
                    

                if (employmentTypes.length > 0) {
                    query.employment = { 
                        $in: employmentTypes
                    };
                }
            }

            if (filter.jobLocation?.length) {
                const locations = Array.isArray(filter.jobLocation) 
                    ? filter.jobLocation 
                    : [filter.jobLocation];
                
                query.jobLocation = { 
                    $in: locations.map(loc => 
                        new RegExp(loc, 'i')
                    )
                };
            }

            const skip = (page - 1) * pageSize;
            
            const [jobs, total] = await Promise.all([
                Job.find(query)
                    .populate('companyId')
                    .skip(skip)
                    .limit(pageSize)
                    .sort({ createdAt: -1 }),
                Job.countDocuments(query)
            ]);


         
            

            return {
                jobs,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            };
        } catch (error) {
            console.error('GetJobsRepository error:', error);
            throw error;
        }
    }
}