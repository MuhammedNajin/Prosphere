import { BadRequestError, UserRole } from "@muhammednajinnprosphere/common";
import {
  IEducation,
  IExperience,
  ILocation,
  ISkill,
  IUser,
  ISocialLinks,
  IPreferences,
} from "../interface/IUser";

/**
 * @class User
 * @implements {IUser}
 * @description Represents a comprehensive user profile with authentication and professional data.
 */
export class User implements IUser {
  // Core Authentication Fields
  private _id: string;
  private _username: string;
  private _email: string;
  private _phone: string;
  private _role: UserRole;
  private _isVerified: boolean;
  
  // Profile Fields
  private _firstName?: string;
  private _lastName?: string;
  private _headline?: string;
  private _about?: string;
  private _location?: ILocation;
  
  // Media Fields
  private _profileImageKey?: string;
  private _coverImageKey?: string;
  private _resumeKeys?: string[];
  
  // Professional Fields
  private _experience?: IExperience[];
  private _education?: IEducation[];
  private _skills?: ISkill[];
  
  // Social & Contact
  private _socialLinks?: ISocialLinks;
  
  // Business Fields
  private _managedCompanies?: string[];
  
  // User Preferences
  private _preferences?: IPreferences;
  
  // Status Fields
  private _isActive: boolean;
  private _lastLoginAt?: Date;
  private _emailVerifiedAt?: Date;
  private _phoneVerifiedAt?: Date;
  
  // Metadata
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(data: Partial<IUser>) {
    // Core required fields validation
    if (!data.id) throw new Error("User ID is required");
    if (!data.username) throw new Error("Username is required");
    if (!data.phone) throw new Error("phone is required");
    if (!data.email) throw new Error("Email is required");
    if (!data.role || !Object.values(UserRole).includes(data.role)) {
      throw new Error("Valid user role is required");
    }

    // Core Authentication Fields
    this._id = data.id;
    this._username = data.username;
    this._email = data.email;
    this._phone = data.phone;
    this._role = data.role;
    this._isVerified = data.isVerified ?? false;
    
    // Profile Fields
    this._firstName = data.firstName;
    this._lastName = data.lastName;
    this._headline = data.headline;
    this._about = data.about;
    this._location = data.location;
    
    // Media Fields
    this._profileImageKey = data.profileImageKey;
    this._coverImageKey = data.coverImageKey;
    this._resumeKeys = data.resumeKeys || [];
    
    // Professional Fields
    this._experience = data.experience || [];
    this._education = data.education || [];
    this._skills = data.skills || [];
    
    // Social & Contact
    this._socialLinks = data.socialLinks;
    
    // Business Fields
    this._managedCompanies = data.managedCompanies || [];
    
    // User Preferences
    this._preferences = data.preferences;
    
    // Status Fields
    this._isActive = data.isActive ?? true;
    this._lastLoginAt = data.lastLoginAt;
    this._emailVerifiedAt = data.emailVerifiedAt;
    this._phoneVerifiedAt = data.phoneVerifiedAt;
    
    // Metadata
    this._createdAt = data.createdAt || new Date();
    this._updatedAt = data.updatedAt || new Date();
  }

  // --- CORE GETTERS ---
  get id(): string {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get role(): UserRole {
    return this._role;
  }

  get isVerified(): boolean {
    return this._isVerified;
  }

  // --- PROFILE GETTERS ---
  get firstName(): string | undefined {
    return this._firstName;
  }

  get lastName(): string | undefined {
    return this._lastName;
  }

  get headline(): string | undefined {
    return this._headline;
  }

  get about(): string | undefined {
    return this._about;
  }

  get location(): ILocation | undefined {
    return this._location;
  }

  // --- MEDIA GETTERS ---
  get profileImageKey(): string | undefined {
    return this._profileImageKey;
  }

  get coverImageKey(): string | undefined {
    return this._coverImageKey;
  }

  get resumeKeys(): string[] | undefined {
    return this._resumeKeys;
  }

  // --- PROFESSIONAL GETTERS ---
  get experience(): IExperience[] | undefined {
    return this._experience;
  }

  get education(): IEducation[] | undefined {
    return this._education;
  }

  get skills(): ISkill[] | undefined {
    return this._skills;
  }

  // --- SOCIAL & CONTACT GETTERS ---
  get socialLinks(): ISocialLinks | undefined {
    return this._socialLinks;
  }

  // --- BUSINESS GETTERS ---
  get managedCompanies(): string[] | undefined {
    return this._managedCompanies;
  }

  // --- PREFERENCES GETTERS ---
  get preferences(): IPreferences | undefined {
    return this._preferences;
  }

  // --- STATUS GETTERS ---
  get isActive(): boolean {
    return this._isActive;
  }

  get lastLoginAt(): Date | undefined {
    return this._lastLoginAt;
  }

  get emailVerifiedAt(): Date | undefined {
    return this._emailVerifiedAt;
  }

  get phoneVerifiedAt(): Date | undefined {
    return this._phoneVerifiedAt;
  }

  // --- METADATA GETTERS ---
  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // --- CORE SETTERS ---
  set username(value: string) {
    if (!value?.trim()) throw new Error("Username is required");
    this._username = value.trim();
    this.touch();
  }

  set email(value: string) {
    if (!value?.trim()) throw new Error("Email is required");
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) throw new Error("Invalid email format");
    this._email = value.trim().toLowerCase();
    this.touch();
  }

