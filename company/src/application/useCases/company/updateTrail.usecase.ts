
export const updateTrailUseCase = (dependencies: any) => {
    
    const {
      repository: { companyRepository, subscriptionRepository },
    } = dependencies;
  
    if (!companyRepository) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async (companyId: string, key: string) => {
      return await subscriptionRepository.updateFreeTrail(companyId, key);
    };
  
    return {
      execute,
    };
  };
  