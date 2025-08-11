/**
 * Defines the standard "read" operations for any entity.
 * @template T The entity type.
 */
export interface IBaseQueryRepository<T, K extends string> {
  findById(id: string): Promise<T | null>;
  findAll(
    page?: number,
    limit?: number
  ): Promise<{ total: number } & { [P in K]: T[] }>;
}

/**
 * Defines the standard "write" operations for any entity.
 * @template T The entity type.
 */
export interface IBaseCommandRepository<T> {
  create(attrs: Partial<T>): Promise<T>;
  update(id: string, attrs: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>; // It's good practice to have a delete method
}

/**
 * A generic base repository that combines both read and write operations.
 * Any specific repository (like for Users, Products, etc.) can extend this.
 * @template T The entity type.
 */
export interface IBaseRepository<T, K extends string>
  extends IBaseQueryRepository<T, K>,
    IBaseCommandRepository<T> {}
