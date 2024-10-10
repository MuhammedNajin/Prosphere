
export const updateProfileUseCase = (dependencies: any) => {

    const {
      repository: { profileRepository },
    } = dependencies;
  
    if (!profileRepository) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async ({ 
         email,
         body,
         array
        }: {
         email: string, 
         body: Object,
         array: boolean
        }) => {

       return await profileRepository.updateProfile(email, body, { isArray: array });    
    }
    return {
      execute,
    };
  };
  