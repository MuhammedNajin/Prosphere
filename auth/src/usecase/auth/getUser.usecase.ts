import {  User } from "../../libs/entities";
import { Dependencies, IUser } from "../../libs/entities/interfaces";

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
