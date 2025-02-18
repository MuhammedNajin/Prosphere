
import { Dependencies, IUser } from "@domain/entities/interfaces";

export const changePasswordUseCase = (dependencies: Dependencies) => {
  const {
    repository: { userRepository },
  } = dependencies;

  if (!userRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = (oldPassword: string, newPassword: string, id: string) => {
     try {

        return userRepository.changePassword(oldPassword, newPassword, id);

     } catch (error) {
        
        throw error;
     }
  };

  return {
    execute,
  };
};
