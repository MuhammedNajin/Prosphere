import { IApplicationEntity } from "@/domain/interface/IEntity.js";
import { IgetAllApplicationUseCase } from "../../interface/applicationUsecase_interface.ts";
import { IApplicationRepository } from "@domain/interface/IApplicationRepository.js";
import { ApplicationFilter, GetAllApplicationReturnType } from "@/shared/types/application.js";

export class GetAllApplicationUseCase implements IgetAllApplicationUseCase {
  constructor(private applicationRepository: IApplicationRepository) {}

  async execute(
    companyId: string,
    { page, pageSize, search, filter }: ApplicationFilter
  ): Promise<GetAllApplicationReturnType | null> {
    return await this.applicationRepository.getAll(companyId, {
      page,
      pageSize,
      search,
      filter,
    });
  }
}
