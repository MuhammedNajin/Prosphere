import { Application } from "@/infra/database/mongo";


export class GetStatusCountsRepository {
    static async getStatusCounts(userId: string): Promise<Record<string, number>> {
        const counts = await Application.aggregate([
            { $match: { applicantId: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

     
        const statusCounts: Record<string, number> = {
            All: 0
        };

        counts.forEach(({ _id, count }) => {
            statusCounts[_id] = count;
            statusCounts.All += count;
        });

        return statusCounts;
    }
} 