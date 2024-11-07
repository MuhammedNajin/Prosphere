import { validateObjectId } from "@/application/usecaseValidation/validateUseCaseParams";
import { ICompany } from "../../interface";

export const getCompanyByIdUseCase = (dependencies: any) => {
  const {
    repository: { companyRepository },
  } = dependencies;

  if (!companyRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (_id: string) => {
    try {
        console.log(_id)
        
        if(!_id || !validateObjectId(_id)) {
            throw new Error("argumen is not provided")
        }
        
        return await companyRepository.getCompanyById(_id);

    } catch (error) {
        console.log(error);
        throw error;
    }
   
  };

  return {
    execute,
  };

};
