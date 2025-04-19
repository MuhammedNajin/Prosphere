


export const searchUserUseCase = (dependencies: any) => {
    const {
      repository: { profileRepository},
    } = dependencies;
  
    if (!profileRepository) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async (search: string) => {
      return await profileRepository.search(search);
    }
    return {
      execute,
    };
  };
  