
export const subscriptionCheckUseCase = (dependencies: any) => {
    
  const {
    repository: { companyRepository, subscriptionRepository },
  } = dependencies;

  if (!companyRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (companyId: string) => {
    return await subscriptionRepository.findSubscription(companyId);
  };

  return {
    execute,
  };
};
