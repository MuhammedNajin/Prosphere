
import { Dependencies} from "../../libs/entities/interfaces";



export const getUsersUseCase = (dependencies: Dependencies) => {
    const {
        repository: { userRepository }
    } = dependencies;

    if(!userRepository) {
        throw new Error("dependencies error, missing dependencies");
    }

    const execute = async () => {
        const users = await userRepository.fetchUsers();
        return users;
    }

    return {
        execute,
    }
}