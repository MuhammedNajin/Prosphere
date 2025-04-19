import { ICompany } from "../../interface";



export const getCompanyUseCase = (dependencies: any) => {
  const {
    repository: { companyRepository },
  } = dependencies;

  if (!companyRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (name: string) => {
    const companyDetails = await companyRepository.getCompany(name);
    return companyDetails;
  };

  return {
    execute,
  };

};
