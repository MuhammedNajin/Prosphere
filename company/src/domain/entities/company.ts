import { BadRequestError } from "@muhammednajinnprosphere/common";
import { ILocationPoint } from "@/shared/types/shared-types";
import {
  ICompany,
  ICompanyVerificationDoc,
  IOwnerVerificationDoc,
  IStatusHistoryEntry,
  ITeamMember,
  ICompanySocialLinks,
  ICompanyContact,
  CompanyType,
  CompanySize
} from "../interface/ICompany";
import { CompanyStatus, TeamRole } from "@/shared/constance";

/**
 * @class Company
 * @implements {ICompany}
 * @description Represents a company entity with comprehensive business logic
 */
export class Company implements ICompany {
  // Core Company Information
  private _id: string;
  private _name: string;
  private _slug?: string;
  private _website?: string;
  private _industry: string;
  private _type?: CompanyType;
  private _size?: CompanySize;

  // Location Information
  private _headquarters?: ILocationPoint;
  private _locations: ILocationPoint[];

  // Company Details
  private _foundedDate?: Date;
  private _techStack?: string[];
  private _description?: string;
  private _mission?: string;
  private _vision?: string;
  private _values?: string[];

  // Media & Branding
  private _logo?: string;
  private _coverImage?: string;
  private _gallery?: string[];

  // Social & Contact
  private _socialLinks?: ICompanySocialLinks;
  private _contact?: ICompanyContact;

  // Team Management
  private _team: ITeamMember[]; // Made required, initialized as empty array
  private _owner: string;

  // Verification & Documents - FIXED: These should be single objects, not arrays
  private _verified: boolean;
  private _companyVerificationDoc?: ICompanyVerificationDoc;
  private _ownerVerificationDoc?: IOwnerVerificationDoc;
  private _verifiedAt?: Date;
  private _verifiedBy?: string;
  private _reUploadDocLimit: number;

  // Status Management
  private _status: CompanyStatus;
  private _statusHistory: IStatusHistoryEntry[]; // Made required

  // SEO & Discovery
  private _tags: string[]; // Made required
  private _featured: boolean;

  // Analytics & Metrics
  private _viewCount: number; // Made required
  private _followerCount: number; // Made required

  // Metadata
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt?: Date;

  private constructor(data: Partial<ICompany>) {
    // Core required fields validation with better error messages
    if (!data.id?.trim()) throw new BadRequestError("Company ID is required and cannot be empty");
    if (!data.name?.trim()) throw new BadRequestError("Company name is required and cannot be empty");
    if (!data.industry?.trim()) throw new BadRequestError("Industry is required and cannot be empty");
    if (!data.owner?.trim()) throw new BadRequestError("Owner ID is required and cannot be empty");
    if (!data.locations || data.locations.length === 0) {
      throw new BadRequestError("At least one location is required");
    }
    if (!data.status || !Object.values(CompanyStatus).includes(data.status)) {
      throw new BadRequestError("Valid company status is required");
    }

    // Core Company Information
    this._id = data.id.trim();
    this._name = data.name.trim();
    this._slug = data.slug || this.generateSlug(data.name);
    this._website = data.website?.trim();
    this._industry = data.industry.trim();
    this._type = data.type;
    this._size = data.size;

    // Location Information
    this._headquarters = data.headquarters;
    this._locations = [...data.locations]; // Create defensive copy

    // Company Details
    this._foundedDate = data.foundedDate;
    this._techStack = data.techStack ? [...data.techStack] : [];
    this._description = data.description?.trim();
    this._mission = data.mission?.trim();
    this._vision = data.vision?.trim();
    this._values = data.values ? [...data.values] : [];

    // Media & Branding
    this._logo = data.logo?.trim();
    this._coverImage = data.coverImage?.trim();
    this._gallery = data.gallery ? [...data.gallery] : [];

    // Social & Contact
    this._socialLinks = data.socialLinks;
    this._contact = data.contact;

    // Team Management
    this._team = data.team ? [...data.team] : [];
    this._owner = data.owner.trim();

    // Verification & Documents - FIXED: Initialize as single objects
    this._verified = data.verified ?? false;
    this._companyVerificationDoc = data.companyVerificationDoc;
    this._ownerVerificationDoc = data.ownerVerificationDoc;
    this._verifiedAt = data.verifiedAt;
    this._verifiedBy = data.verifiedBy?.trim();
    this._reUploadDocLimit = data.reUploadDocLimit ?? 3;

    // Status Management
    this._status = data.status;
    this._statusHistory = data.statusHistory ? [...data.statusHistory] : [];

    // SEO & Discovery
    this._tags = data.tags ? [...data.tags] : [];
    this._featured = data.featured ?? false;

    // Analytics & Metrics
    this._viewCount = data.viewCount ?? 0;
    this._followerCount = data.followerCount ?? 0;

    // Metadata
    this._createdAt = data.createdAt || new Date();
    this._updatedAt = data.updatedAt || new Date();
    this._deletedAt = data.deletedAt;

    // Validate website URL if provided
    if (this._website && !this.isValidUrl(this._website)) {
      throw new BadRequestError("Invalid website URL format");
    }
  }

