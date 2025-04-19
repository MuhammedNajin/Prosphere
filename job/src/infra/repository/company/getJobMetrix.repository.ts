import { TIME_FRAME } from "@/shared/types/enums";
import { DateRange } from "@/shared/types/interface";
import { Job } from "@infra/database/mongo";
import Application, { ApplicationDoc } from "@infra/database/mongo/schema/application.schema";
import mongoose from "mongoose";

interface MetricsResult {
  date: string;
  count: number;
  statuses: {
    Applied: number;
    Inreview: number;
    Shortlisted: number;
    Interview: number;
    Rejected: number;
    Selected: number;
  };
}

export class GetJobMetrixRepository {
  static async getMetrix(
    companyId: string,
    timeFrame: TIME_FRAME,
    dateRange: DateRange,
  ): Promise<MetricsResult[]> {
   
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    let groupStage: any;
    let projectStage: any;

    switch (timeFrame) {
      case TIME_FRAME.WEEKLY:
        groupStage = {
          $group: {
            _id: {
              year: { $year: '$appliedAt' },
              month: { $month: '$appliedAt' },
              day: { $dayOfMonth: '$appliedAt' },
              dayOfWeek: { $dayOfWeek: '$appliedAt' }
            },
            count: { $sum: 1 },
            statuses: { $push: '$status' }
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
            dayOfWeek: '$_id.dayOfWeek',
            count: 1,
            statuses: 1
          }
        };
        break;

      case TIME_FRAME.MONTHLY:
        groupStage = {
          $group: {
            _id: {
              year: { $year: '$appliedAt' },
              month: { $month: '$appliedAt' },
              day: { $dayOfMonth: '$appliedAt' }
            },
            count: { $sum: 1 },
            statuses: { $push: '$status' }
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
            count: 1,
            statuses: 1
          }
        };
        break;

      case TIME_FRAME.YEARLY:
        groupStage = {
          $group: {
            _id: {
              year: { $year: '$appliedAt' },
              month: { $month: '$appliedAt' }
            },
            count: { $sum: 1 },
            statuses: { $push: '$status' }
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
            count: 1,
            statuses: 1
          }
        };
        break;
    }

    // startDate.setHours(0, 0, 0, 0);
    // endDate.setHours(22, 59, 59, 999);

    const pipeline = [
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          appliedAt: { $gte: startDate, $lte: endDate }
        }
      },
      groupStage,
      projectStage,
      { $sort: { date: 1 } }
    ];

    const results = await Application.aggregate(pipeline);
    const allDates = GetJobMetrixRepository.generateDateRange(startDate, endDate, timeFrame);
    const filledResults = GetJobMetrixRepository.fillMissingDates(allDates, results, timeFrame);
    console.log(startDate, endDate, timeFrame);
    
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
  ): MetricsResult[] {
    return dateRange.map(date => {
      const result = results.find(r => r.date === date) || {
        count: 0,
        statuses: []
      };

      return {
        date: timeFrame === TIME_FRAME.YEARLY
          ? GetJobMetrixRepository.formatMonthYear(date)
          : GetJobMetrixRepository.formatDate(date),
        count: result.count,
        statuses: {
          Applied: result.statuses.filter((s: string) => s === 'Applied').length,
          Inreview: result.statuses.filter((s: string) => s === 'Inreview').length,
          Shortlisted: result.statuses.filter((s: string) => s === 'Shortlisted').length,
          Interview: result.statuses.filter((s: string) => s === 'Interview').length,
          Rejected: result.statuses.filter((s: string) => s === 'Rejected').length,
          Selected: result.statuses.filter((s: string) => s === 'Selected').length
        }
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
      month: 'short', 
    });
  }
}