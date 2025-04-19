
export const searchUserUseCase = (dependencies: any) => {
  const {
    repository: { userRepository },
  } = dependencies;

  if (!userRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (searchQuery: string) => {
    return await userRepository.searchUser(searchQuery);
   
  };

  return {
    execute,
  };

};
