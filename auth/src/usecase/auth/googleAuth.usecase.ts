import { Dependencies, IUser } from "../../libs/entities/interfaces";
import Token from "../../libs/utils/token";

export const googleAuthUseCase = (dependencies: Dependencies) => {
  const {
    repository: { userRepository },
  } = dependencies;

  if (!userRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async (token: string) => {
    const payload = await Token.verifyGoogleAuth(token);
    if(!payload) {
        return { status: '', user: null }
    }
    const firstName = payload["given_name"];
    const lastName = payload["family_name"];
    const email = payload["email"];
    const credential = {
      email: email,
      username: `${firstName} ${lastName}`,
    };
    const auth = await userRepository.googleAuth(credential);

    return auth;
  };

  return {
    execute,
  };
};
