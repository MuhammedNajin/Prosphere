


export const getProfileUseCase = (dependencies: any) => {
    const {
      repository: { profileRepository},
      service: { s3Operation }
    } = dependencies;
  
    if (!profileRepository) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async (id: string) => {
      return await profileRepository.getProfile(id);
    }
    return {
      execute,
    };
  };
  