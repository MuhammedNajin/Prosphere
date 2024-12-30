import {  User } from "@domain/entities/user";
import { Dependencies, IUser } from "@domain/entities/interfaces";

export const getUserUseCase = (dependencies: Dependencies) => {
  const {
    repository: { userRepository },
  } = dependencies;

  if (!userRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = ({ email, phone }: Pick<IUser, "email" | "phone">) => {
    return userRepository.getUser({ email, phone });
  };

  return {
    execute,
  };
};
