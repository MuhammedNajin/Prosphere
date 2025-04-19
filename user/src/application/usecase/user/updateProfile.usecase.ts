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
    array,
  }: {
    email: string;
    body: Object;
    array: boolean;
  }) => {

    try {

      if (!body || Object.keys(body).length === 0) {
        throw new Error("Update payload cannot be empty");
      }

      return await profileRepository.updateProfile(email, body, {
        isArray: array,
      });

    } catch (error) {

      throw error;
    }
    
  };
  return {
    execute,
  };
};
