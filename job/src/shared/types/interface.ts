export interface JobListingQueryParams {
    page: number; 
    pageSize: number; 
    filter?: object; 
    search?: string; 
    location?: string;
}

export interface DailyData {
    date: string;
    count: number;
    byStatus: {
      [key: string]: number;
    };
  }
  
 export interface GraphData {
    labels: string[];
    datasets: {
      total: number[];
      byStatus: {
        [key: string]: number[];
      };
    };
  }

  export interface DateRange {
     startDate: Date;
     endDate: Date;
  }
