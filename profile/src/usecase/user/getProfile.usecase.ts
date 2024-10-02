
export const getProfileUseCase = (dependencies: any) => {
    const {
      repository: { profileRepository },
    } = dependencies;
  
    if (!profileRepository) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async ({ email }) => {
       return await profileRepository.getProfile(email);
    }
    return {
      execute,
    };
  };
  