  // --- CORE GETTERS ---
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get slug(): string | undefined { return this._slug; }
  get website(): string | undefined { return this._website; }
  get industry(): string { return this._industry; }
  get type(): CompanyType | undefined { return this._type; }
  get size(): CompanySize | undefined { return this._size; }

  // --- LOCATION GETTERS ---
  get headquarters(): ILocationPoint | undefined { return this._headquarters; }
  get locations(): ILocationPoint[] { return [...this._locations]; } // Return defensive copy

  // --- COMPANY DETAILS GETTERS ---
  get foundedDate(): Date | undefined { return this._foundedDate; }
  get techStack(): string[] | undefined { return this._techStack ? [...this._techStack] : undefined; }
  get description(): string | undefined { return this._description; }
  get mission(): string | undefined { return this._mission; }
  get vision(): string | undefined { return this._vision; }
  get values(): string[] | undefined { return this._values ? [...this._values] : undefined; }

  // --- MEDIA GETTERS ---
  get logo(): string | undefined { return this._logo; }
  get coverImage(): string | undefined { return this._coverImage; }
  get gallery(): string[] | undefined { return this._gallery ? [...this._gallery] : undefined; }

  // --- SOCIAL & CONTACT GETTERS ---
  get socialLinks(): ICompanySocialLinks | undefined { return this._socialLinks; }
  get contact(): ICompanyContact | undefined { return this._contact; }

  // --- TEAM GETTERS ---
  get team(): ITeamMember[] | undefined { return [...this._team]; } // Return defensive copy
  get owner(): string { return this._owner; }

  // --- VERIFICATION GETTERS ---
  get verified(): boolean { return this._verified; }
  get companyVerificationDoc(): ICompanyVerificationDoc | undefined { 
    return this._companyVerificationDoc
  }
  get ownerVerificationDoc(): IOwnerVerificationDoc | undefined { 
    return this._ownerVerificationDoc
  }
  get verifiedAt(): Date | undefined { return this._verifiedAt; }
  get verifiedBy(): string | undefined { return this._verifiedBy; }
  get reUploadDocLimit(): number { return this._reUploadDocLimit; }

  // --- STATUS GETTERS ---
  get status(): CompanyStatus { return this._status; }
  get statusHistory(): IStatusHistoryEntry[] | undefined { return [...this._statusHistory]; }

  // --- SEO & DISCOVERY GETTERS ---
  get tags(): string[] | undefined { return [...this._tags]; }
  get featured(): boolean { return this._featured; }

  // --- ANALYTICS GETTERS ---
  get viewCount(): number { return this._viewCount; }
  get followerCount(): number { return this._followerCount; }

  // --- METADATA GETTERS ---
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get deletedAt(): Date | undefined { return this._deletedAt; }

  // --- CORE SETTERS ---
  set name(value: string) {
    if (!value?.trim()) throw new BadRequestError("Company name is required and cannot be empty");
    this._name = value.trim();
    this._slug = this.generateSlug(value);
    this.touch();
  }

  set website(value: string | undefined) {
    if (value) {
      const trimmedValue = value.trim();
      if (trimmedValue && !this.isValidUrl(trimmedValue)) {
        throw new BadRequestError("Invalid website URL format");
      }
      this._website = trimmedValue || undefined;
    } else {
      this._website = undefined;
    }
    this.touch();
  }

  set industry(value: string) {
    if (!value?.trim()) throw new BadRequestError("Industry is required and cannot be empty");
    this._industry = value.trim();
    this.touch();
  }

  set type(value: CompanyType | undefined) {
    this._type = value;
    this.touch();
  }

  set size(value: CompanySize | undefined) {
    this._size = value;
    this.touch();
  }

  // --- LOCATION SETTERS ---
  set headquarters(value: ILocationPoint | undefined) {
    this._headquarters = value;
    this.touch();
  }