  set phone(value: string) {
    this._phone = value?.trim();
    this.touch();
  }

  set role(value: UserRole) {
    if (!Object.values(UserRole).includes(value)) {
      throw new Error("Invalid user role");
    }
    this._role = value;
    this.touch();
  }

  set isVerified(value: boolean) {
    this._isVerified = value;
    this.touch();
  }

  // --- PROFILE SETTERS ---
  set firstName(value: string | undefined) {
    this._firstName = value?.trim() || undefined;
    this.touch();
  }

  set lastName(value: string | undefined) {
    this._lastName = value?.trim() || undefined;
    this.touch();
  }

  set headline(value: string | undefined) {
    this._headline = value?.trim() || undefined;
    this.touch();
  }

  set about(value: string | undefined) {
    this._about = value?.trim() || undefined;
    this.touch();
  }

  set location(value: ILocation | undefined) {
    this._location = value;
    this.touch();
  }

  // --- MEDIA SETTERS ---
  set profileImageKey(value: string | undefined) {
    this._profileImageKey = value?.trim() || undefined;
    this.touch();
  }

  set coverImageKey(value: string | undefined) {
    this._coverImageKey = value?.trim() || undefined;
    this.touch();
  }

  // --- SOCIAL & CONTACT SETTERS ---
  set socialLinks(value: ISocialLinks | undefined) {
    this._socialLinks = value;
    this.touch();
  }

  // --- PREFERENCES SETTERS ---
  set preferences(value: IPreferences | undefined) {
    this._preferences = value;
    this.touch();
  }

  // --- STATUS SETTERS ---
  set isActive(value: boolean) {
    this._isActive = value;
    this.touch();
  }

  set lastLoginAt(value: Date | undefined) {
    this._lastLoginAt = value;
    this.touch();
  }

  // --- BUSINESS METHODS ---
  public addManagedCompany(companyId: string): void {
    if (!companyId?.trim()) {
      throw new BadRequestError("Company ID is required");
    }
    
    const isAlreadyManaged = this._managedCompanies?.includes(companyId.trim());
    if (isAlreadyManaged) {
      throw new BadRequestError("Company is already being managed by this user");
    }
    
    this._managedCompanies?.push(companyId.trim());
    this.touch();
  }

  public removeManagedCompany(companyId: string): void {
    if (!companyId?.trim()) {
      throw new BadRequestError("Company ID is required");
    }
    
    const index = this._managedCompanies?.indexOf(companyId.trim());
    if (index !== undefined && index > -1) {
      this._managedCompanies?.splice(index, 1);
      this.touch();
    }
  }

  // --- PROFESSIONAL METHODS ---
  public addExperience(newExperience: IExperience): void {
    if (!newExperience.company?.trim()) {
      throw new BadRequestError("Company name is required");
    }
    if (!newExperience.title?.trim()) {
      throw new BadRequestError("Title is required");
    }
    if (newExperience.startDate > new Date()) {
      throw new BadRequestError("Start date cannot be in the future");
    }
    if (
      !newExperience.isCurrentRole &&
      newExperience.endDate &&
      newExperience.endDate < newExperience.startDate
    ) {
      throw new BadRequestError("End date must be after start date");
    }
    
    this._experience?.push(newExperience);
    this.touch();
  }

