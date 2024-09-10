
import { Dependencies} from "../../libs/entities/interfaces";



export const blockUserUseCase = (dependencies: Dependencies) => {
    const {
        repository: { userRepository }
    } = dependencies;

    if(!userRepository) {
        throw new Error("dependencies error, missing dependencies");
    }

    const execute = async (email: string) => {
        const users = await userRepository.blockUser(email);
        return users;
    }

    return {
        execute,
    }
}