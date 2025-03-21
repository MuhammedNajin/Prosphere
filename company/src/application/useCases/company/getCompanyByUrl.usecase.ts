import { ICompany } from "../../interface";



export const getCompanyUseCase = (dependencies: any) => {
  const {
    repository: { companyRepository },
  } = dependencies;

  if (!companyRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (id: string) => {
    const companyDetails = await companyRepository.getCompany(id);
    return companyDetails;
  };

  return {
    execute,
  };

};
