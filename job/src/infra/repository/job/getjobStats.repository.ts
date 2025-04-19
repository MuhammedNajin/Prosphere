import { JobDoc } from '@/infra/database/mongo/schema/job.schema';
import { Application, Job, User } from '@infra/database/mongo'

interface EmploymentTypeCount {
    type: string;
    count: number;
}

export interface JobStatsResponse {
    totalJob: number;
    totalActiveJob: number;
    totalUser: number;
    totalApplication: number;
    trends: JobTrend[];
    employmentTypeCounts: EmploymentTypeCount[];
    recentJobs: JobDoc[]
}

export class GetJobStatsRepository {
    static async getJobStats(): Promise<JobStatsResponse> {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1); 
        const endDate = new Date(currentYear, 11, 31); 

        // Common pipeline for both jobs and applications
        const dateMatchStage = {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        };

        const monthGroupStage = {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 }
            }
        };

        const projectStage = {
            $project: {
                _id: 0,
                month: {
                    $let: {
                        vars: {
                            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                        },
                        in: {
                            $arrayElemAt: ["$$monthNames", { $subtract: ["$_id", 1] }]
                        }
                    }
                },
                count: 1
            }
        };

        const sortStage = {
            $sort: { "_id": 1 }
        };

        // Employment type aggregation pipeline
        const employmentTypeAggregation = [
            {
                $group: {
                    _id: "$employment",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    type: "$_id",
                    count: 1
                }
            },
            {
                $sort: { count: -1 }
            }
        ];

        const [ 
            totalJob, 
            totalActiveJob, 
            totalUser, 
            totalApplication, 
            jobData,
            applicationData,
            employmentTypeCounts,
            recentJobs
        ] = await Promise.all([
            Job.countDocuments(),
            Job.countDocuments({
                expiry: { $gte: new Date() }
            }),
            User.countDocuments(),
            Application.countDocuments(),
            Job.aggregate([dateMatchStage, monthGroupStage, projectStage, sortStage]),
            Application.aggregate([dateMatchStage, monthGroupStage, projectStage, sortStage]),
            Job.aggregate(employmentTypeAggregation),
            Job.find().populate('companyId').limit(3),
        ]);

        // Create an array with all months, initialize with 0 counts
        const monthsTemplate = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ].map(month => ({
            month,
            jobs: 0,
            applications: 0
        }));

        // Merge both job and application data with the template
        const trends = monthsTemplate.map(template => {
            const monthJobData = jobData.find(data => data.month === template.month);
            const monthApplicationData = applicationData.find(data => data.month === template.month);
            
            return {
                month: template.month,
                jobs: monthJobData ? monthJobData.count : 0,
                applications: monthApplicationData ? monthApplicationData.count : 0
            };
        });

        return {
            totalJob,
            totalActiveJob,
            totalUser,
            totalApplication,
            trends,
            employmentTypeCounts,
            recentJobs,
        }
    }
}