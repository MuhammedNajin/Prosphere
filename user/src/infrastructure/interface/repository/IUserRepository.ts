import { IBaseRepository } from "./IBaseRepository";
import { IEducation, IExperience, ISkill, IUser } from "@domain/interface/IUser";




// Array operation types
export type ArrayOperation = 'push' | 'pull' | 'set';

// Valid array field names from IUser interface
export type UserArrayFields = 'experience' | 'education' | 'skills' | 'resumeKeys' | 'managedCompanies';

// Type mapping for array field values
export type ArrayFieldValue<T extends UserArrayFields> = 
  T extends 'experience' ? IExperience | IExperience[]
  : T extends 'education' ? IEducation | IEducation[]
  : T extends 'skills' ? ISkill | ISkill[]
  : T extends 'resumeKeys' ? string | string[]
  : T extends 'managedCompanies' ? string | string[]
  : never;

// Generic type for array field values (when field is not known at compile time)
export type ArrayFieldValueUnion = 
  | IExperience 
  | IExperience[]
  | IEducation 
  | IEducation[]
  | ISkill 
  | ISkill[]
  | string 
  | string[];


/**
 * @interface IUserRepository
 * @extends {IBaseRepository<IUser, "users">}
 * @description Defines the contract for the user repository. This interface outlines all
 * methods specific to user data operations, extending the generic base repository
 * with user-focused functionalities. It ensures a consistent API for accessing and
 * manipulating user data.
 */
export interface IUserRepository extends IBaseRepository<IUser, "users"> {
  /**
   * Finds a single user by their unique email address. This method is crucial for
   * authentication and for checking if an email is already registered.
   *
   * @param {string} email - The email address of the user to find.
   * @returns {Promise<IUser | null>} A promise that resolves to the user object if found, otherwise resolves to `null`.
   */
  findByEmail(email: string): Promise<IUser | null>;

  /**
   * Searches for users by their username. The search is typically performed
   * as a case-insensitive partial match to provide flexible search functionality.
   *
   * @param {string} query - The search term to match against usernames.
   * @returns {Promise<IUser[]>} A promise that resolves to an array of user objects that match the query. The array will be empty if no matches are found.
   */
  search(query: string): Promise<IUser[]>;

  /**
   * Adds a resume key to a specific user's profile. This key typically points to a file
   * stored in a cloud service like AWS S3.
   *
   * @param {string} id - The unique identifier of the user whose profile is to be updated.
   * @param {string} resumeKey - The key or identifier for the resume file to be added.
   * @returns {Promise<IUser | null>} A promise that resolves to the updated user object, or `null` if the user was not found.
   */
  addResume(id: string, resumeKey: string): Promise<IUser | null>;


/**
   * Update array field with specific operation
   * @param email - User email
   * @param fieldPath - Array field path (e.g., 'experience', 'skills')
   * @param operation - Array operation type
   * @param value - Value to add/remove/set
   */
updateArrayField(
  email: string,
  fieldPath: UserArrayFields,
  operation: ArrayOperation,
  value: ArrayFieldValueUnion
): Promise<IUser | null>;
  

  /**
   * Removes a resume key from a user's profile, effectively detaching the resume file
   * from the user's account.
   *
   * @param {string} id - The unique identifier of the user whose profile is to be updated.
   * @param {string} resumeKey - The key of the resume to be removed from the user's profile.
   * @returns {Promise<IUser | null>} A promise that resolves to the updated user object, or `null` if the user or resume key was not found.
   */
  removeResume(id: string, resumeKey: string): Promise<IUser | null>;
}