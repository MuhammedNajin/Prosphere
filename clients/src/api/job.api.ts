import axiosInstance from "./config";
import { AxiosInstance } from "axios";

class JobApi {
  private static axios: AxiosInstance = axiosInstance;

  static postJob = async ({ formData, id, trail, subscriptionId }: { formData: any, id: string, trail: boolean, subscriptionId: string}) => {
   
    console.log("job posting ", formData);
    const minSalary = formData["minSalary"];
    const maxSalary = formData["maxSalary"];
    console.log("salary", minSalary, maxSalary);
    delete formData.maxSalary;
    delete formData.minSalary;
    return await this.axios.post(
      `/api/v1/job/company/jobs?id=${subscriptionId}&trail=${trail}`,
      {
        ...formData,
        companyId: id,
        salary: { to: maxSalary, from: minSalary, status: true },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  static updateJob = async ({ formData, companyId, id }) => {
    console.log("edit posting ", formData);
    const minSalary = formData["minSalary"];
    const maxSalary = formData["maxSalary"];
    console.log("salary", minSalary, maxSalary);
    delete formData.maxSalary;
    delete formData.minSalary;
    return this.axios.post(`/api/v1/job/${id}`, {
      ...formData,
      companyId,
      salary: { to: maxSalary, from: minSalary, status: true },
    });
  };
  static getJobs = async ({
    page = 1,
    pageSize = 2,
    filter = {},
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

      const response = await this.axios.get(`/api/v1/job/?${queryParams}`);
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

  static addComment = async ({ data }: { data: unknown }) => {
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

  static likeJobs = async ({ data }) => {
    return this.axios.post("/api/v1/job/like", data);
  };

  static getJobDetails = async (id: string) => {
    try {
      const response = await this.axios.get(`/api/v1/job/${id}`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  static getjobByCompany = async () => {
    try {
      const response = await this.axios.get("/api/v1/job/company/all");
      return response.data?.data;
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
}

export { JobApi };
