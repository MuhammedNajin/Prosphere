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

            // Search condition
            if (search) {
                query.$or = [
                    { jobTitle: { $regex: search, $options: 'i' } },
                ];
            }

            // Location condition
            if (location) {
                query.officeLocation = { $regex: location, $options: 'i' };
            }

            // Salary condition
            if (filter.salary?.min || filter.salary?.max) {
                if (filter.salary.min) {
                    query['salary.from'] = { $gte: parseInt(filter.salary.min) }
                }
                if (filter.salary.max) {
                    query['salary.to'] = { $lte: parseInt(filter.salary.max) };
                }
            }
            
            // Experience condition
            if (filter.experience) {
                query.experience = { $gte: filter.experience };
            }

            // ============================
            // OR conditions for employment & jobLocation
            // ============================
            const orConditions: any[] = [];

            if (filter.employment) {
                const employmentTypes = Array.isArray(filter.employment) 
                    ? filter.employment 
                    : filter.employment.split(',');

                if (employmentTypes.length > 0) {
                    orConditions.push({
                        employment: { $in: employmentTypes }
                    });
                }
            }

            if (filter.jobLocation) {
                const locations = Array.isArray(filter.jobLocation) 
                    ? filter.jobLocation 
                    : filter.jobLocation.split(',');

                if (locations.length > 0) {
                    orConditions.push({
                        jobLocation: { 
                            $in: locations.map(loc => new RegExp(loc, 'i'))
                        }
                    });
                }
            }

            if (orConditions.length > 0) {
                // if query already has $or from search, merge them
                if (query.$or) {
                    query.$or = [...query.$or, ...orConditions];
                } else {
                    query.$or = orConditions;
                }
            }

            // Pagination
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
