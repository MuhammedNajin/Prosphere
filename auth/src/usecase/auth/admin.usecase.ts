import { Dependencies, IUser } from "../../libs/entities/interfaces";

export const adminUseCase = (dependencies: Dependencies) => {
  const {
    repository: { userRepository },
  } = dependencies;

  if (!userRepository) {
    throw new Error("dependency required, missing dependency");
  }

  const execute = async ({ email, password }: Pick<IUser, "email" | "password">) => {
       const adminEmail = process.env.ADMIN_EMAIL;
       const adminPassword = process.env.ADMIN_PASS;

       if(adminEmail === email && adminPassword === password) {
          
           return { status: true, message: "Successfully logined"}

       }
       
       const admin = await userRepository.adminLogin({email, password});

       if(!admin) {
         return { status: false, message: "Invalid credential"}
       }
      
       return { status: true, message: "Successfully logined" }
  };

  return {
    execute,
  };
};
