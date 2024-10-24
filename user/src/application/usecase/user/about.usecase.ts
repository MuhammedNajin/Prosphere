
export const aboutUseCase = (dependencies: any) => {
    const {
      repository: { profileRepository },
    } = dependencies;
  
    if (!profileRepository) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async ({ description, email }) => {
      const user = await profileRepository.aboutMe(description, email);
      return user;
    }
    return {
      execute,
    };
  };
  