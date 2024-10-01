import { ICompany } from "../../interface";

export const createCompanyUseCase = (dependencies: any) => {
  const {
    repository: { companyRepository },
  } = dependencies;

  if (!companyRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (company: ICompany) => {
    const companyDetails = await companyRepository.createCompany(company);

    return companyDetails;
  };
  return {
    execute,
  };
};
