import { Dependencies, IUser } from "@domain/entities/interfaces";

export const adminUseCase = (dependencies: Dependencies) => {
  const {
    repository: { userRepository },
  } = dependencies;

  if (!userRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async ({
    email,
    password,
  }: Pick<IUser, "email" | "password">) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASS;

    if (adminEmail === email && adminPassword === password) {
      return true;
    }

    const admin = await userRepository.adminLogin({ email, password });

    if (!admin) {
      return false;
    }

    return true;
  };

  return {
    execute,
  };
};
