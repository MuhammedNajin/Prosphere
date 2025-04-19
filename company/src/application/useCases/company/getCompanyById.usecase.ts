import { validateObjectId } from "@/application/usecaseValidation/validateUseCaseParams";
import { ICompany } from "../../interface";

export const getCompanyByIdUseCase = (dependencies: any) => {
  const {
    repository: { companyRepository },
  } = dependencies;

  if (!companyRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (id: string) => {
    try {
        console.log(id)
        
        if(!id || !validateObjectId(id)) {
            throw new Error("argumen is not provided")
        }
        
        return await companyRepository.getCompanyById(id);

    } catch (error) {
        console.log(error);
        throw error;
    }
   
  };

  return {
    execute,
  };

};
