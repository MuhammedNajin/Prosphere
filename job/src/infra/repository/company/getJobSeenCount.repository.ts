import { TIME_FRAME } from "@/shared/types/enums";
import { DateRange } from "@/shared/types/interface";
import Job, { JobDoc } from "@infra/database/mongo/schema/job.schema";
import mongoose from "mongoose";

interface JobViewMetricsResult {
  date: string;
  viewCount: number;
  uniqueViewers: number;
}

export class GetJobViewsRepository {
  static async getMetrics(
    companyId: string,
    timeFrame: TIME_FRAME,
    dateRange: DateRange,
  ): Promise<JobViewMetricsResult[]> {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    let groupStage: any;
    let projectStage: any;

    switch (timeFrame) {
      case TIME_FRAME.WEEKLY:
        groupStage = {
          $group: {
            _id: {
              year: { $year: '$veiws.seenAt' },
              month: { $month: '$veiws.seenAt' },
              day: { $dayOfMonth: '$veiws.seenAt' }
            },
            
            viewCount: { $sum: 1 },
            uniqueViewers: { $addToSet: '$veiws.userId' }
          }
        };
        projectStage = {
          $project: {
            _id: 0,
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: {
                  $dateFromParts: {
                    year: '$_id.year',
                    month: '$_id.month',
                    day: '$_id.day'
                  }
                }
              }
            },
            viewCount: 1,
            uniqueViewers: { $size: '$uniqueViewers' }
          }
        };
        break;

      case TIME_FRAME.MONTHLY:
        groupStage = {
          $group: {
            _id: {
              year: { $year: '$veiws.seenAt' },
              month: { $month: '$veiws.seenAt' },
              day: { $dayOfMonth: '$veiws.seenAt' }
            },
            viewCount: { $sum: 1 },
            uniqueViewers: { $addToSet: '$veiws.userId' }
          }
        };
        projectStage = {
          $project: {
            _id: 0,
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: {
                  $dateFromParts: {
                    year: '$_id.year',
                    month: '$_id.month',
                    day: '$_id.day'
                  }
                }
              }
            },
            viewCount: 1,
            uniqueViewers: { $size: '$uniqueViewers' }
          }
        };
        break;

      case TIME_FRAME.YEARLY:
        groupStage = {
          $group: {
            _id: {
              year: { $year: '$veiws.seenAt' },
              month: { $month: '$veiws.seenAt' }
            },
            viewCount: { $sum: 1 },
            uniqueViewers: { $addToSet: '$veiws.userId' }
          }
        };
        projectStage = {
          $project: {
            _id: 0,
            date: {
              $dateToString: {
                format: '%Y-%m',
                date: {
                  $dateFromParts: {
                    year: '$_id.year',
                    month: '$_id.month',
                    day: 1
                  }
                }
              }
            },
            viewCount: 1,
            uniqueViewers: { $size: '$uniqueViewers' }
          }
        };
        break;
    }

    const pipeline = [

      { $unwind: '$veiws' },
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          'veiws.seenAt': { $gte: startDate, $lte: endDate }
        }
      },
      groupStage,
      projectStage,
      { $sort: { date: 1 } }
    ];

    const results = await Job.aggregate(pipeline);
    const allDates = this.generateDateRange(startDate, endDate, timeFrame);
    const filledResults = this.fillMissingDates(allDates, results, timeFrame);
    
    return filledResults;
  }

  private static generateDateRange(start: Date, end: Date, timeFrame: TIME_FRAME): string[] {
    const dates: string[] = [];
    const current = new Date(start);

    while (current <= end) {
      const dateStr = timeFrame === TIME_FRAME.YEARLY
        ? current.toISOString().slice(0, 7)
        : current.toISOString().slice(0, 10);
      dates.push(dateStr);

      if (timeFrame === TIME_FRAME.YEARLY) {
        current.setMonth(current.getMonth() + 1);
      } else {
        current.setDate(current.getDate() + 1);
      }
    }

    return dates;
  }

  private static fillMissingDates(
    dateRange: string[],
    results: any[],
    timeFrame: TIME_FRAME
  ): JobViewMetricsResult[] {
    return dateRange.map(date => {
      const result = results.find(r => r.date === date) || {
        viewCount: 0,
        uniqueViewers: 0
      };

      return {
        date: timeFrame === TIME_FRAME.YEARLY
          ? this.formatMonthYear(date)
          : this.formatDate(date),
        viewCount: result.viewCount,
        uniqueViewers: result.uniqueViewers
      };
    });
  }

  private static formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit'
    });
  }

  private static formatMonthYear(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short'
    });
  }
}