import { GetjobByCompanyArgs, UpdateJobProps } from "@/types/job";
import axiosInstance from "./config";
import { AxiosInstance } from "axios";
import { JobFormData } from "@/types/formData";
import { CommentFormData } from "@/components/job/JobCommentDialog";

class JobApi {
  private static axios: AxiosInstance = axiosInstance;

  static postJob = async ({
    formData,
    companyId,
  }: {
    formData: JobFormData;
    companyId: string;
  }) => {
    console.log("job posting ", formData);
    const minSalary = formData["minSalary"];
    const maxSalary = formData["maxSalary"];
    console.log("salary", minSalary, maxSalary);
    delete (formData as any).maxSalary;
    delete (formData as any).minSalary;

    return await this.axios.post(
      `/api/v1/job/company/jobs`,
      {
        ...formData,
        companyId,
        salary: { to: maxSalary, from: minSalary, status: true },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  static updateJob = async ({ formData, companyId, id }: UpdateJobProps) => {
    console.log("edit posting ", formData);
    const minSalary = formData["minSalary"];
    const maxSalary = formData["maxSalary"];
    console.log("salary", minSalary, maxSalary);
    const updatedFormData = { ...formData };
    delete (updatedFormData as any).maxSalary;
    delete (updatedFormData as any).minSalary;
    return this.axios.post(`/api/v1/job/${id}`, {
      ...formData,
      companyId,
      salary: { to: maxSalary, from: minSalary, status: true },
    });
  };
  
  static getJobs = async ({
    page = 1,
    pageSize = 2,
    filter = {} as {
      salary?: { min?: number; max?: number };
      experience?: string;
      employment?: string[];
      jobLocation?: string[];
    },
    search = "",
    location = "",
  }) => {
    try {
      console.log("filter", filter, location);
      const queryParams = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search: search,
        location,

        ...(filter.salary?.min && { minSalary: String(filter.salary.min) }),
        ...(filter.salary?.max && { maxSalary: String(filter.salary.max) }),
        ...(filter.experience && { experience: String(filter.experience) }),
        ...(filter.employment?.length && {
          employment: filter?.employment?.join(","),
        }),
        ...(filter.jobLocation?.length && {
          jobLocation: filter?.jobLocation?.join(","),
        }),
      });

      const response = await this.axios.get(`/api/v1/job/public?${queryParams}`);
      console.log("response.data", response.data);
      if (response.status === 200) {
        return {
          jobs: response.data.jobs || [],
          currentPage: page,
          totalPages: Math.ceil((response.data.total || 0) / pageSize),
          hasMore: page < Math.ceil((response.data.total || 0) / pageSize),
          total: response.data.total || 0,
        };
      }

      throw new Error("Failed to fetch jobs");
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  };

  static addComment = async ({ data }: { data: CommentFormData }) => {
    console.log("comment ", data);
    return this.axios.post("/api/v1/job/comment", data);
  };

  static getComment = async ({ jobId }: { jobId: string }) => {
    console.log("get comment ", jobId);
    try {
      const response = await this.axios.get(
        `api/v1/job/comment/?jobId=${jobId}`
      );

      return response.data;
    } catch (error) {
      return error;
    }
  };

  static likeJobs = async ({ data }: { data: {
    jobId: string,
    userId: string,
    index: number,
  }}) => {
    return this.axios.post("/api/v1/job/like", data);
  };

  static getJobDetails = async (id: string) => {
    try {
      console.log("job details api ", id);
      const response = await this.axios.get(`/api/v1/job/${id}`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  static getjobByCompany = async ({
    filter,
    from,
    to,
    page,
    pageSize = 2
  }: GetjobByCompanyArgs) => {
    try {

      const queryParams = new URLSearchParams({
        to: to.toISOString(),
        from: from.toISOString(),
        filter,
        page: String(page),
        pageSize: String(pageSize),
      });

      const response = await this.axios.get(
        `/api/v1/job/company/all?${queryParams}`
      );
      return {
        jobs: response.data.jobs || [],
        currentPage: page,
        totalPages: Math.ceil((response.data.total || 0) / pageSize),
        hasMore: page < Math.ceil((response.data.total || 0) / pageSize),
        total: response.data.total || 0,
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static getjobByCompanyFromPublic = async ({
    filter,
    from,
    to,
    page,
    pageSize = 2,
    companyId
  }: GetjobByCompanyArgs) => {
    try {

      const queryParams = new URLSearchParams({
        to: to.toISOString(),
        from: from.toISOString(),
        filter,
        page: String(page),
        pageSize: String(pageSize),
        companyId: companyId ? companyId : ""
      });

      const response = await this.axios.get(
        `/api/v1/job/all?${queryParams}`
      );
      return {
        jobs: response.data.jobs || [],
        currentPage: page,
        totalPages: Math.ceil((response.data.total || 0) / pageSize),
        hasMore: page < Math.ceil((response.data.total || 0) / pageSize),
        total: response.data.total || 0,
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static jobSeen = async (id: string) => {
    try {
      const response = await this.axios.patch(`/api/v1/job/view/${id}`);
      return response.data?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static getJobApplications = async (
    jobId: string, 
    page: number = 1, 
    limit: number = 10
  ) => {
    try {
      const response = await this.axios.get(`/api/v1/jobs/${jobId}/applications`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching job applications:", error);
      throw error;
    }
  };

  static getJobStatistics = async (
    companyId: string,
    filters: {
      startDate: Date;
      endDate: Date;
      timeFrame?: string;
    }
  ) => {
    try {
      const response = await this.axios.get("/api/v1/jobs/statistics", {
        params: {
          companyId,
          startDate: filters.startDate.toISOString(),
          endDate: filters.endDate.toISOString(),
          timeFrame: filters.timeFrame || "year",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching job statistics:", error);
      throw error;
    }
  };
}

export { JobApi };