  set locations(value: ILocationPoint[]) {
    if (!value || value.length === 0) {
      throw new BadRequestError("At least one location is required");
    }
    this._locations = [...value]; // Create defensive copy
    this.touch();
  }

  // --- COMPANY DETAILS SETTERS ---
  set description(value: string | undefined) {
    this._description = value?.trim() || undefined;
    this.touch();
  }

  set mission(value: string | undefined) {
    this._mission = value?.trim() || undefined;
    this.touch();
  }

  set vision(value: string | undefined) {
    this._vision = value?.trim() || undefined;
    this.touch();
  }

  set values(value: string[] | undefined) {
    this._values = value ? [...value] : undefined;
    this.touch();
  }

  set logo(value: string | undefined) {
    this._logo = value?.trim() || undefined;
    this.touch();
  }

  set coverImage(value: string | undefined) {
    this._coverImage = value?.trim() || undefined;
    this.touch();
  }

  set socialLinks(value: ICompanySocialLinks | undefined) {
    this._socialLinks = value;
    this.touch();
  }

  set contact(value: ICompanyContact | undefined) {
    this._contact = value;
    this.touch();
  }

  // --- TEAM MANAGEMENT METHODS ---
  public addTeamMember(member: ITeamMember): void {
    if (!member.userId?.trim()) {
      throw new BadRequestError("User ID is required for team member");
    }

    const existingMemberIndex = this._team.findIndex(m => m.userId === member.userId);
    if (existingMemberIndex !== -1) {
      throw new BadRequestError("User is already a team member");
    }

    this._team.push({
      ...member,
      userId: member.userId.trim(),
      joinedAt: new Date(),
      isActive: member.isActive ?? true
    });
    this.touch();
  }

  public updateTeamMember(userId: string, updates: Partial<ITeamMember>): void {
    if (!userId?.trim()) {
      throw new BadRequestError("User ID is required");
    }

    const memberIndex = this._team.findIndex(m => m.userId === userId.trim());
    if (memberIndex === -1) {
      throw new BadRequestError("Team member not found");
    }

    this._team[memberIndex] = { ...this._team[memberIndex], ...updates };
    this.touch();
  }

  public removeTeamMember(userId: string): void {
    if (!userId?.trim()) {
      throw new BadRequestError("User ID is required");
    }

    if (userId.trim() === this._owner) {
      throw new BadRequestError("Cannot remove company owner from team");
    }

    const memberIndex = this._team.findIndex(m => m.userId === userId.trim());
    if (memberIndex !== -1) {
      this._team.splice(memberIndex, 1);
      this.touch();
    }
  }

  public deactivateTeamMember(userId: string): void {
    if (!userId?.trim()) {
      throw new BadRequestError("User ID is required");
    }

    const member = this._team.find(m => m.userId === userId.trim());
    if (!member) {
      throw new BadRequestError("Team member not found");
    }

    member.isActive = false;
    this.touch();
  }

  public activateTeamMember(userId: string): void {
    if (!userId?.trim()) {
      throw new BadRequestError("User ID is required");
    }

    const member = this._team.find(m => m.userId === userId.trim());
    if (!member) {
      throw new BadRequestError("Team member not found");
    }

    member.isActive = true;
    this.touch();
  }

  // --- VERIFICATION METHODS - FIXED: Methods now work with single objects ---
  public setCompanyVerificationDoc(doc: ICompanyVerificationDoc): void {
    if (!doc.documentUrl?.trim()) {
      throw new BadRequestError("Document URL is required for verification document");
    }

    this._companyVerificationDoc = {
      ...doc,
      documentUrl: doc.documentUrl.trim()
    };
    this.touch();
  }

  public setOwnerVerificationDoc(doc: IOwnerVerificationDoc): void {
    if (!doc.documentUrl?.trim()) {
      throw new BadRequestError("Document URL is required for verification document");
    }

    this._ownerVerificationDoc = {
      ...doc,
      documentUrl: doc.documentUrl.trim()
    };
    this.touch();
  }

  // FIXED: Remove the old array-based methods since docs are single objects
  public clearCompanyVerificationDoc(): void {
    this._companyVerificationDoc = undefined;
    this.touch();
  }

  public clearOwnerVerificationDoc(): void {
    this._ownerVerificationDoc = undefined;
    this.touch();
  }

  public verify(verifiedBy?: string): void {
    this._verified = true;
    this._verifiedAt = new Date();
    this._verifiedBy = verifiedBy?.trim();
    this.updateStatus(CompanyStatus.ACTIVE, "Company verified", verifiedBy);
  }

