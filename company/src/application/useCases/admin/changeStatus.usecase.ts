import { ICompany } from "../../interface";

export const changeCompanyStatusUseCase = (dependencies: any) => {
  const {
    repository: { companyRepository },
  } = dependencies;

  if (!companyRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (status: string, id: string) => {
    console.log(" usecase ", status, id);
    
    return await companyRepository.changeCompanyStatus(status, id);
  };

  return {
    execute,
  };

};
