import { IAuth } from "@domain/interface/IAuth";
import { IBaseCommandRepository, IBaseQueryRepository } from "./IBaseRepository";

/**
 * Defines all "read" operations specific to the Auth entity.
 */
export interface IAuthQueryRepository extends IBaseQueryRepository<IAuth, 'auths'> {
  findByEmail(email: string): Promise<IAuth | null>;
  findByUsername(username: string): Promise<IAuth | null>;
}

/**
 * Defines all "write" operations specific to the Auth entity.
 * Note: The 'create' method uses the specific IAuthAttrs type.
 */
export interface IAuthCommandRepository extends IBaseCommandRepository<IAuth> {
  create(attrs: IAuth): Promise<IAuth>; // Override create for specific attrs
  updateByUserId(userId: string, attrs: Partial<IAuth>): Promise<IAuth | null>;
  deleteByUserId(userId: string): Promise<boolean>;
  updateByEmail(email: string,  attrs: Partial<IAuth>): Promise<IAuth | null>;
}

/**
 * Combines the query and command interfaces for a complete Auth repository definition.
 */
export interface IAuthRepository extends IAuthQueryRepository, IAuthCommandRepository {
   generateId(): string;
}
