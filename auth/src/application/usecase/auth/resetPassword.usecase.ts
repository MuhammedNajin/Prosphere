import { Dependencies, IUser } from "@domain/entities/interfaces";


const resetPasswordUseCase = (dependencies: Dependencies) => {
  const {
    repository: { userRepository },
  } = dependencies;

  const execute = ({ token, password }: { token: string, password: string }) => {
   
    const user = userRepository.resetPassword({ token, password})
    return user;
  };

  return {
    execute,
  };
};

export { resetPasswordUseCase };
