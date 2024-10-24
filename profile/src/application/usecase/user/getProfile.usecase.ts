
export const getProfileUseCase = (dependencies: any) => {
    const {
      repository: { profileRepository},
      service: { s3Operation }
    } = dependencies;
  
    if (!profileRepository) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async ({ email }) => {
       const profile =  await profileRepository.getProfile(email);
       return profile;
    }
    return {
      execute,
    };
  };
  