  public updateExperience(experienceId: string, updatedExperience: Partial<IExperience>): void {
    const index = this._experience?.findIndex(exp => exp.id === experienceId);
    if (index === undefined || index === -1) {
      throw new BadRequestError("Experience not found");
    }
    
    this._experience![index] = { ...this._experience![index], ...updatedExperience };
    this.touch();
  }

  public removeExperience(experienceId: string): void {
    const index = this._experience?.findIndex(exp => exp.id === experienceId);
    if (index !== undefined && index > -1) {
      this._experience?.splice(index, 1);
      this.touch();
    }
  }

  public addEducation(newEducation: IEducation): void {
    if (!newEducation.school?.trim()) {
      throw new BadRequestError("School name is required");
    }
    if (!newEducation.degree?.trim()) {
      throw new BadRequestError("Degree is required");
    }
    if (!newEducation.fieldOfStudy?.trim()) {
      throw new BadRequestError("Field of study is required");
    }
    if (newEducation.startDate > new Date()) {
      throw new BadRequestError("Start date cannot be in the future");
    }
    if (
      !newEducation.isCurrentStudent &&
      newEducation.endDate &&
      newEducation.endDate < newEducation.startDate
    ) {
      throw new BadRequestError("End date must be after start date");
    }
    
    this._education?.push(newEducation);
    this.touch();
  }

  public updateEducation(educationId: string, updatedEducation: Partial<IEducation>): void {
    const index = this._education?.findIndex(edu => edu.id === educationId);
    if (index === undefined || index === -1) {
      throw new BadRequestError("Education not found");
    }
    
    this._education![index] = { ...this._education![index], ...updatedEducation };
    this.touch();
  }

  public removeEducation(educationId: string): void {
    const index = this._education?.findIndex(edu => edu.id === educationId);
    if (index !== undefined && index > -1) {
      this._education?.splice(index, 1);
      this.touch();
    }
  }

  public addSkill(newSkill: ISkill): void {
    if (!newSkill.name?.trim()) {
      throw new BadRequestError("Skill name is required");
    }
    
    const skillExists = this._skills?.some(
      skill => skill.name.trim().toLowerCase() === newSkill.name.trim().toLowerCase()
    );
    
    if (skillExists) {
      throw new BadRequestError(`The skill "${newSkill.name}" already exists`);
    }
    
    this._skills?.push({
      ...newSkill,
      name: newSkill.name.trim()
    });
    this.touch();
  }

  public updateSkill(skillId: string, updatedSkill: Partial<ISkill>): void {
    const index = this._skills?.findIndex(skill => skill.id === skillId);
    if (index === undefined || index === -1) {
      throw new BadRequestError("Skill not found");
    }
    
    // Check for duplicate names if updating name
    if (updatedSkill.name) {
      const duplicateExists = this._skills?.some(
        (skill, idx) => 
          idx !== index && 
          skill.name.trim().toLowerCase() === updatedSkill.name!.trim().toLowerCase()
      );
      if (duplicateExists) {
        throw new BadRequestError(`The skill "${updatedSkill.name}" already exists`);
      }
    }
    
    this._skills![index] = { ...this._skills![index], ...updatedSkill };
    this.touch();
  }

  public removeSkill(skillId: string): void {
    const index = this._skills?.findIndex(skill => skill.id === skillId);
    if (index !== undefined && index > -1) {
      this._skills?.splice(index, 1);
      this.touch();
    }
  }

  public addResumeKey(resumeKey: string): void {
    if (!resumeKey?.trim()) {
      throw new BadRequestError("Resume key is required");
    }
    
    const keyExists = this._resumeKeys?.includes(resumeKey.trim());
    if (keyExists) {
      throw new BadRequestError("Resume key already exists");
    }
    
    this._resumeKeys?.push(resumeKey.trim());
    this.touch();
  }

  public removeResumeKey(resumeKey: string): void {
    if (!resumeKey?.trim()) {
      throw new BadRequestError("Resume key is required");
    }
    
    const index = this._resumeKeys?.indexOf(resumeKey.trim());
    if (index !== undefined && index > -1) {
      this._resumeKeys?.splice(index, 1);
      this.touch();
    }
  }

  // --- VERIFICATION METHODS ---
  public verify(): void {
    this._isVerified = true;
    this.touch();
  }

  public unverify(): void {
    this._isVerified = false;
    this.touch();
  }

