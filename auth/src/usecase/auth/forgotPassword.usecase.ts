import { Dependencies, IUser } from "../../libs/entities/interfaces";
import Token from "../../libs/utils/token";

const forgetPasswordUseCase = (dependencies: Dependencies) => {
  const {
    repository: { userRepository },
  } = dependencies;

  if (!userRepository) {
    throw new Error("userReponsitoy should be add")
  }
  const execute = async (email: string) => {
    const token = Token.generateForgetPasswordToken();
    const user = await userRepository.forgetPassword({ email, token });
    if(!user) {
       return false;
    }
    return { token, user};
  };

  return {
    execute,
  };
};

export { forgetPasswordUseCase };
