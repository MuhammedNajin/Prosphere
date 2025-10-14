import { Repositories } from "@/di/symbols";
import { IUser } from "@/domain/interface/IUser";
import { IUserRepository, UserArrayFields, ArrayFieldValueUnion } from "@/infrastructure/interface/repository/IUserRepository";
import { BadRequestError, NotFoundError } from "@muhammednajinnprosphere/common";
import { inject, injectable } from "inversify";

export enum UpdateType {
  REPLACE = 'replace',
  ARRAY_PUSH = 'array_push',
  ARRAY_PULL = 'array_pull',
  ARRAY_SET = 'array_set'
}

export interface UpdateProfileRequest {
  id: string;
  updateData: Partial<IUser>;
  updateType?: UpdateType;
  arrayField?: string;
}

@injectable()
export class UpdateProfileUseCase {
  constructor(
    @inject(Repositories.UserRepository) private readonly userRepository: IUserRepository
  ) {}

  async execute(request: UpdateProfileRequest): Promise<IUser> {
    const { id, updateData, updateType = UpdateType.REPLACE, arrayField } = request;


    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

      let updatedUser: IUser | null;

      switch (updateType) {
        case UpdateType.REPLACE:
          updatedUser = await this.userRepository.update(id, updateData);
          break;

        case UpdateType.ARRAY_PUSH:
          if (!arrayField) {
            throw new BadRequestError("Array field is required for array operations");
          }
          updatedUser = await this.userRepository.updateArrayField(
            id, 
            arrayField as UserArrayFields, 
            'push', 
            updateData[arrayField as keyof IUser] as ArrayFieldValueUnion
          );
          break;

        case UpdateType.ARRAY_PULL:
          if (!arrayField) {
            throw new BadRequestError("Array field is required for array operations");
          }
          updatedUser = await this.userRepository.updateArrayField(
            id, 
            arrayField as UserArrayFields, 
            'pull', 
            updateData[arrayField as keyof IUser] as ArrayFieldValueUnion
          );
          break;

        case UpdateType.ARRAY_SET:
          if (!arrayField) {
            throw new BadRequestError("Array field is required for array operations");
          }
          updatedUser = await this.userRepository.updateArrayField(
            id, 
            arrayField as UserArrayFields, 
            'set', 
            updateData[arrayField as keyof IUser] as ArrayFieldValueUnion
          );
          break;

        default:
          throw new BadRequestError("Invalid update type");
      }

      if (!updatedUser) {
        throw new NotFoundError("Failed to update user");
      }

      return updatedUser;
  }
}