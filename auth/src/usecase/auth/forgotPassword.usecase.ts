import { Dependencies, IUser } from "../../libs/entities/interfaces";
import Token from "../../libs/utils/token";

const forgetPasswordUseCase = (dependencies: Dependencies) => {
  const {
    repository: { userRepository },
  } = dependencies;

  if (!userRepository) {
    throw new Error("userReponsitoy should be add")
  }
  const execute = (email: string) => {
    const token = Token.generateForgetPasswordToken();
    const user = userRepository.forgetPassword({ email, token });
    return { token, user};
  };

  return {
    execute,
  };
};

export { forgetPasswordUseCase };
