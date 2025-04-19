export const deleteResumeUseCase = (dependencies: any) => {
    const {
      repository: { profileRepository },
    } = dependencies;
  
    if (!profileRepository) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async (key: string, id: string) => {
      return await profileRepository.deleteResume(key, id);
    };
  
    return {
      execute,
    };
  };
  