
export const addEmployeeUseCase = (dependencies: any) => {
  const {
    repository: { companyRepository },
  } = dependencies;

  if (!companyRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (companyId: string, userId: string) => {
    return await companyRepository.addEmployee(companyId, userId);
  };

  return {
    execute,
  };
};
