import { ICompany } from "../../interface";

export const getCompaniesUseCase = (dependencies: any) => {
  const {
    repository: { companyRepository },
  } = dependencies;

  if (!companyRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async () => {
    return await companyRepository.getCompanies();
  };

  return {
    execute,
  };

};
