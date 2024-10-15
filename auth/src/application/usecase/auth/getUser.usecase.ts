import {  User } from "@domain/entities/user";
import { Dependencies, IUser } from "@domain/entities/interfaces";

export const getUserUseCase = (dependencies: Dependencies) => {
  const {
    repository: { userRepository },
  } = dependencies;

  if (!userRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = ({ email }: Pick<IUser, "email">) => {
    return userRepository.getUser({ email });
  };

  return {
    execute,
  };
};
