import { User, } from "../../libs/entities";
import { IUser } from "../../libs/entities/interfaces";
import { Dependencies } from "../../libs/entities/interfaces";

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
