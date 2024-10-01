import { IUser } from '../../interface'
export const createUserUseCase = (dependencies: any) => {
    const {
      repository: { userRepository },
    } = dependencies;
  
    if (!userRepository) {
      throw new Error("dependency required, missing dependency");
    }
  
    const execute = async (user: IUser) => {
       
        const profile = await userRepository.createUser(user);
        
        return profile;
    }
    return {
      execute,
    };
  };
  