import { ICompany } from "../../interface";



export const getCompanyUseCase = (dependencies: any) => {
  const {
    repository: { companyRepository },
  } = dependencies;

  if (!companyRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (url: ICompany["urlAdrress"]) => {
    const companyDetails = await companyRepository.getCompany(url);
    return companyDetails;
  };

  return {
    execute,
  };

};