  public unverify(reason?: string, unverifiedBy?: string): void {
    this._verified = false;
    this._verifiedAt = undefined;
    this._verifiedBy = undefined;
    this.updateStatus(CompanyStatus.UNDER_REVIEW, reason || "Verification revoked", unverifiedBy);
  }

  // --- STATUS MANAGEMENT ---
  public updateStatus(newStatus: CompanyStatus, reason?: string, updatedBy?: string): void {
    if (!Object.values(CompanyStatus).includes(newStatus)) {
      throw new BadRequestError("Invalid company status");
    }

    const previousStatus = this._status;
    this._status = newStatus;

    const historyEntry: IStatusHistoryEntry = {
      id: this.generateId(),
      status: newStatus,
      previousStatus,
      reason: reason?.trim(),
      updatedAt: new Date(),
      updatedBy: updatedBy?.trim()
    };

    this._statusHistory.push(historyEntry);
    this.touch();
  }

  // --- SEO & DISCOVERY METHODS ---
  public addTag(tag: string): void {
    if (!tag?.trim()) {
      throw new BadRequestError("Tag is required and cannot be empty");
    }

    const normalizedTag = tag.trim().toLowerCase();
    const tagExists = this._tags.some(t => t.toLowerCase() === normalizedTag);

    if (tagExists) {
      throw new BadRequestError("Tag already exists");
    }

    this._tags.push(tag.trim());
    this.touch();
  }

  public removeTag(tag: string): void {
    if (!tag?.trim()) return;

    const normalizedTag = tag.trim().toLowerCase();
    this._tags = this._tags.filter(t => t.toLowerCase() !== normalizedTag);
    this.touch();
  }

  public setFeatured(featured: boolean, updatedBy?: string): void {
    this._featured = featured;
    this.updateStatus(
      this._status,
      featured ? "Company featured" : "Company unfeatured",
      updatedBy
    );
  }

  // --- ANALYTICS METHODS ---
  public incrementViewCount(): void {
    this._viewCount = Math.max(0, this._viewCount + 1);
    // Don't call touch() for view counts to avoid unnecessary updates
  }

  public updateFollowerCount(count: number): void {
    if (count < 0) {
      throw new BadRequestError("Follower count cannot be negative");
    }
    this._followerCount = count;
    this.touch();
  }

