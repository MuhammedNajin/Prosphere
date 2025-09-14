// api/company.api.ts - Updated Company API Client with Improved Method Names
import { AxiosError, AxiosInstance } from "axios";
import axiosInstance from "./config";
import { Avatar, Companydata, DocumentVerificationFormData } from "@/types/formData";
import { ICompany } from "@/types/company";

class CompanyApi {
  private static axios: AxiosInstance = axiosInstance;

  // ===============================================
  // COMPANY CRUD OPERATIONS
  // ===============================================

  /**
   * Create a new company
   * POST /api/v1/companies
   */
  static createCompany = async ({ data }: { data: Companydata }) => {
    try {
      console.log("Creating company:", data);
      const response = await this.axios.post("/api/v1/users/companies", data);
      return response.data;
    } catch (error: AxiosError | any) {
      console.error("Error creating company:", error);
      return Promise.reject(error.response?.data || error);
    }
  };

  /**
   * Get current user's company
   * GET /api/v1/companies/me
   */
  static getCurrentUserCompany = async () => {
    try {
      const response = await this.axios.get("/api/v1/users/companies/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user company:", error);
      throw error;
    }
  };

  /**
   * Get company by ID (public profile)
   * GET /api/v1/companies/:id
   */
  static getCompanyById = async (id: string) => {
    try {
      const response = await this.axios.get(`/api/v1/companies/${id}`);
      console.log("response from get company by id", response);
      return response.data.data.payload;
    } catch (error) {
      console.error("Error fetching company by ID:", error);
      throw error;
    }
  };

  /**
   * Update company profile
   * PUT /api/v1/companies/:id
   */
  static updateCompanyProfile = async ({ id, data }: { id: string; data: Partial<ICompany> }) => {
    try {
      const response = await this.axios.put(`/api/v1/companies/${id}`, data);
      return response.data.data.payload;
    } catch (error) {
      console.error("Error updating company profile:", error);
      throw error;
    }
  };

  // ===============================================
  // COMPANY LOGO OPERATIONS
  // ===============================================

