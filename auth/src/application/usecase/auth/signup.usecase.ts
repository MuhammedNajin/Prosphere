
import { Dependencies, IUser} from "@domain/entities/interfaces";
import {  User } from "@domain/entities/user";


export const signupUseCase = (dependencies: Dependencies) => {
    const {
        repository: { userRepository, redisRepository }
    } = dependencies;

    if(!userRepository) {
        throw new Error("dependencies error, missing dependencies");
    }

    const execute = async (email: string, phone: string) => {
        const user = await redisRepository.getUser(email)
        console.log("attrs", user)
       return userRepository.signUp(user)
    }
    return {
        execute,
    }
}