  // --- UTILITY METHODS ---
  private touch(): void {
    this._updatedAt = new Date();
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private isValidUrl(url: string): boolean {
    try {
      // Handle URLs with or without protocol
      const urlToTest = url.startsWith('http') ? url : `https://${url}`;
      new URL(urlToTest);
      return true;
    } catch {
      return false;
    }
  }

  // --- BUSINESS LOGIC METHODS ---
  public canUserManage(userId: string): boolean {
    if (!userId?.trim()) return false;
    
    const trimmedUserId = userId.trim();
    return this._owner === trimmedUserId || 
           this._team.some(member => 
             member.userId === trimmedUserId && 
             member.isActive && 
             (member.role === TeamRole.ADMIN || member.role === TeamRole.MANAGER)
           );
  }

  public isActive(): boolean {
    return this._status === CompanyStatus.ACTIVE && !this._deletedAt;
  }

  public isPending(): boolean {
    return this._status === CompanyStatus.PENDING;
  }

  public isUnderReview(): boolean {
    return this._status === CompanyStatus.UNDER_REVIEW;
  }

  public isSuspended(): boolean {
    return this._status === CompanyStatus.SUSPENDED;
  }

  public getActiveTeamMembers(): ITeamMember[] {
    return this._team.filter(member => member.isActive);
  }

  public getTeamSize(): number {
    return this.getActiveTeamMembers().length;
  }

  // FIXED: Updated to work with single document objects
  public hasReachedDocumentUploadLimit(): boolean {
    const totalDocs = (this._companyVerificationDoc ? 1 : 0) + (this._ownerVerificationDoc ? 1 : 0);
    return totalDocs >= this._reUploadDocLimit;
  }

  public getCompanyAge(): number | null {
    if (!this._foundedDate) return null;
    
    const now = new Date();
    const diffTime = now.getTime() - this._foundedDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  }

  // --- SOFT DELETE ---
  public softDelete(): void {
    this._deletedAt = new Date();
    this.updateStatus(CompanyStatus.INACTIVE, "Company deleted");
  }

  public restore(): void {
    this._deletedAt = undefined;
    this.updateStatus(CompanyStatus.ACTIVE, "Company restored");
  }

  public isDeleted(): boolean {
    return !!this._deletedAt;
  }

  // --- PROFILE UPDATE ---
  public updateProfile(attrs: Partial<ICompany>): void {
    // Use existing setters for validation
    if (attrs.name !== undefined) this.name = attrs.name;
    if (attrs.description !== undefined) this.description = attrs.description;
    if (attrs.website !== undefined) this.website = attrs.website;
    if (attrs.mission !== undefined) this.mission = attrs.mission;
    if (attrs.vision !== undefined) this.vision = attrs.vision;
    if (attrs.values !== undefined) this.values = attrs.values;
    if (attrs.logo !== undefined) this.logo = attrs.logo;
    if (attrs.coverImage !== undefined) this.coverImage = attrs.coverImage;
    if (attrs.socialLinks !== undefined) this.socialLinks = attrs.socialLinks;
    if (attrs.contact !== undefined) this.contact = attrs.contact;
    if (attrs.locations !== undefined) this.locations = attrs.locations;
    if (attrs.headquarters !== undefined) this.headquarters = attrs.headquarters;
    if (attrs.type !== undefined) this.type = attrs.type;
    if (attrs.size !== undefined) this.size = attrs.size;
    if (attrs.industry !== undefined) this.industry = attrs.industry;
    
    // Handle arrays with proper defensive copying
    if (attrs.techStack !== undefined) {
      this._techStack = attrs.techStack ? [...attrs.techStack] : [];
      this.touch();
    }
    if (attrs.gallery !== undefined) {
      this._gallery = attrs.gallery ? [...attrs.gallery] : [];
      this.touch();
    }
  }

  // --- FACTORY METHOD ---
  public static create(data: Partial<ICompany>): Company {
    console.log("Creating company with data:", data);
    return new Company(data);
  }

  // --- SERIALIZATION - FIXED: No more spread operator on non-arrays ---
  public toObject(): ICompany {
    return {
      id: this._id,
      name: this._name,
      slug: this._slug,
      website: this._website,
      industry: this._industry,
      type: this._type,
      size: this._size,
      headquarters: this._headquarters,
      locations: [...this._locations], // Defensive copy
      foundedDate: this._foundedDate,
      techStack: this._techStack ? [...this._techStack] : undefined,
      description: this._description,
      mission: this._mission,
      vision: this._vision,
      values: this._values ? [...this._values] : undefined,
      logo: this._logo,
      coverImage: this._coverImage,
      gallery: this._gallery ? [...this._gallery] : undefined,
      socialLinks: this._socialLinks,
      contact: this._contact,
      team: [...this._team],
      owner: this._owner,
      verified: this._verified,
      companyVerificationDoc: this._companyVerificationDoc, // Single object, not array
      ownerVerificationDoc: this._ownerVerificationDoc, // Single object, not array
      verifiedAt: this._verifiedAt,
      verifiedBy: this._verifiedBy,
      reUploadDocLimit: this._reUploadDocLimit,
      status: this._status,
      statusHistory: [...this._statusHistory],
      tags: [...this._tags],
      featured: this._featured,
      viewCount: this._viewCount,
      followerCount: this._followerCount,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }

  public toDTO() {
    return {
      _id: this._id,
      name: this._name,
      slug: this._slug,
      website: this._website,
      industry: this._industry,
      type: this._type,
      size: this._size,
      headquarters: this._headquarters,
      locations: [...this._locations],
      foundedDate: this._foundedDate,
      techStack: this._techStack ? [...this._techStack] : undefined,
      description: this._description,
      mission: this._mission,
      vision: this._vision,
      values: this._values ? [...this._values] : undefined,
      logo: this._logo,
      coverImage: this._coverImage,
      gallery: this._gallery ? [...this._gallery] : undefined,
      socialLinks: this._socialLinks,
      contact: this._contact,
      team: [...this._team],
      owner: this._owner,
      verified: this._verified,
      companyVerificationDoc: this._companyVerificationDoc, // FIXED: Single object, not array
      ownerVerificationDoc: this._ownerVerificationDoc, // FIXED: Single object, not array
      verifiedAt: this._verifiedAt,
      verifiedBy: this._verifiedBy,
      reUploadDocLimit: this._reUploadDocLimit,
      status: this._status,
      statusHistory: [...this._statusHistory],
      tags: [...this._tags],
      featured: this._featured,
      viewCount: this._viewCount,
      followerCount: this._followerCount,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }

  public toJSON(): ICompany {
    return this.toObject();
  }
}