import { ICompany } from "@/domain/interface/ICompany";
import { ICompanyRepository } from "@/infrastructure/interface/repositories/ICompanyRepository";
import { inject, injectable } from "inversify";
import { Company } from "@/domain/entities/company";
import { BadRequestError } from "@muhammednajinnprosphere/common";
import { MessageBrokers, Repositories } from "@/di/symbols";
import { CompanyStatus } from "@/shared/constance";
import { CompanyCreatedProducer } from "@/infrastructure/message-broker/kafka";

@injectable()
export class CreateCompanyUseCase {
  constructor(
    @inject(Repositories.CompanyRepository)
    private companyRepository: ICompanyRepository,
    @inject(MessageBrokers.CompanyCreatedProducer)
    private companyCreateProducer: CompanyCreatedProducer
  ) {}

  async execute(attrs: Partial<ICompany>): Promise<ICompany> {
    const existing = await this.companyRepository.findByName(attrs.name!);
    if (existing) {
      throw new BadRequestError(
        `Company already exists with name ${attrs.name}`
      );
    }

    const existingBywebsite = await this.companyRepository.findByWebsite(attrs.website!);
    if (existingBywebsite) {
      throw new BadRequestError(
        `Company already exists with website ${attrs.website}`
      );
    }
    const id = this.companyRepository.generateId();
    const company = Company.create({
      ...attrs,
      id,
      industry: "IT",
      status: CompanyStatus.PENDING,
    });

    const comapanyDto = await this.companyRepository.create(company.toDTO());

    console.log("Company created:", comapanyDto);

    await this.companyCreateProducer.produce({
       id: comapanyDto.id,
       name: comapanyDto.name,  
       location: comapanyDto.locations,
       owner: comapanyDto.owner,
    })

    return comapanyDto;
  }
}
