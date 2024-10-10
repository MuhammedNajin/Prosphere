
export const createProfileUseCase = (dependencies: any) => {
    const {
      repository: { profileRepository },
    } = dependencies;
  
    if (!profileRepository) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async (user) => {
       
        const profile = await profileRepository.createProfile(user);
        
        return profile;
    }
    return {
      execute,
    };
  };
  