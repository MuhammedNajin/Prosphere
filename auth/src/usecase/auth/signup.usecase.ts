
import { Dependencies, IUser} from "../../libs/entities/interfaces";
import {  User } from "../../libs/entities";


export const signupUseCase = (dependencies: Dependencies) => {
    const {
        repository: { userRepository }
    } = dependencies;

    if(!userRepository) {
        throw new Error("dependencies error, missing dependencies");
    }

    const execute = (attrs: IUser) => {
       const user = new User(attrs);
       return userRepository.signUp(user);
    }

    return {
        execute,
    }
}