import { ICompany } from "../../interface";



export const getEmployeesUseCase = (dependencies: any) => {
  const {
    repository: { companyRepository },
  } = dependencies;

  if (!companyRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (companyId: string) => {
    return await companyRepository.getEployees(companyId);
  };

  return {
    execute,
  };

};
