import { ICompany } from "@/application/interface";
import { validateObjectId } from "@application/usecaseValidation/validateUseCaseParams";



/**
 * Use case for updating company profile
 * 
 * @param {Dependencies} dependencies - Required dependencies
 * @throws {Error} If dependencies are missing
 */

export const uploadCompanyVerificationDocsUseCase = (dependencies: any) => {
  const {
    repository: { companyRepository },
  } = dependencies;

  if (!companyRepository) {
    throw new Error("dependency required, missing dependency");
  }

  /**
   * Executes the update profile operation
   * 
   * @param {ExecuteParams} params - Parameters for the update operation
   * @returns {Promise<UpdateResult>} Result of the update operation
   * @throws {Error} If validation fails or update operation fails
   */

  const execute = async ({
    id,
    companyDoc,
    ownerDoc
  }: {
    id: string;
    companyDoc: unknown;
    ownerDoc: unknown;
  }) => {
    try {

      // Validate _id
      if (!id || !validateObjectId(id)) {
        throw new Error("Invalid company ID");
      }
      return await companyRepository.uploadDocs(ownerDoc, companyDoc, id);
    } catch (error) {
      console.log(error);
      throw error;
    }

  };
  return {
    execute,
  };
};
