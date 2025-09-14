import { AxiosError, AxiosInstance } from "axios";
import axiosInstance from "./config";
import { adminLogin } from "@/types/user";
import { CompanyStatus } from "@/types/company";

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

class AdminApi {
  private static axios: AxiosInstance = axiosInstance;

  static fetchUsers = async (params: PaginationParams = {}) => {
    try {
      const { page = 1, limit = 10, search } = params;
      const queryParams = new URLSearchParams();
      
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      if (search && search.trim()) {
        queryParams.append('search', search.trim());
      }

      const response = await this.axios.get(`/api/v1/admin/users?${queryParams.toString()}`);
      console.log("response", response);
      
      // Return the complete payload structure
      return {
        users: response.data.data.payload.users,
        total: response.data.data.payload.total,
        currentPage: page,
        totalPages: Math.ceil(response.data.data.payload.total / limit)
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static signIn = async (
    { email, password }: adminLogin,
    { rejectWithValue }: { rejectWithValue: (value: any) => void }
  ) => {
    try {
      const response = await this.axios.post("/api/v1/auth/admin/login", {
        email,
        password,
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log("error", error);

      if (error instanceof AxiosError && error.response?.data?.errors) {
        const { errors } = error.response.data;

        // Default error message
        let message = errors.message || "Something went wrong";

        // If details exist, use field-specific message
        if (Array.isArray(errors.details) && errors.details.length > 0) {
          message = errors.details[0].message;
        }

        return rejectWithValue(message);
      }

      return rejectWithValue("Unexpected error occurred");
    }
  };

  static googleAuth = async (token: any) => {
    try {
      console.log(token);

      const response = await this.axios.post(
        "/api/v1/admin/google-auth",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static resetPassword = async ({
    password,
    token,
  }: {
    password: string;
    token: string;
  }) => {
    try {
      const response = await this.axios.post(
        `/api/v1/admin/reset-password/${token}`,
        {
          password,
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static blockUser = async (id: string) => {
    try {
      const response = await this.axios.patch(`/api/v1/admin/block/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static logout = async () => {
    try {
      const response = await this.axios.post("/api/v1/admin/logout");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  static verificationRequest = async (status: string = CompanyStatus.UNDER_REVIEW, page: number) => {
  try {
    const response = await this.axios.get(
      `/api/v1/admin/companies?status=${status}&page=${page}&limit=10`
    );

    return response.data.data.payload;
  } catch (error) {
    throw error;
  }
};


  static getCompany = async (id: string) => {
    try {
      const response = await this.axios.get(`/api/v1/admin/companies/${id}`);
      console.log("response", response);
      if (response.status === 200) {
        console.log("response", response);
        return response.data.data.payload;
      }
    } catch (error) {
      throw error;
    }
  };

  static changeCompanyVerificationStatus = async ({
    status,
    id,
  }: {
    status: string;
    id: string;
  }) => {
    return await this.axios.patch(
      `/api/v1/admin/companies/${id}/status?status=${status}`
    );
  };

  static getVerificationDocs = async (key: string) => {
    try {
      const response = await this.axios.get(`/api/v1/admin/companies/docs/${key}`);
      return response.data.data.payload;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static getSubscriptionPlans = async () => {
    try {
      const response = await this.axios.get("/api/v1/payment/plans");
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  };

  static getJobStats = async () => {
    try {
      const response = await this.axios.get("/api/v1/admin/job/job-stats");
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  };

  static getCompanies = async (
    filters: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    } = {}
  ) => {
    try {
      const response = await this.axios.get("/api/v1/admin/companies", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching companies (admin):", error);
      throw error;
    }
  };

  static changeCompanyStatus = async (companyId: string, status: string) => {
    try {
      const response = await this.axios.patch(
        `/api/v1/admin/companies/${companyId}/status`,
        null,
        { params: { status } }
      );
      return response.data;
    } catch (error) {
      console.error("Error changing company status:", error);
      throw error;
    }
  };

  static getCompanyStatistics = async () => {
    try {
      const response = await this.axios.get(
        "/api/v1/admin/companies/statistics"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching company statistics:", error);
      throw error;
    }
  };
}

export { AdminApi };