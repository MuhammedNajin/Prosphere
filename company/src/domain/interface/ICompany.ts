import { CompanyStatus, TeamRole } from "@/shared/constance";
import { ILocationPoint } from "@/shared/types/shared-types";

/**
 * Enum for company sizes
 */
export enum CompanySize {
  STARTUP = "1-10",
  SMALL = "11-50", 
  MEDIUM = "51-200",
  LARGE = "201-1000",
  ENTERPRISE = "1001+"
}

/**
 * Enum for company types
 */
export enum CompanyType {
  STARTUP = "Startup",
  PUBLIC = "Public Company",
  PRIVATE = "Private Company",
  NON_PROFIT = "Non-Profit",
  GOVERNMENT = "Government",
  EDUCATIONAL = "Educational Institution",
  SELF_EMPLOYED = "Self-Employed",
  PARTNERSHIP = "Partnership"
}

/**
 * Enum for document types
 */
export enum DocumentType {
  BUSINESS_LICENSE = "Business License",
  INCORPORATION_CERTIFICATE = "Incorporation Certificate", 
  TAX_CERTIFICATE = "Tax Certificate",
  TRADE_LICENSE = "Trade License",
  PASSPORT = "Passport",
  NATIONAL_ID = "National ID",
  DRIVER_LICENSE = "Driver's License",
  OTHER = "Other"
}

/**
 * @interface ICompanyVerificationDoc
 * @description Company verification document details
 */
export interface ICompanyVerificationDoc {
  documentType: DocumentType;
  documentUrl: string;
  documentName?: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

/**
 * @interface ITeamMember
 * @description Team member information
 */
export interface ITeamMember {
  id: string;
  userId: string;
  role: TeamRole;
  permissions?: string[];
  joinedAt: Date;
  isActive: boolean;
  invitedBy?: string;
  invitedAt?: Date;
}

/**
 * @interface IOwnerVerificationDoc
 * @description Owner verification document details
 */
export interface IOwnerVerificationDoc {
  documentType: DocumentType;
  documentUrl: string;
  documentName?: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

/**
 * @interface IStatusHistoryEntry
 * @description Company status change history
 */
export interface IStatusHistoryEntry {
  id: string;
  status: CompanyStatus;
  previousStatus?: CompanyStatus;
  reason?: string;
  updatedAt: Date;
  updatedBy?: string; // Admin or system user who made the change
  notes?: string;
}

/**
 * @interface ICompanySocialLinks
 * @description Company social media and professional links
 */
export interface ICompanySocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  github?: string;
  website?: string;
  blog?: string;
  other?: { [platform: string]: string };
}

/**
 * @interface ICompanyContact
 * @description Company contact information
 */
export interface ICompanyContact {
  email?: string;
  phone?: string;
  fax?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

/**
 * @interface ICompanyFinancials
 * @description Company financial information (optional)
 */
export interface ICompanyFinancials {
  revenue?: {
    amount?: number;
    currency?: string;
    year?: number;
  };
  funding?: {
    totalRaised?: number;
    currency?: string;
    lastRoundDate?: Date;
    lastRoundAmount?: number;
    investors?: string[];
  };
}

/**
 * @interface ICompany
 * @description Complete company profile structure
 */
export interface ICompany {
  id: string;
  name: string;
  slug?: string;
  website?: string;
  industry: string;
  type?: CompanyType;
  size?: CompanySize;
  
  // Location Information
  headquarters?: ILocationPoint;
  locations: ILocationPoint[];
  
  // Company Details
  foundedDate?: Date;
  techStack?: string[];
  description?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  
  // Media & Branding
  logo?: string;
  coverImage?: string;
  gallery?: string[];
  
  // Social & Contact
  socialLinks?: ICompanySocialLinks;
  contact?: ICompanyContact;
  
  // Team Management
  team?: ITeamMember[];
  owner: string; // User ID of the company owner
  
  // Verification & Documents
  verified: boolean;
  companyVerificationDoc?: ICompanyVerificationDoc;
  ownerVerificationDoc?: IOwnerVerificationDoc;
  verifiedAt?: Date;
  verifiedBy?: string; // Admin who verified
  reUploadDocLimit: number;
  
  // Status Management
  status: CompanyStatus;
  statusHistory?: IStatusHistoryEntry[];
  
  // Financial Information (optional)
  financials?: ICompanyFinancials;
  
  // SEO & Discovery
  tags?: string[];
  featured: boolean;
  
  // Analytics & Metrics
  viewCount?: number;
  followerCount?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Soft delete
}

/**
 * @interface ICompanyCreateInput
 * @description Input for creating a new company
 */
export interface ICompanyCreateInput {
  name: string;
  website?: string;
  industry: string;
  type?: CompanyType;
  size?: CompanySize;
  headquarters?: ILocationPoint;
  locations?: ILocationPoint[];
  foundedDate?: Date;
  description?: string;
  logo?: string;
  owner: string;
  socialLinks?: ICompanySocialLinks;
  contact?: ICompanyContact;
}

/**
 * @interface ICompanyUpdateInput  
 * @description Input for updating company information
 */
export interface ICompanyUpdateInput {
  name?: string;
  website?: string;
  industry?: string;
  type?: CompanyType;
  size?: CompanySize;
  headquarters?: ILocationPoint;
  locations?: ILocationPoint[];
  foundedDate?: Date;
  techStack?: string[];
  description?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  logo?: string;
  coverImage?: string;
  socialLinks?: ICompanySocialLinks;
  contact?: ICompanyContact;
  tags?: string[];
}

/**
 * @interface ICompanyPublicProfile
 * @description Public view of company (for job seekers, etc.)
 */
export interface ICompanyPublicProfile {
  id: string;
  name: string;
  slug?: string;
  website?: string;
  industry: string;
  type?: CompanyType;
  size?: CompanySize;
  headquarters?: Omit<ILocationPoint, 'coordinates'>;
  locations?: Omit<ILocationPoint, 'coordinates'>[];
  foundedDate?: Date;
  description?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  logo?: string;
  coverImage?: string;
  gallery?: string[];
  socialLinks?: ICompanySocialLinks;
  contact?: Omit<ICompanyContact, 'email' | 'phone'>; // Hide private contact info
  verified: boolean;
  tags?: string[];
  featured: boolean;
  viewCount?: number;
  followerCount?: number;
  createdAt: Date;
}

/**
 * @interface ICompanySearchFilters
 * @description Filters for searching companies
 */
export interface ICompanySearchFilters {
  industry?: string[];
  type?: CompanyType[];
  size?: CompanySize[];
  location?: {
    city?: string;
    state?: string; 
    country?: string;
    radius?: number;
  };
  techStack?: string[];
  verified?: boolean;
  featured?: boolean;
  status?: CompanyStatus[];
  foundedAfter?: Date;
  foundedBefore?: Date;
  tags?: string[];
}

/**
 * @interface ICompanyStats
 * @description Company statistics and analytics
 */
export interface ICompanyStats {
  companyId: string;
  profileViews: number;
  jobPostings: number;
  activeJobPostings: number;
  totalApplications: number;
  teamSize: number;
  verificationStatus: string;
  lastActivity: Date;
}