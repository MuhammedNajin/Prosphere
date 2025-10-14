import { IUser } from "@/domain/interface/IUser";
import { IBaseRepository } from "./IBaseRepository";

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
  search(query: string, limit: number): Promise<IUser[]>;
}