  /**
   * Upload/Update company logo
   * PUT /api/v1/companies/:id/logo
   */
  static uploadCompanyLogo = async ({ data, id }: { data: Avatar; id: string }) => {
    try {
      const response = await this.axios.put(`/api/v1/companies/${id}/logo`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading company logo:", error);
      throw error;
    }
  };

  /**
   * Get company asset/file by key
   * GET /api/v1/companies/assets/:key
   */
  static getCompanyAssetByKey = async (key: string) => {
    try {
      const response = await this.axios.get(`/api/v1/companies/assets/${key}`);
      return response.data.data.payload;
    } catch (error) {
      console.error("Error fetching company asset by key:", error);
      throw error;
    }
  };

  /**
   * Get multiple company files by keys (batch)
   * POST /api/v1/companies/assets/batch
   */
  static getCompanyFilesBatch = async (keys: string[]) => {
    try {
      const response = await this.axios.post("/api/v1/companies/assets/batch", { keys });
      return response.data;
    } catch (error) {
      console.error("Error fetching company files batch:", error);
      throw error;
    }
  };

  // ===============================================
  // COMPANY VERIFICATION
  // ===============================================

  /**
   * Upload company verification documents
   * PUT /api/v1/companies/:id/verification-docs
   */
  static uploadCompanyVerificationDocs = async ({ 
    data, 
    id 
  }: { 
    id: string; 
    data: DocumentVerificationFormData 
  }) => {
    try {
      const response = await this.axios.put(
        `/api/v1/users/companies/${id}/verification-docs`, 
        data, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading company verification docs:", error);
      throw error;
    }
  };

  // ===============================================
  // COMPANY ACCESS TOKEN
  // ===============================================

  /**
   * Generate company access token
   * POST /api/v1/companies/:id/access-token
   */
  static generateCompanyAccessToken = async ({ id }: { id: string }) => {
    try {
      const response = await this.axios.post(`/api/v1/users/companies/${id}/access-token`);
      return response.data.data;
    } catch (error) {
      console.error("Error generating company access token:", error);
      throw error;
    }
  };

  // ===============================================
  // EMPLOYEE OPERATIONS
  // ===============================================

  /**
   * Get current company's employees
   * GET /api/v1/companies/me/employees
   */
  static getCurrentCompanyEmployees = async () => {
    try {
      const response = await this.axios.get("/api/v1/companies/me/employees");
      return response.data;
    } catch (error) {
      console.error("Error fetching current company employees:", error);
      throw error;
    }
  };

  /**
   * Get employees of a specific company
   * GET /api/v1/companies/:id/employees
   */
  static getCompanyEmployees = async (companyId: string) => {
    try {
      const response = await this.axios.get(`/api/v1/companies/${companyId}/employees`);
      return response.data.data.payload;
    } catch (error) {
      console.error("Error fetching company employees:", error);
      throw error;
    }
  };

  /**
   * Add employee to company
   * POST /api/v1/companies/:companyId/employees
   */
  static addEmployeeToCompany = async ({ 
    companyId, 
    userId 
  }: { 
    companyId: string; 
    userId: string 
  }) => {
    try {
      const response = await this.axios.post(
        `/api/v1/companies/${companyId}/employees`, 
        { userId }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding employee to company:", error);
      throw error;
    }
  };

  /**
   * Add specific user as employee (alternative method)
   * PUT /api/v1/companies/:companyId/employees/:userId
   */
  static addSpecificEmployeeToCompany = async ({ 
    companyId, 
    userId 
  }: { 
    companyId: string; 
    userId: string 
  }) => {
    try {
      const response = await this.axios.put(`/api/v1/companies/${companyId}/employees/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error adding specific employee to company:", error);
      throw error;
    }
  };

  // ===============================================
  // USER SEARCH (Consider moving to UserApi)
  // ===============================================

  /**
   * Search users (should ideally be in UserApi)
   * GET /api/v1/users?search=query
   */
  static searchUsers = async (searchQuery: string, page: number = 1, limit: number = 10) => {
    try {
      const response = await this.axios.get("/api/v1/users/search", {
        params: {
          search: searchQuery,
          page,
          limit,
        },
      });
      return response.data.data.payload;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  };

  // ===============================================
  // JOB-RELATED OPERATIONS (Consider moving to JobApi)
  // ===============================================

  /**
   * Get applications by job ID
   * Note: Consider moving to JobApi class
   */
  static getJobApplications = async (
    jobId: string, 
    page: number = 1, 
    limit: number = 10
  ) => {
    try {
      const response = await this.axios.get(`/api/v1/job/company/applications/${jobId}`, {
        params: { page, limit },
      });
      return {
        data: response.data?.data,
        total: response.data?.total,
        currentPage: response.data?.currentPage,
        totalPages: response.data?.totalPages,
      };
    } catch (error) {
      console.error("Error fetching job applications:", error);
      throw error;
    }
  };

  /**
   * Get job statistics for a company
   * Note: Consider moving to JobApi class
   */
  static getCompanyJobStatistics = async (
    companyId: string,
    dateRange: { startDate: Date; endDate: Date },
    timeFrame: string = "year"
  ) => {
    try {
      const response = await this.axios.get("/api/v1/job/company/statistics", {
        params: {
          companyId,
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          timeFrame,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching company job statistics:", error);
      throw error;
    }
  };

  /**
   * Get job view statistics for a company
   * Note: Consider moving to JobApi class
   */
  static getCompanyJobViewStatistics = async (
    companyId: string,
    dateRange: { startDate: Date; endDate: Date },
    timeFrame: string = "year"
  ) => {
    try {
      const response = await this.axios.get("/api/v1/job/company/view-statistics", {
        params: {
          companyId,
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          timeFrame,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching company job view statistics:", error);
      throw error;
    }
  };

  // ===============================================
  // COMPANY LISTING (for admin or public use)
  // ===============================================

  /**
   * Get all companies with pagination and filtering
   * GET /api/v1/companies?page=1&limit=10&search=term
   */
  static getAllCompanies = async ({
    page = 1,
    limit = 10,
    search,
    status,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  } = {}) => {
    try {
      const response = await this.axios.get("/api/v1/companies", {
        params: {
          page,
          limit,
          ...(search && { search }),
          ...(status && { status }),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all companies:", error);
      throw error;
    }
  };

  // ===============================================
  // LEGACY METHOD ALIASES (for backward compatibility)
  // Remove these after updating all components
  // ===============================================

  /**
   * @deprecated Use getCurrentUserCompany instead
   */
  static getMyCompany = CompanyApi.getCurrentUserCompany;

  /**
   * @deprecated Use getCompanyById instead
   */
  static get = CompanyApi.getCompanyById;

  /**
   * @deprecated Use getCompanyById instead
   */
  static getCompany = CompanyApi.getCompanyById;

  /**
   * @deprecated Use uploadCompanyLogo instead
   */
  static upLoadCompanyLogo = CompanyApi.uploadCompanyLogo;

  /**
   * @deprecated Use getCompanyAssetByKey instead
   */
  static getCompanyAsset = CompanyApi.getCompanyAssetByKey;

  /**
   * @deprecated Use getCompanyAssetByKey instead
   */
  static getUploadedFIle = CompanyApi.getCompanyAssetByKey;

  /**
   * @deprecated Use getCompanyFilesBatch instead
   */
  static getCompanyFiles = CompanyApi.getCompanyFilesBatch;

  /**
   * @deprecated Use uploadCompanyVerificationDocs instead
   */
  static uploadVerificationDocs = CompanyApi.uploadCompanyVerificationDocs;

  /**
   * @deprecated Use generateCompanyAccessToken instead
   */
  static generateAccessToken = CompanyApi.generateCompanyAccessToken;

  /**
   * @deprecated Use getCurrentCompanyEmployees instead
   */
  static getMyCompanyEmployees = CompanyApi.getCurrentCompanyEmployees;

  /**
   * @deprecated Use addEmployeeToCompany instead
   */
  static addEmployee = CompanyApi.addEmployeeToCompany;

  /**
   * @deprecated Use addSpecificEmployeeToCompany instead
   */
  static addSpecificEmployee = CompanyApi.addSpecificEmployeeToCompany;

  /**
   * @deprecated Use getJobApplications instead
   */
  static getApplicationsByJob = CompanyApi.getJobApplications;

  /**
   * @deprecated Use getCompanyJobStatistics instead
   */
  static getJobStatistics = CompanyApi.getCompanyJobStatistics;

  /**
   * @deprecated Use getCompanyJobViewStatistics instead
   */
  static getJobViewStatistics = CompanyApi.getCompanyJobViewStatistics;

  /**
   * @deprecated Use getAllCompanies instead
   */
  static getCompanies = CompanyApi.getAllCompanies;
}

export { CompanyApi };