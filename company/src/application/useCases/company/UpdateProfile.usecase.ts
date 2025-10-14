import { injectable, inject } from "inversify";
import { ICompany } from "@/domain/interface/ICompany";
import { ICompanyRepository } from "@/infrastructure/interface/repositories/ICompanyRepository";
import { Repositories } from "@/di/symbols";
import { NotFoundError } from "@muhammednajinnprosphere/common";
import { Company } from "@/domain/entities/company";

interface UpdataProfileParams {
  id: string;
  body: Partial<ICompany>;
}

@injectable()
export class UpdateProfileUseCase {
  constructor(
    @inject(Repositories.CompanyRepository)
    private companyRepository: ICompanyRepository
  ) {}

  async execute({ id, body }: UpdataProfileParams): Promise<ICompany> {
    // 1. Fetch company
    const existing = await this.companyRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Company with ID '${id}' not found.`);
    }

    console.log("Existing company data:", existing);

    const company = Company.create({
      ...existing,
      owner: existing.owner.id.toString(),
      id: existing.id.toString(),
    });

    // 3. Apply updates via domain methods
    company.updateProfile(body);

    // 4. Persist updated entity
    const updated = await this.companyRepository.update(id, company.toDTO());

    if (!updated) {
      throw new NotFoundError(`Failed to update company with ID '${id}'.`);
    }

    // 5. Return DTO for response
    return company.toJSON();
  }
}
