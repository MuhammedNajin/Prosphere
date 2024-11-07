import { ICompany } from "@/application/interface";
import { validateObjectId } from "@application/usecaseValidation/validateUseCaseParams";



/**
 * Use case for updating company profile
 * 
 * @param {Dependencies} dependencies - Required dependencies
 * @throws {Error} If dependencies are missing
 */

export const updateProfileUseCase = (dependencies: any) => {
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
    body
  }: {
    id: string;
    body: Partial<ICompany>;
  }) => {
    try {

      // Validate _id
      if (!id || !validateObjectId(id)) {
        throw new Error("Invalid company ID");
      }

      // Validate body
      if (!body || Object.keys(body).length === 0) {
        throw new Error("Update payload cannot be empty");
      }

      // perform updation 
      return await companyRepository.updateCompany(id, body);

    } catch (error) {
      console.log(error);
      throw error;
    }

  };
  return {
    execute,
  };
};
