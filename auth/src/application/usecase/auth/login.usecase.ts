import { User, } from "@domain/entities/user";
import { IUser } from "@domain/entities/interfaces";
import { Dependencies } from "@domain/entities/interfaces";

export const loginUseCase = (dependencies: Dependencies) => {
  const {
    repository: { userRepository },
  } = dependencies;

  if (!userRepository) {
    throw new Error("dependencies error, missing dependencies");
  }

  const execute = ({ email, password }: Pick<IUser, "email" | "password">) => {
    const userCredential = { email, password };
    return userRepository.login(userCredential);
  };

  return {
    execute,
  };
};
