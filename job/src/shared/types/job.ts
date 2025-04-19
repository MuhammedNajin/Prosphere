export interface JobFilterByCompany {
  to: string;
  from: string;
  filter?: string;
  page: number;
  pageSize: number;
}

export interface jobStats {
  totalJob: number;
  totalActiveJob: number;
}
