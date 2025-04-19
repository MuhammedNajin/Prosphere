import { JobFilterByCompany } from "@/shared/types/job";
import { Job } from "@infra/database/mongo";
import { JobDoc } from "@infra/database/mongo/schema/job.schema";

export class GetJobByCompanyIdRepository {
  static async getAll(
    companyId: string,
    { filter, from, to, page, pageSize }: JobFilterByCompany
  ): Promise<{ jobs: JobDoc[]; total: number } | null> {
    console.log(
      "debug args from GetJobByCompanyIdRepository",
      companyId,
      to,
      from,
      filter,
      page,
      pageSize
    );

    const query: { employment?: string } = {};
    if (filter) {
      query.employment = filter;
    }

    const skip = (page - 1) * pageSize;

    const [jobs, total] = await Promise.all([
      await Job.find({
        companyId,
        createdAt: { $gte: from, $lte: to },
        ...query,
      })
        .sort({createdAt: -1})
        .skip(skip)
        .limit(pageSize)
        
        ,
      await Job.countDocuments({ companyId }),
    ]);

    console.log("jobs profile", jobs);
    return {
      jobs,
      total,
    };
  }
}
