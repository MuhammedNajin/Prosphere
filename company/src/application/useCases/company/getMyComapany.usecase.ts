import { ICompany } from "../../interface";



export const getMyCompanyUseCase = (dependencies: any) => {
  const {
    repository: { companyRepository },
  } = dependencies;

  if (!companyRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (id: string) => {
    return await companyRepository.getMyCompany(id);
  };

  return {
    execute,
  };

};