  public markEmailVerified(): void {
    this._emailVerifiedAt = new Date();
    this.touch();
  }

  public markPhoneVerified(): void {
    this._phoneVerifiedAt = new Date();
    this.touch();
  }

  public recordLogin(): void {
    this._lastLoginAt = new Date();
    this.touch();
  }

  public activate(): void {
    this._isActive = true;
    this.touch();
  }

  public deactivate(): void {
    this._isActive = false;
    this.touch();
  }

  // --- UTILITY METHODS ---
  private touch(): void {
    this._updatedAt = new Date();
  }

  public getFullName(): string {
    const parts = [this._firstName, this._lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : this._username;
  }

  public getDisplayName(): string {
    return this.getFullName();
  }

  // --- FACTORY METHOD ---
  public static create(data: Partial<IUser>): User {
    return new User(data);
  }

  // --- SERIALIZATION ---
  public toObject(): IUser {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      phone: this.phone,
      role: this.role,
      isVerified: this.isVerified,
      firstName: this.firstName,
      lastName: this.lastName,
      headline: this.headline,
      about: this.about,
      location: this.location,
      profileImageKey: this.profileImageKey,
      coverImageKey: this.coverImageKey,
      resumeKeys: this.resumeKeys,
      experience: this.experience,
      education: this.education,
      skills: this.skills,
      socialLinks: this.socialLinks,
      managedCompanies: this.managedCompanies,
      preferences: this.preferences,
      isActive: this.isActive,
      lastLoginAt: this.lastLoginAt,
      emailVerifiedAt: this.emailVerifiedAt,
      phoneVerifiedAt: this.phoneVerifiedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public toDto() {
     return {
      _id: this.id,
      username: this.username,
      email: this.email,
      phone: this.phone,
      role: this.role,
      isVerified: this.isVerified,
      firstName: this.firstName,
      lastName: this.lastName,
      headline: this.headline,
      about: this.about,
      location: this.location,
      profileImageKey: this.profileImageKey,
      coverImageKey: this.coverImageKey,
      resumeKeys: this.resumeKeys,
      experience: this.experience,
      education: this.education,
      skills: this.skills,
      socialLinks: this.socialLinks,
      managedCompanies: this.managedCompanies,
      preferences: this.preferences,
      isActive: this.isActive,
      lastLoginAt: this.lastLoginAt,
      emailVerifiedAt: this.emailVerifiedAt,
      phoneVerifiedAt: this.phoneVerifiedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
     }
  }

  public toJSON(): IUser {
    return this.toObject();
  }

  // --- DOMAIN-SPECIFIC METHODS ---
  public hasRole(role: UserRole): boolean {
    return this._role === role;
  }

  public isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }

  public getProfileCompleteness(): number {
    let completedFields = 0;
    const totalFields = 15;

    // Core fields (always present)
    completedFields += 4; // id, username, email, role

    // Optional profile fields
    if (this._firstName) completedFields++;
    if (this._lastName) completedFields++;
    if (this._headline) completedFields++;
    if (this._about) completedFields++;
    if (this._location) completedFields++;
    if (this._profileImageKey) completedFields++;
    if (this._phone) completedFields++;
    if (this._experience && this._experience.length > 0) completedFields++;
    if (this._education && this._education.length > 0) completedFields++;
    if (this._skills && this._skills.length > 0) completedFields++;
    if (this._socialLinks) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }

  public getTotalExperienceYears(): number {
    if (!this._experience || this._experience.length === 0) return 0;

    let totalDays = 0;
    const currentDate = new Date();

    for (const exp of this._experience) {
      const endDate = exp.isCurrentRole ? currentDate : (exp.endDate || currentDate);
      const diffTime = endDate.getTime() - exp.startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDays += diffDays;
    }

    return Math.round((totalDays / 365) * 10) / 10; // Round to 1 decimal place
  }

  public getSkillsByProficiency(proficiency: string): ISkill[] {
    return this._skills?.filter(skill => skill.proficiency === proficiency) || [];
  }

  public hasSkill(skillName: string): boolean {
    return this._skills?.some(skill => 
      skill.name.toLowerCase() === skillName.toLowerCase()
    ) || false;
  }

  public isEmailVerified(): boolean {
    return !!this._emailVerifiedAt;
  }

  public isPhoneVerified(): boolean {
    return !!this._phoneVerifiedAt;
  }
}